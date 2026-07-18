import type { TariffVersion } from "@/types";
import { VerificationBadge } from "./VerificationBadge";
import { displayDate } from "@/lib/formatters";

export const TariffVersionCard = ({ version }: { version: TariffVersion }) => (
  <article
    className="border border-[#0a0a0a] bg-white p-4"
    data-testid={`tariff-version-${version.id}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="kypnl-overline">Tariff version</div>
        <div className="font-mono-ibm text-lg font-semibold mt-0.5">{version.version}</div>
        <div className="text-[12px] text-[#525252] mt-1">
          Effective {displayDate(version.effectiveDate)} · Published {displayDate(version.publishedDate)}
        </div>
      </div>
      <VerificationBadge status={version.verificationStatus} />
    </div>
    <p className="text-[13px] mt-3 leading-relaxed">{version.changeSummary}</p>
    <div className="mt-3 pt-3 border-t border-[#e5e5df] flex items-center justify-between text-[11px] text-[#525252] uppercase tracking-wider">
      <span>Broker: {version.brokerSlug}</span>
      <span>Last checked: {displayDate(version.lastCheckedDate)}</span>
    </div>
  </article>
);
