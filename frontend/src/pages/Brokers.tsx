"import { useEffect, useState } from \"react\";
import { brokerService } from \"@/services/brokerService\";
import type { Broker } from \"@/types\";
import { BrokerCard } from \"@/components/shared/BrokerCard\";

export const Brokers = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  useEffect(() => {
    brokerService.list().then(setBrokers);
  }, []);

  return (
    <div className=\"mx-auto max-w-7xl px-4 md:px-6 py-10\" data-testid=\"page-brokers\">
      <header className=\"mb-8 border-b border-black pb-6\">
        <div className=\"kypnl-overline\">Broker Directory</div>
        <h1 className=\"font-editorial text-4xl md:text-5xl font-semibold mt-2\">Supported brokers.</h1>
        <p className=\"text-[14px] text-[#525252] max-w-2xl mt-3\">
          A broker appears here only after MTF tariff data has been captured, mapped and staged for
          verification. Coming-soon placeholders are not shown.
        </p>
      </header>

      <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-0 -m-px\">
        {brokers.map((b) => (
          <div key={b.slug} className=\"p-0 -m-px\">
            <BrokerCard broker={b} />
          </div>
        ))}
      </div>

      <div className=\"mt-8 border border-dashed border-[#0a0a0a] p-6 text-[13px] text-[#525252]\">
        <span className=\"kypnl-overline block mb-2\">On adding another broker</span>
        Additional brokers are staged internally but only shown here once their tariff records reach
        <span className=\"italic\"> Formula Tested </span>or better verification status.
      </div>
    </div>
  );
};
"