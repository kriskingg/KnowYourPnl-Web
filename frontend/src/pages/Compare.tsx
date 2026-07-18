import { useEffect, useMemo, useState } from "react";
import { brokerService } from "@/services/brokerService";
import type { Broker, BrokerComparisonResult, CalculationInput } from "@/types";
import { calculateMtf } from "@/services/calculationService";
import { BrokerComparisonTable } from "@/components/shared/BrokerComparisonTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

const inputCls =
  "rounded-none border-[#102A43] h-10 focus-visible:ring-1 focus-visible:ring-[#102A43] font-mono-ibm text-[13px]";

export const Compare = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [scenario, setScenario] = useState({
    buyPrice: 2890.5,
    quantity: 40,
    expectedSellPrice: 3050,
    purchaseDate: "2026-01-08",
    expectedExitDate: "2026-03-08",
    pledgeRequests: 1,
    unpledgeRequests: 1,
    dpDebitEvents: 1,
  });

  useEffect(() => {
    brokerService.list().then(setBrokers);
  }, []);

  const rows: BrokerComparisonResult[] = useMemo(() => {
    return brokers.map((b) => {
      const input: CalculationInput = {
        brokerSlug: b.slug,
        planId: b.plans[0].id,
        buyPrice: scenario.buyPrice,
        quantity: scenario.quantity,
        expectedSellPrice: scenario.expectedSellPrice,
        purchaseDate: scenario.purchaseDate,
        expectedExitDate: scenario.expectedExitDate,
        userMarginPct: b.mtf.minMarginPct,
        brokerFundedPct: b.mtf.brokerFundedPct,
        annualInterestRatePct: b.mtf.annualInterestRatePct,
        pledgeRequests: scenario.pledgeRequests,
        unpledgeRequests: scenario.unpledgeRequests,
        dpDebitEvents: scenario.dpDebitEvents,
      };
      const r = calculateMtf(input);
      const brokerageSum =
        r.breakdown.buySide.find((l) => l.key === "buy_brokerage")!.amount +
        r.breakdown.sellSide.find((l) => l.key === "sell_brokerage")!.amount;
      const taxesAndOps = r.breakdown.total - r.interestTotal - brokerageSum;
      return {
        brokerSlug: b.slug,
        brokerName: b.name,
        planId: b.plans[0].id,
        planName: b.plans[0].name,
        tradeValue: r.tradeValue,
        totalCost: r.breakdown.total,
        interest: r.interestTotal,
        brokerage: brokerageSum,
        taxesAndOps,
        netPnl: r.netPnl,
        breakevenPrice: r.breakevenPrice,
        verificationStatus: b.verificationStatus,
      };
    });
  }, [brokers, scenario]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid="page-compare">
      <header className="border-b border-[#102A43] pb-6 mb-8">
        <div className="kypnl-overline">Compare MTF</div>
        <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">
          One trade. Every supported broker.
        </h1>
        <p className="text-[14px] text-[#486581] max-w-2xl mt-3">
          Enter a single MTF scenario. Every broker's tariff is applied identically. The lowest-cost
          broker for this scenario is highlighted.
        </p>
      </header>

      <section className="border border-[#102A43] bg-white mb-8">
        <div className="px-4 py-3 border-b border-[#102A43] kypnl-overline">Scenario</div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Buy price">
            <Input className={inputCls} type="number" value={scenario.buyPrice} onChange={(e) => setScenario({ ...scenario, buyPrice: Number(e.target.value) })} data-testid="compare-buy-price" />
          </Field>
          <Field label="Quantity">
            <Input className={inputCls} type="number" value={scenario.quantity} onChange={(e) => setScenario({ ...scenario, quantity: Number(e.target.value) })} data-testid="compare-quantity" />
          </Field>
          <Field label="Sell price">
            <Input className={inputCls} type="number" value={scenario.expectedSellPrice} onChange={(e) => setScenario({ ...scenario, expectedSellPrice: Number(e.target.value) })} data-testid="compare-sell-price" />
          </Field>
          <Field label="Purchase date">
            <Input className={inputCls} type="date" value={scenario.purchaseDate} onChange={(e) => setScenario({ ...scenario, purchaseDate: e.target.value })} data-testid="compare-purchase-date" />
          </Field>
          <Field label="Exit date">
            <Input className={inputCls} type="date" value={scenario.expectedExitDate} onChange={(e) => setScenario({ ...scenario, expectedExitDate: e.target.value })} data-testid="compare-exit-date" />
          </Field>
          <Field label="Pledge requests">
            <Input className={inputCls} type="number" value={scenario.pledgeRequests} onChange={(e) => setScenario({ ...scenario, pledgeRequests: Number(e.target.value) })} data-testid="compare-pledge" />
          </Field>
          <Field label="Unpledge requests">
            <Input className={inputCls} type="number" value={scenario.unpledgeRequests} onChange={(e) => setScenario({ ...scenario, unpledgeRequests: Number(e.target.value) })} data-testid="compare-unpledge" />
          </Field>
          <Field label="DP debit events">
            <Input className={inputCls} type="number" value={scenario.dpDebitEvents} onChange={(e) => setScenario({ ...scenario, dpDebitEvents: Number(e.target.value) })} data-testid="compare-dp" />
          </Field>
        </div>
      </section>

      <BrokerComparisonTable rows={rows} />

      {brokers.length < 2 && (
        <div className="mt-8 border border-dashed border-[#102A43] p-6 flex items-start gap-3" data-testid="compare-empty-state">
          <Info size={16} strokeWidth={1.75} className="mt-0.5 text-[#087F6D]" />
          <div className="text-[13px]">
            <div className="font-medium">Broker comparison is limited today.</div>
            <p className="text-[#486581] mt-1">
              Broker comparison will become fully useful once another broker has verified MTF tariff
              support. The comparison engine below is fully data-driven and will automatically show
              additional brokers as soon as they are on-boarded.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <Label className="kypnl-overline">{label}</Label>
    {children}
  </div>
);
