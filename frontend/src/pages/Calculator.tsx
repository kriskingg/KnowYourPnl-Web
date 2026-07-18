import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { brokerService } from "@/services/brokerService";
import { apiService } from "@/services/apiService";
import type { Broker, CalculationResult, HoldingPeriodProjectionRow } from "@/types";
import { MtfCalculatorForm } from "@/components/shared/MtfCalculatorForm";
import { CalculationSummary } from "@/components/shared/CalculationSummary";
import { ChargeBreakdown } from "@/components/shared/ChargeBreakdown";
import { HoldingPeriodProjection } from "@/components/shared/HoldingPeriodProjection";
import { AdSlot } from "@/components/shared/AdSlot";

export const Calculator = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [projection, setProjection] = useState<HoldingPeriodProjectionRow[]>([]);
  const [params] = useSearchParams();
  const initialSlug = params.get("broker") ?? undefined;

  useEffect(() => {
    brokerService.list().then(setBrokers);
  }, []);

  useEffect(() => {
    if (!result) {
      setProjection([]);
      return;
    }
    apiService.projectMtf(result.input).then(setProjection).catch(() => setProjection([]));
  }, [result]);

  if (brokers.length === 0) return <div className="p-8">Loading…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid="page-calculator">
      <header className="mb-8">
        <div className="kypnl-overline">MTF Calculator</div>
        <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">
          The true cost of a single MTF trade.
        </h1>
        <p className="text-[14px] text-[#486581] max-w-2xl mt-3">
          Enter only your trade scenario. KnowYourPNL applies its maintained broker tariff model
          securely on the server; broker rates and calculation rules are never sent to your browser.
        </p>
      </header>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <MtfCalculatorForm brokers={brokers} initialBrokerSlug={initialSlug} onResult={setResult} />
        </div>
        <div className="md:col-span-7 space-y-6">
          {!result && (
            <div className="border border-dashed border-[#102A43] p-8 text-[13px] text-[#486581]">
              Complete the scenario and select “Calculate securely” to see the estimate.
            </div>
          )}
          {result && <CalculationSummary result={result} />}
          {result && <ChargeBreakdown breakdown={result.breakdown} />}
          {projection.length > 0 && <HoldingPeriodProjection rows={projection} />}
        </div>
      </div>
      <AdSlot id="calculator-after-results" />
    </div>
  );
};
