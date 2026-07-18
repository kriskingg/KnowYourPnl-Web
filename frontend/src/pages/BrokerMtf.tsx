import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { brokerService } from "@/services/brokerService";
import type { Broker } from "@/types";
import { VerificationBadge } from "@/components/shared/VerificationBadge";
import { displayDate } from "@/lib/formatters";
import { ArrowUpRight, LockKeyhole, RefreshCcw, ShieldCheck } from "lucide-react";

export const BrokerMtf = () => {
  const { brokerSlug = "" } = useParams();
  const [broker, setBroker] = useState<Broker | null>(null);

  useEffect(() => {
    brokerService.getBySlug(brokerSlug).then((value) => setBroker(value ?? null));
  }, [brokerSlug]);

  if (!broker) return <div className="p-8">Loading MTF page…</div>;

  const capabilities = [
    { icon: LockKeyhole, title: "Private tariff model", body: "Specific rates, caps and fee rules remain on the KnowYourPNL server." },
    { icon: RefreshCcw, title: "Continuously reviewed", body: "Broker changes are captured, checked and versioned internally." },
    { icon: ShieldCheck, title: "Consistent calculations", body: "Every scenario is validated before the active model is applied." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid={`page-broker-mtf-${broker.slug}`}>
      <header className="border-b border-[#102A43] pb-6 mb-8 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="kypnl-overline">MTF Intelligence</div>
          <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">{broker.name} · MTF</h1>
          <div className="mt-3 flex items-center gap-3 text-[12px] text-[#486581]">
            <VerificationBadge status={broker.verificationStatus} />
            <span>Model {broker.currentTariffVersion}</span>
            <span>· Last checked {displayDate(broker.lastVerificationDate)}</span>
          </div>
        </div>
        <Link
          to={`/calculator?broker=${broker.slug}`}
          className="inline-flex items-center gap-2 bg-[#102A43] text-[#F7F5EF] px-4 py-2 text-[13px] font-medium hover:bg-[#087F6D]"
        >
          Calculate with private model <ArrowUpRight size={13} />
        </Link>
      </header>

      <section className="grid md:grid-cols-3 border border-[#102A43] bg-white mb-10">
        {capabilities.map(({ icon: Icon, title, body }, index) => (
          <article key={title} className={`p-6 ${index ? "md:border-l border-[#e5e5df]" : ""}`}>
            <Icon size={18} className="text-[#087F6D]" />
            <h2 className="font-editorial text-xl font-semibold mt-4">{title}</h2>
            <p className="text-[13px] text-[#486581] mt-2 leading-relaxed">{body}</p>
          </article>
        ))}
      </section>

      <section className="border border-[#102A43] bg-[#f5f5ef] p-6 mb-10">
        <div className="kypnl-overline">What remains public</div>
        <p className="font-editorial text-2xl mt-2">The result, not the recipe.</p>
        <p className="text-[13px] text-[#486581] mt-3 max-w-3xl leading-relaxed">
          You can enter a trade scenario and receive estimated funding cost, grouped charges,
          break-even price and net P&amp;L. Individual tariff values, evidence records, fee caps and
          calculation formulas are intentionally not exposed in the website or its downloadable code.
        </p>
      </section>

      <p className="text-[11px] text-[#486581] italic border-t border-[#e5e5df] pt-4">{broker.disclaimer}</p>
    </div>
  );
};
