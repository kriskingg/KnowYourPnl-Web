import type { EvidenceRecord } from "@/types";
import { VerificationBadge } from "./VerificationBadge";
import { ExternalLink, FileText } from "lucide-react";
import { displayDate } from "@/lib/formatters";

export const EvidencePanel = ({ records, title = "Evidence Sources" }: { records: EvidenceRecord[]; title?: string }) => {
  if (records.length === 0) return null;
  return (
    <section className="border border-[#0a0a0a] bg-white" data-testid="evidence-panel">
      <header className="px-4 py-3 border-b border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={14} strokeWidth={1.75} />
          <h3 className="font-editorial text-lg font-semibold">{title}</h3>
        </div>
        <span className="kypnl-overline">{records.length} record{records.length === 1 ? "" : "s"}</span>
      </header>
      <ul className="divide-y divide-[#e5e5df]">
        {records.map((r) => (
          <li key={r.id} className="p-4" data-testid={`evidence-row-${r.id}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[12px] text-[#525252] uppercase tracking-wider mb-0.5">{r.chargeName}</div>
                <div className="text-[14px] font-medium">{r.sourceTitle}</div>
                <div className="text-[12px] text-[#525252] mt-1 break-all">
                  <a href={r.sourceReference} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                    {r.sourceReference} <ExternalLink size={11} />
                  </a>
                </div>
                {r.notes && <p className="text-[12px] text-[#525252] mt-2 italic">{r.notes}</p>}
              </div>
              <VerificationBadge status={r.verificationStatus} />
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-[12px] mt-3 text-[#525252]">
              <div><dt className="kypnl-overline">Effective</dt><dd>{displayDate(r.effectiveDate)}</dd></div>
              <div><dt className="kypnl-overline">Last Checked</dt><dd>{displayDate(r.lastCheckedDate)}</dd></div>
              <div><dt className="kypnl-overline">Published</dt><dd className="text-[#0a0a0a]">{r.publishedValue}</dd></div>
              {r.observedValue && <div><dt className="kypnl-overline">Observed</dt><dd className="text-[#0a0a0a]">{r.observedValue}</dd></div>}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
};
