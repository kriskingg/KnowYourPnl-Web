import { describe, expect, it } from "vitest";
import { calculateMtf, projectHoldingPeriods } from "./calculationService";
import type { CalculationInput } from "@/types";

const input: CalculationInput = {
  brokerSlug: "kotak-neo", planId: "neo-trader", buyPrice: 1000, quantity: 100,
  expectedSellPrice: 1100, purchaseDate: "2026-01-01", expectedExitDate: "2026-01-31",
  userMarginPct: 25, brokerFundedPct: 75, annualInterestRatePct: 14.99,
  pledgeRequests: 1, unpledgeRequests: 1, dpDebitEvents: 1,
};

describe("MTF calculation", () => {
  it("calculates funding, holding days and a positive total cost", () => {
    const result = calculateMtf(input);
    expect(result.tradeValue).toBe(100000);
    expect(result.userCapital).toBe(25000);
    expect(result.brokerFunded).toBe(75000);
    expect(result.holdingDays).toBe(30);
    expect(result.breakdown.total).toBeGreaterThan(result.interestTotal);
  });
  it("raises break-even and cost as holding time increases", () => {
    const rows = projectHoldingPeriods(input, [7, 30, 90]);
    expect(rows[2].totalCost).toBeGreaterThan(rows[0].totalCost);
    expect(rows[2].breakevenPrice).toBeGreaterThan(rows[0].breakevenPrice);
  });
  it("honours user-edited brokerage assumptions", () => {
    const standard = calculateMtf(input);
    const edited = calculateMtf({ ...input, buyBrokeragePct: 1, sellBrokeragePct: 1 });
    expect(edited.breakdown.total).toBeGreaterThan(standard.breakdown.total);
  });
});
