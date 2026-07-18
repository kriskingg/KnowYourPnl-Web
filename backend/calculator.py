from datetime import date, datetime, timezone
from typing import Any

from .private_tariffs import BROKERS

METHODOLOGY_VERSION = "mtf-methodology-v2-private"


class CalculationError(ValueError):
    pass


def _number(value: Any, name: str, minimum: float, maximum: float) -> float:
    if isinstance(value, bool):
        raise CalculationError(f"{name} must be a number")
    try:
        parsed = float(value)
    except (TypeError, ValueError) as exc:
        raise CalculationError(f"{name} must be a number") from exc
    if parsed < minimum or parsed > maximum:
        raise CalculationError(f"{name} must be between {minimum} and {maximum}")
    return parsed


def _whole_number(value: Any, name: str, minimum: int, maximum: int) -> int:
    parsed = _number(value, name, minimum, maximum)
    if not parsed.is_integer():
        raise CalculationError(f"{name} must be a whole number")
    return int(parsed)


def _iso_date(value: Any, name: str) -> date:
    if not isinstance(value, str):
        raise CalculationError(f"{name} must be an ISO date")
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise CalculationError(f"{name} must be an ISO date") from exc


def validate_input(payload: dict[str, Any]) -> dict[str, Any]:
    broker_slug = str(payload.get("brokerSlug", ""))
    broker = BROKERS.get(broker_slug)
    if broker is None:
        raise CalculationError("Unsupported broker")

    plan_id = str(payload.get("planId", ""))
    if plan_id not in broker["private"]["plans"]:
        raise CalculationError("Unsupported brokerage plan")

    purchase_date = _iso_date(payload.get("purchaseDate"), "purchaseDate")
    exit_date = _iso_date(payload.get("expectedExitDate"), "expectedExitDate")
    holding_days = (exit_date - purchase_date).days
    if holding_days < 0 or holding_days > 3660:
        raise CalculationError("Holding period must be between 0 and 3660 days")

    return {
        "brokerSlug": broker_slug,
        "planId": plan_id,
        "buyPrice": _number(payload.get("buyPrice"), "buyPrice", 0.01, 10_000_000),
        "quantity": _whole_number(payload.get("quantity"), "quantity", 1, 10_000_000),
        "expectedSellPrice": _number(
            payload.get("expectedSellPrice"), "expectedSellPrice", 0.01, 10_000_000
        ),
        "purchaseDate": purchase_date.isoformat(),
        "expectedExitDate": exit_date.isoformat(),
        "pledgeRequests": _whole_number(
            payload.get("pledgeRequests", 1), "pledgeRequests", 0, 100
        ),
        "unpledgeRequests": _whole_number(
            payload.get("unpledgeRequests", 1), "unpledgeRequests", 0, 100
        ),
        "dpDebitEvents": _whole_number(
            payload.get("dpDebitEvents", 1), "dpDebitEvents", 0, 100
        ),
    }


def _brokerage(rule: dict[str, Any], turnover: float) -> float:
    if rule["unit"] == "percent":
        charge = rule["value"] / 100 * turnover
        return min(charge, rule.get("maximum", charge))
    return rule["value"]


def calculate_mtf(raw_input: dict[str, Any]) -> dict[str, Any]:
    scenario = validate_input(raw_input)
    record = BROKERS[scenario["brokerSlug"]]
    tariff = record["private"]
    plan = tariff["plans"][scenario["planId"]]

    trade_value = scenario["buyPrice"] * scenario["quantity"]
    sell_value = scenario["expectedSellPrice"] * scenario["quantity"]
    user_capital = tariff["user_margin_pct"] / 100 * trade_value
    broker_funded = tariff["broker_funded_pct"] / 100 * trade_value
    holding_days = (
        date.fromisoformat(scenario["expectedExitDate"])
        - date.fromisoformat(scenario["purchaseDate"])
    ).days

    interest = (
        broker_funded
        * tariff["annual_interest_rate_pct"]
        / 100
        / 365
        * holding_days
    )

    buy_brokerage = _brokerage(plan["buy_brokerage"], trade_value)
    sell_brokerage = _brokerage(plan["sell_brokerage"], sell_value)
    buy_statutory = (
        tariff["stamp_duty_pct"]
        + tariff["exchange_txn_pct"]
        + tariff["sebi_charges_pct"]
        + tariff["ipft_pct"]
    ) / 100 * trade_value
    sell_statutory = (
        tariff["stt_sell_pct"]
        + tariff["exchange_txn_pct"]
        + tariff["sebi_charges_pct"]
        + tariff["ipft_pct"]
    ) / 100 * sell_value
    operational = (
        scenario["pledgeRequests"] * tariff["pledge_fee_flat"]
        + scenario["unpledgeRequests"] * tariff["unpledge_fee_flat"]
        + scenario["dpDebitEvents"] * tariff["dp_charge_flat"]
    )

    taxable_base = (
        buy_brokerage
        + sell_brokerage
        + tariff["exchange_txn_pct"] / 100 * (trade_value + sell_value)
        + tariff["sebi_charges_pct"] / 100 * (trade_value + sell_value)
        + scenario["pledgeRequests"] * tariff["pledge_fee_flat"]
        + scenario["unpledgeRequests"] * tariff["unpledge_fee_flat"]
    )
    tax_on_services = tariff["gst_on_charges_pct"] / 100 * taxable_base

    entry_cost = buy_brokerage + buy_statutory
    exit_cost = sell_brokerage + sell_statutory
    total = entry_cost + exit_cost + interest + operational + tax_on_services
    gross_pnl = (scenario["expectedSellPrice"] - scenario["buyPrice"]) * scenario["quantity"]
    net_pnl = gross_pnl - total
    breakeven = scenario["buyPrice"] + total / scenario["quantity"]

    return {
        "input": scenario,
        "tradeValue": trade_value,
        "holdingDays": holding_days,
        "interestTotal": interest,
        "breakdown": {
            "buySide": [
                {
                    "key": "entry_costs",
                    "label": "Entry costs",
                    "side": "buy",
                    "amount": entry_cost,
                }
            ],
            "sellSide": [
                {
                    "key": "exit_costs",
                    "label": "Exit costs",
                    "side": "sell",
                    "amount": exit_cost,
                }
            ],
            "holding": [
                {
                    "key": "funding_cost",
                    "label": "MTF funding cost",
                    "side": "holding",
                    "amount": interest,
                }
            ],
            "operational": [
                {
                    "key": "operations_and_taxes",
                    "label": "Operations and applicable taxes",
                    "side": "operational",
                    "amount": operational + tax_on_services,
                }
            ],
            "total": total,
        },
        "grossPnl": gross_pnl,
        "netPnl": net_pnl,
        "breakevenPrice": breakeven,
        "returnOnMarketExposurePct": net_pnl / trade_value * 100 if trade_value else 0,
        "methodologyVersion": METHODOLOGY_VERSION,
        "tariffVersion": record["public"]["currentTariffVersion"],
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }


def project_holding_periods(
    raw_input: dict[str, Any], day_points: list[int] | None = None
) -> list[dict[str, Any]]:
    base = validate_input(raw_input)
    purchase = date.fromisoformat(base["purchaseDate"])
    rows = []
    for days in day_points or [7, 15, 30, 60, 90, 180, 365]:
        if days < 0 or days > 3660:
            raise CalculationError("Projection day points are outside the supported range")
        scenario = {**base, "expectedExitDate": date.fromordinal(purchase.toordinal() + days).isoformat()}
        result = calculate_mtf(scenario)
        rows.append(
            {
                "days": days,
                "interest": result["interestTotal"],
                "totalCost": result["breakdown"]["total"],
                "netPnl": result["netPnl"],
                "breakevenPrice": result["breakevenPrice"],
            }
        )
    return rows


def compare_mtf(raw_scenario: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for record in BROKERS.values():
        public = record["public"]
        plan = public["plans"][0]
        result = calculate_mtf(
            {
                **raw_scenario,
                "brokerSlug": public["slug"],
                "planId": plan["id"],
            }
        )
        rows.append(
            {
                "brokerSlug": public["slug"],
                "brokerName": public["name"],
                "planId": plan["id"],
                "planName": plan["name"],
                "tradeValue": result["tradeValue"],
                "totalCost": result["breakdown"]["total"],
                "interest": result["interestTotal"],
                "netPnl": result["netPnl"],
                "breakevenPrice": result["breakevenPrice"],
                "verificationStatus": public["verificationStatus"],
            }
        )
    return rows
