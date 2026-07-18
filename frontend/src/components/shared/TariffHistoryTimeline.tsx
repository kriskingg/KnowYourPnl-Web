import type { TariffVersion } from "@/types";
import { displayDate } from "@/lib/formatters";
import { VerificationBadge } from "./VerificationBadge";

export const TariffHistoryTimeline = ({ versions }: { versions: TariffVersion[] }) => (
  <ol className="relative border-l border-[#102A43] ml-3" data-testid="tariff-history-timeline">
    {versions.map((v) => (
        <li key={v.id} className="ml-6 pb-8" data-testid={`timeline-entry-${v.id}`}>
          <span className="absolute -left-[6px] w-3 h-3 bg-[#102A43]" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono-ibm text-base font-semibold">{v.version}</div>
              <div className="text-[12px] text-[#486581]">
                Effective {displayDate(v.effectiveDate)} · Published {displayDate(v.publishedDate)}
              </div>
            </div>
            <VerificationBadge status={v.verificationStatus} />
          </div>
          <p className="text-[13px] mt-2">{v.changeSummary}</p>
        </li>
    ))}
  </ol>
);
