import type { Broker } from "@/types";
import { Link } from "react-router-dom";
import { VerificationBadge } from "./VerificationBadge";
import { ArrowUpRight } from "lucide-react";
import { displayDate } from "@/lib/formatters";

export const BrokerCard = ({ broker }: { broker: Broker }) => {
  return (
    <div
      className="border border-[#102A43] bg-white p-5 flex flex-col justify-between h-full hover:bg-[#fdfdfb] transition-colors duration-100"
      data-testid={`broker-card-${broker.slug}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="kypnl-overline">Broker</div>
            <h3 className="font-editorial text-2xl font-semibold leading-tight mt-1">{broker.name}</h3>
            <p className="text-[12px] text-[#486581] mt-1">{broker.legalName}</p>
          </div>
          <VerificationBadge status={broker.verificationStatus} />
        </div>

        <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-[13px] mt-4">
          <dt className="kypnl-overline">Tariff</dt>
          <dd className="text-right font-mono-ibm">{broker.currentTariffVersion}</dd>
          <dt className="kypnl-overline">Plans modelled</dt>
          <dd className="text-right kypnl-tab-num">{broker.plans.length}</dd>
          <dt className="kypnl-overline">Model</dt>
          <dd className="text-right">Private server</dd>
          <dt className="kypnl-overline">Last Verified</dt>
          <dd className="text-right">{displayDate(broker.lastVerificationDate)}</dd>
        </dl>
      </div>

      <div className="mt-5 pt-4 border-t border-[#e5e5df] flex items-center justify-between">
        <Link
          to={`/brokers/${broker.slug}`}
          className="text-[13px] font-medium underline underline-offset-4 hover:text-[#087F6D]"
          data-testid={`broker-card-profile-link-${broker.slug}`}
        >
          Broker profile
        </Link>
        <Link
          to={`/brokers/${broker.slug}/mtf`}
          className="inline-flex items-center gap-1 text-[13px] font-medium bg-[#102A43] text-[#F7F5EF] px-3 py-1.5 hover:bg-[#087F6D] transition-colors duration-100"
          data-testid={`broker-card-mtf-link-${broker.slug}`}
        >
          MTF page <ArrowUpRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
};
