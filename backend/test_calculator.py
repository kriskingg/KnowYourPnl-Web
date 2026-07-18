import unittest

from .calculator import CalculationError, calculate_mtf, compare_mtf, project_holding_periods


SCENARIO = {
    "brokerSlug": "kotak-neo",
    "planId": "neo-trader",
    "buyPrice": 2890.5,
    "quantity": 40,
    "expectedSellPrice": 3050,
    "purchaseDate": "2026-01-08",
    "expectedExitDate": "2026-03-08",
    "pledgeRequests": 1,
    "unpledgeRequests": 1,
    "dpDebitEvents": 1,
}


class CalculatorTests(unittest.TestCase):
    def test_calculation_returns_aggregated_results_without_private_rates(self):
        result = calculate_mtf(SCENARIO)
        self.assertGreater(result["breakdown"]["total"], 0)
        self.assertEqual(result["holdingDays"], 59)
        serialized = repr(result)
        self.assertNotIn("annual_interest_rate_pct", serialized)
        self.assertNotIn("buy_brokerage", serialized)
        self.assertNotIn("user_margin_pct", serialized)

    def test_projection_uses_private_model(self):
        rows = project_holding_periods(SCENARIO, [7, 30, 90])
        self.assertEqual([row["days"] for row in rows], [7, 30, 90])
        self.assertLess(rows[0]["interest"], rows[-1]["interest"])

    def test_comparison_does_not_return_rule_level_costs(self):
        public_scenario = {
            key: value
            for key, value in SCENARIO.items()
            if key not in {"brokerSlug", "planId"}
        }
        rows = compare_mtf(public_scenario)
        self.assertEqual(rows[0]["brokerSlug"], "kotak-neo")
        self.assertNotIn("brokerage", rows[0])
        self.assertNotIn("taxesAndOps", rows[0])

    def test_rejects_unknown_broker(self):
        with self.assertRaises(CalculationError):
            calculate_mtf({**SCENARIO, "brokerSlug": "unknown"})


if __name__ == "__main__":
    unittest.main()
