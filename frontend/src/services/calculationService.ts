import type {
  Broker,
  CalculationInput,
  CalculationResult,
  CostBreakdown,
  CostLine,
  HoldingPeriodProjectionRow,
} from "@/types";
import { daysBetween } from "@/lib/formatters";
import { MOCK } from "./mockData";

const METHODOLOGY_VERSION = "mtf-methodology-v1";

function findPlanBrokerage(broker: Broker, planId: string) {
  const plan = broker.plans.find((p) => p.id === planId) ?? broker.plans[0];
  return plan;
}

// Compute brokerage: percent of turnover with optional cap
function brokerageForTurnover(rule: { value: number; unit: string; max?: number }, turnover: number) {
  if (rule.unit === "percent") {
    const raw = (rule.value / 100) * turnover;
    return rule.max ? Math.min(raw, rule.max) : raw;
  }
  if (rule.unit === "flat") return rule.value;
  return 0;
}

export function calculateMtf(input: CalculationInput): CalculationResult {
  const broker = MOCK.brokers.find((b) => b.slug === input.brokerSlug);
  if (!broker) {
    throw new Error(`Unknown broker: ${input.brokerSlug}`);
  }
  const mtf = { ...broker.mtf, ...(input.overrides ?? {}) };
  const plan = findPlanBrokerage(broker, input.planId);

  const tradeValue = input.buyPrice * input.quantity;
  const sellValue = input.expectedSellPrice * input.quantity;

  const userCapital = (input.userMarginPct / 100) * tradeValue;
  const brokerFunded = (input.brokerFundedPct / 100) * tradeValue;

  const holdingDays = daysBetween(input.purchaseDate, input.expectedExitDate);

  // Daily interest on broker-funded amount
  const dailyRate = input.annualInterestRatePct / 100 / 365;
  const interestTotal = brokerFunded * dailyRate * holdingDays;

  // Buy-side charges
  const buyBrokerage = brokerageForTurnover(
    input.buyBrokeragePct === undefined ? plan.buyBrokerage : { value: input.buyBrokeragePct, unit: "percent" },
    tradeValue,
  );
  const buySTT = 0; // STT applies on sell for equity delivery/MTF; buy typically 0
  const buyStamp = (mtf.stampDuty / 100) * tradeValue;
  const buyExchTxn = (mtf.exchangeTxnPct / 100) * tradeValue;
  const buySebi = (mtf.sebiChargesPct / 100) * tradeValue;
  const buyIpft = (mtf.ipftPct / 100) * tradeValue;

  // Sell-side charges
  const sellBrokerage = brokerageForTurnover(
    input.sellBrokeragePct === undefined ? plan.sellBrokerage : { value: input.sellBrokeragePct, unit: "percent" },
    sellValue,
  );
  const sellSTT = (mtf.stt.sell / 100) * sellValue;
  const sellExchTxn = (mtf.exchangeTxnPct / 100) * sellValue;
  const sellSebi = (mtf.sebiChargesPct / 100) * sellValue;
  const sellIpft = (mtf.ipftPct / 100) * sellValue;

  // Operational: pledge/unpledge/DP
  const pledgeCharges = input.pledgeRequests * mtf.pledgeFeeFlat;
  const unpledgeCharges = input.unpledgeRequests * mtf.unpledgeFeeFlat;
  const dpCharges = input.dpDebitEvents * mtf.dpChargeFlat;

  // GST applies to brokerage + txn charges + sebi + pledge/unpledge (per common conventions)
  const gstableBase =
    buyBrokerage +
    sellBrokerage +
    buyExchTxn +
    sellExchTxn +
    buySebi +
    sellSebi +
    pledgeCharges +
    unpledgeCharges;
  const gstOnAll = (mtf.gstOnCharges / 100) * gstableBase;

  const buySide: CostLine[] = [
    { key: "buy_brokerage", label: "Buy Brokerage", side: "buy", amount: buyBrokerage, gstApplied: true },
    { key: "buy_stamp", label: "Stamp Duty", side: "buy", amount: buyStamp },
    { key: "buy_exch_txn", label: "Exchange Txn Charges", side: "buy", amount: buyExchTxn, gstApplied: true },
    { key: "buy_sebi", label: "SEBI Charges", side: "buy", amount: buySebi, gstApplied: true },
    { key: "buy_ipft", label: "IPFT", side: "buy", amount: buyIpft },
    { key: "buy_stt", label: "STT (Buy)", side: "buy", amount: buySTT },
  ];
  const sellSide: CostLine[] = [
    { key: "sell_brokerage", label: "Sell Brokerage", side: "sell", amount: sellBrokerage, gstApplied: true },
    { key: "sell_stt", label: "STT (Sell)", side: "sell", amount: sellSTT },
    { key: "sell_exch_txn", label: "Exchange Txn Charges", side: "sell", amount: sellExchTxn, gstApplied: true },
    { key: "sell_sebi", label: "SEBI Charges", side: "sell", amount: sellSebi, gstApplied: true },
    { key: "sell_ipft", label: "IPFT", side: "sell", amount: sellIpft },
  ];
  const holding: CostLine[] = [
    {
      key: "mtf_interest",
      label: `MTF Interest (${holdingDays} days)`,
      side: "holding",
      amount: interestTotal,
      formula: `${brokerFunded.toFixed(2)} × ${input.annualInterestRatePct}%/365 × ${holdingDays}`,
    },
  ];
  const operational: CostLine[] = [
    { key: "pledge", label: "Pledge Charges", side: "operational", amount: pledgeCharges, gstApplied: true },
    { key: "unpledge", label: "Unpledge Charges", side: "operational", amount: unpledgeCharges, gstApplied: true },
    { key: "dp", label: "DP Charges", side: "operational", amount: dpCharges },
  ];

  const subtotal =
    buySide.reduce((s, l) => s + l.amount, 0) +
    sellSide.reduce((s, l) => s + l.amount, 0) +
    holding.reduce((s, l) => s + l.amount, 0) +
    operational.reduce((s, l) => s + l.amount, 0);

  const total = subtotal + gstOnAll;

  const breakdown: CostBreakdown = { buySide, sellSide, holding, operational, gstOnAll, total };

  const grossPnl = (input.expectedSellPrice - input.buyPrice) * input.quantity;
  const netPnl = grossPnl - total;

  const breakevenPrice = input.buyPrice + total / input.quantity;

  const returnOnUserCapitalPct = userCapital > 0 ? (netPnl / userCapital) * 100 : 0;
  const returnOnMarketExposurePct = tradeValue > 0 ? (netPnl / tradeValue) * 100 : 0;

  return {
    input,
    tradeValue,
    userCapital,
    brokerFunded,
    holdingDays,
    interestTotal,
    breakdown,
    grossPnl,
    netPnl,
    breakevenPrice,
    returnOnUserCapitalPct,
    returnOnMarketExposurePct,
    methodologyVersion: METHODOLOGY_VERSION,
    tariffVersion: broker.currentTariffVersion,
    generatedAt: new Date().toISOString(),
  };
}

export function projectHoldingPeriods(
  base: CalculationInput,
  dayPoints: number[] = [7, 15, 30, 60, 90, 180, 365]
): HoldingPeriodProjectionRow[] {
  const rows: HoldingPeriodProjectionRow[] = [];
  for (const days of dayPoints) {
    const exit = new Date(base.purchaseDate);
    exit.setDate(exit.getDate() + days);
    const scenarioInput: CalculationInput = {
      ...base,
      expectedExitDate: exit.toISOString().slice(0, 10),
    };
    const r = calculateMtf(scenarioInput);
    rows.push({
      days,
      interest: r.interestTotal,
      totalCost: r.breakdown.total,
      netPnl: r.netPnl,
      breakevenPrice: r.breakevenPrice,
    });
  }
  return rows;
}
