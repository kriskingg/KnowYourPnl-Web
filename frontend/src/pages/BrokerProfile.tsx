import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { brokerService } from "@/services/brokerService";
import { tariffService } from "@/services/tariffService";
import type { Broker, TariffVersion } from "@/types";
import { TariffVersionCard } from "@/components/shared/TariffVersionCard";
import { VerificationBadge } from "@/components/shared/VerificationBadge";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { displayDate } from "@/lib/formatters";

export const BrokerProfile = () => {
  const { brokerSlug = "" } = useParams();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [history, setHistory] = useState<TariffVersion[]>([]);

  useEffect(() => {
    brokerService.getBySlug(brokerSlug).then((value) => setBroker(value ?? null));
    tariffService.listHistory(brokerSlug).then(setHistory);
  }, [brokerSlug]);

  if (!broker) return <div className="p-8">Loading broker…</div>;
  const current = history[0];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid={`page-broker-profile-${broker.slug}`}>
      <header className="border-b border-[#102A43] pb-6 mb-8 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="kypnl-overline">Broker Profile</div>
          <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">{broker.name}</h1>
          <p className="text-[14px] text-[#486581] mt-2 max-w-2xl">{broker.overview}</p>
          <div className="mt-3 text-[12px] text-[#486581]">
            {broker.legalName} · Est. {broker.established} · SEBI Reg. {broker.sebiRegNo} · HQ {broker.headquarters}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <VerificationBadge status={broker.verificationStatus} size="md" />
          <div className="text-[12px] text-[#486581]">
            Model {broker.currentTariffVersion} · Last checked {displayDate(broker.lastVerificationDate)}
          </div>
          <Link
            to={`/brokers/${broker.slug}/mtf`}
            className="inline-flex items-center gap-1 bg-[#102A43] text-[#F7F5EF] px-3 py-2 text-[13px] font-medium hover:bg-[#087F6D]"
          >
            MTF intelligence <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      <section className="mb-10 border border-[#102A43] bg-white p-6 flex items-start gap-4">
        <LockKeyhole size={20} className="text-[#087F6D] shrink-0 mt-1" />
        <div>
          <div className="kypnl-overline">Protected broker intelligence</div>
          <h2 className="font-editorial text-2xl font-semibold mt-2">Rates and calculation rules are applied server-side.</h2>
          <p className="text-[13px] text-[#486581] mt-2 max-w-3xl">
            KnowYourPNL tracks this broker’s MTF charges internally. Public pages show coverage,
            verification status and version freshness without publishing the underlying tariff database.
          </p>
        </div>
      </section>

      {current && (
        <section className="mb-10">
          <div className="kypnl-overline mb-3">Current Model Version</div>
          <TariffVersionCard version={current} />
        </section>
      )}

      <p className="text-[11px] text-[#486581] italic border-t border-[#e5e5df] pt-4">{broker.disclaimer}</p>
    </div>
  );
};
