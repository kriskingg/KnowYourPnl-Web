import type { TariffVersion } from "@/types";
import { tariffService } from "@/services/tariffService";
import { displayDate } from "@/lib/formatters";
import { VerificationBadge } from "./VerificationBadge";

export const TariffHistoryTimeline = ({ versions }: { versions: TariffVersion[] }) => (
  <ol className="relative border-l border-black ml-3" data-testid="tariff-history-timeline">
    {versions.map((v) => {
      const changes = tariffService.getChanges(v.id);
      return (
        <li key={v.id} className="ml-6 pb-8" data-testid={`timeline-entry-${v.id}`}>
          <span className="absolute -left-[6px] w-3 h-3 bg-black" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono-ibm text-base font-semibold">{v.version}</div>
              <div className="text-[12px] text-[#525252]">
                Effective {displayDate(v.effectiveDate)} · Published {displayDate(v.publishedDate)}
              </div>
            </div>
            <VerificationBadge status={v.verificationStatus} />
          </div>
          <p className="text-[13px] mt-2">{v.changeSummary}</p>
          {changes.length > 0 && (
            <ul className="mt-3 border border-[#e5e5df] bg-white divide-y divide-[#e5e5df]">
              {changes.map((c, i) => (
                <li key={i} className="px-3 py-2 flex items-center justify-between text-[12px]">
                  <span className="font-mono-ibm text-[#525252]">{c.chargeKey}</span>
                  <span>
                    {c.previousValue && <span className="text-[#525252] line-through mr-2">{c.previousValue}</span>}
                    <span className="font-medium">{c.newValue}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    })}
  </ol>
);
