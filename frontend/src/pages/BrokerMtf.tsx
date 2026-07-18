import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { brokerService } from "@/services/brokerService";
import type { Broker, EvidenceRecord } from "@/types";
import { ChargeTable } from "@/components/shared/ChargeTable";
import { EvidencePanel } from "@/components/shared/EvidencePanel";
import { VerificationBadge } from "@/components/shared/VerificationBadge";
import { pct, inrCurrency, displayDate } from "@/lib/formatters";
import { ArrowUpRight } from "lucide-react";

export const BrokerMtf = () => {
  const { brokerSlug = "" } = useParams();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);

  useEffect(() => {
    brokerService.getBySlug(brokerSlug).then((b) => setBroker(b ?? null));
    brokerService.getEvidence(brokerSlug).then(setEvidence);
  }, [brokerSlug]);

  if (!broker) return <div className="p-8">Loading MTF page…</div>;
  const mtf = broker.mtf;

  const stats: Array<{ label: string; value: string; testid: string }> = [
    { label: "Annual MTF interest", value: pct(mtf.annualInterestRatePct), testid: "kpi-annual-interest" },
    { label: "Daily MTF interest", value: pct(mtf.annualInterestRatePct / 365, 4), testid: "kpi-daily-interest" },
    { label: "Margin contribution", value: `${mtf.minMarginPct}% (user)`, testid: "kpi-user-margin" },
    { label: "Broker funded", value: `${mtf.brokerFundedPct}%`, testid: "kpi-broker-funded" },
    { label: "Pledge fee", value: `${inrCurrency(mtf.pledgeFeeFlat)} + GST`, testid: "kpi-pledge" },
    { label: "Unpledge fee", value: `${inrCurrency(mtf.unpledgeFeeFlat)} + GST`, testid: "kpi-unpledge" },
    { label: "DP charge (sell)", value: `${inrCurrency(mtf.dpChargeFlat)} incl. GST`, testid: "kpi-dp" },
    { label: "GST", value: `${mtf.gstOnCharges}%`, testid: "kpi-gst" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid={`page-broker-mtf-${broker.slug}`}>
      <header className="border-b border-[#102A43] pb-6 mb-8 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="kypnl-overline">MTF Page</div>
          <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">
            {broker.name} · MTF
          </h1>
          <div className="mt-3 flex items-center gap-3 text-[12px] text-[#486581]">
            <VerificationBadge status={broker.verificationStatus} />
            <span>Tariff <span className="font-mono-ibm">{broker.currentTariffVersion}</span></span>
            <span>· Effective {displayDate("2026-01-01")}</span>
            <span>· Last checked {displayDate(broker.lastVerificationDate)}</span>
          </div>
        </div>
        <Link
          to={`/calculator?broker=${broker.slug}`}
          className="inline-flex items-center gap-2 bg-[#102A43] text-[#F7F5EF] px-4 py-2 text-[13px] font-medium hover:bg-[#087F6D]"
          data-testid="link-calculate-using-tariffs"
        >
          Calculate using these tariffs <ArrowUpRight size={13} strokeWidth={2} />
        </Link>
      </header>

      <section className="mb-10">
        <div className="kypnl-overline mb-3">Key MTF Metrics</div>
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[#102A43] bg-white">
          {stats.map((s, i) => (
            <div
              key={s.testid}
              className={`p-4 ${i % 4 !== 0 ? "border-l" : ""} ${i >= 4 ? "border-t" : ""} border-[#e5e5df]`}
              data-testid={s.testid}
            >
              <div className="kypnl-overline">{s.label}</div>
              <div className="font-mono-ibm text-[15px] mt-1">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="kypnl-overline mb-3">Full charge table</div>
        <ChargeTable broker={broker} />
      </section>

      <section className="mb-10">
        <div className="kypnl-overline mb-3">Calculation assumptions</div>
        <div className="border border-[#102A43] bg-white p-5 text-[13px] leading-relaxed space-y-2">
          <p>· Interest is charged daily on broker-funded amount = broker_funded_pct × trade_value.</p>
          <p>· Daily interest = annual rate ÷ 365. Interest accrues from purchase date through exit date inclusive.</p>
          <p>· Brokerage is applied on both buy and sell sides, capped per order where applicable.</p>
          <p>· STT applies on sell turnover only. Stamp duty applies on buy turnover.</p>
          <p>· GST is applied on brokerage, exchange transaction charges, SEBI charges, pledge and unpledge fees.</p>
          <p>· DP charges are per sell debit event per scrip.</p>
        </div>
      </section>

      <section className="mb-10">
        <div className="kypnl-overline mb-3">Evidence</div>
        <EvidencePanel records={evidence} />
      </section>

      <p className="text-[11px] text-[#486581] italic border-t border-[#e5e5df] pt-4">{broker.disclaimer}</p>
    </div>
  );
};
