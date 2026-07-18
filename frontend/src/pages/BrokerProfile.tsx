import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { brokerService } from "@/services/brokerService";
import { tariffService } from "@/services/tariffService";
import type { Broker, EvidenceRecord, TariffVersion } from "@/types";
import { ChargeTable } from "@/components/shared/ChargeTable";
import { EvidencePanel } from "@/components/shared/EvidencePanel";
import { TariffVersionCard } from "@/components/shared/TariffVersionCard";
import { VerificationBadge } from "@/components/shared/VerificationBadge";
import { ArrowRight } from "lucide-react";
import { displayDate } from "@/lib/formatters";

export const BrokerProfile = () => {
  const { brokerSlug = "" } = useParams();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [history, setHistory] = useState<TariffVersion[]>([]);

  useEffect(() => {
    brokerService.getBySlug(brokerSlug).then((b) => setBroker(b ?? null));
    brokerService.getEvidence(brokerSlug).then(setEvidence);
    tariffService.listHistory(brokerSlug).then(setHistory);
  }, [brokerSlug]);

  if (!broker) return <div className="p-8">Loading broker…</div>;

  const current = history[0];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid={`page-broker-profile-${broker.slug}`}>
      <header className="border-b border-black pb-6 mb-8 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="kypnl-overline">Broker Profile</div>
          <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">{broker.name}</h1>
          <p className="text-[14px] text-[#525252] mt-2 max-w-2xl">{broker.overview}</p>
          <div className="mt-3 text-[12px] text-[#525252]">
            {broker.legalName} · Est. {broker.established} · SEBI Reg. {broker.sebiRegNo} · HQ {broker.headquarters}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <VerificationBadge status={broker.verificationStatus} size="md" />
          <div className="text-[12px] text-[#525252]">
            Tariff <span className="font-mono-ibm">{broker.currentTariffVersion}</span>
            {current && <> · Last verified {displayDate(broker.lastVerificationDate)}</>}
          </div>
          <Link
            to={`/brokers/${broker.slug}/mtf`}
            className="inline-flex items-center gap-1 bg-black text-[#f9f9f7] px-3 py-2 text-[13px] font-medium hover:bg-[#d43325]"
            data-testid="link-broker-mtf"
          >
            MTF page <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </header>

      <section className="mb-10">
        <div className="kypnl-overline mb-3">Charges</div>
        <ChargeTable broker={broker} />
      </section>

      {current && (
        <section className="mb-10">
          <div className="kypnl-overline mb-3">Current Tariff Version</div>
          <TariffVersionCard version={current} />
        </section>
      )}

      <section className="mb-10">
        <div className="kypnl-overline mb-3">Evidence</div>
        <EvidencePanel records={evidence} />
      </section>

      <p className="text-[11px] text-[#525252] italic border-t border-[#e5e5df] pt-4">{broker.disclaimer}</p>
    </div>
  );
};
