"import { useEffect, useMemo, useState } from \"react\";
import { useSearchParams } from \"react-router-dom\";
import { brokerService } from \"@/services/brokerService\";
import type { Broker, CalculationResult } from \"@/types\";
import { MtfCalculatorForm } from \"@/components/shared/MtfCalculatorForm\";
import { CalculationSummary } from \"@/components/shared/CalculationSummary\";
import { ChargeBreakdown } from \"@/components/shared/ChargeBreakdown\";
import { HoldingPeriodProjection } from \"@/components/shared/HoldingPeriodProjection\";
import { projectHoldingPeriods } from \"@/services/calculationService\";

export const Calculator = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [params] = useSearchParams();
  const initialSlug = params.get(\"broker\") ?? undefined;

  useEffect(() => {
    brokerService.list().then(setBrokers);
  }, []);

  const projection = useMemo(() => {
    if (!result) return [];
    return projectHoldingPeriods(result.input);
  }, [result]);

  if (brokers.length === 0) return <div className=\"p-8\">Loading…</div>;

  return (
    <div className=\"mx-auto max-w-7xl px-4 md:px-6 py-10\" data-testid=\"page-calculator\">
      <header className=\"mb-8\">
        <div className=\"kypnl-overline\">MTF Calculator</div>
        <h1 className=\"font-editorial text-4xl md:text-5xl font-semibold mt-2\">
          The true cost of a single MTF trade.
        </h1>
        <p className=\"text-[14px] text-[#525252] max-w-2xl mt-3\">
          Every value is editable. Assumptions default to the broker's demonstrated tariff.
          Nothing is submitted anywhere — calculations run locally.
        </p>
      </header>

      <div className=\"grid md:grid-cols-12 gap-6\">
        <div className=\"md:col-span-5\">
          <MtfCalculatorForm brokers={brokers} initialBrokerSlug={initialSlug} onResult={setResult} />
        </div>
        <div className=\"md:col-span-7 space-y-6\">
          {result && <CalculationSummary result={result} />}
          {result && <ChargeBreakdown breakdown={result.breakdown} />}
          {result && projection.length > 0 && <HoldingPeriodProjection rows={projection} />}
        </div>
      </div>
    </div>
  );
};
"