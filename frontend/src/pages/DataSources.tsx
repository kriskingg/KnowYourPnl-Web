import { VerificationBadge } from "@/components/shared/VerificationBadge";

const rows = [
  { status: "official" as const, when: "Values quoted verbatim from a broker's own pricing page or PDF, with URL and effective date." },
  { status: "account_verified" as const, when: "Values reconciled against an actual account statement or contract note from a real user." },
  { status: "formula_tested" as const, when: "Value derived by formula but back-tested against multiple recent statements." },
  { status: "estimated" as const, when: "Value derived from public information but not yet cross-checked against a statement." },
  { status: "user_modified" as const, when: "Value overridden inside the calculator by the current user for scenario purposes." },
  { status: "review_required" as const, when: "Value flagged for re-check due to age, ambiguity or contradictory sources." },
];

export const DataSources = () => (
  <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid="page-data-sources">
    <header className="border-b border-black pb-6 mb-10">
      <div className="kypnl-overline">Data Sources</div>
      <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">Where every number comes from.</h1>
      <p className="text-[14px] text-[#525252] max-w-3xl mt-3">
        We refuse to display an unlabelled tariff. Every value we store is stamped with a
        verification status and a citation.
      </p>
    </header>

    <section className="mb-10">
      <div className="kypnl-overline mb-3">Verification statuses</div>
      <div className="border border-[#0a0a0a] bg-white divide-y divide-[#e5e5df]">
        {rows.map((r) => (
          <div key={r.status} className="p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="md:w-56 shrink-0"><VerificationBadge status={r.status} size="md" /></div>
            <div className="text-[13px] leading-relaxed">{r.when}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-10">
      <div className="kypnl-overline mb-3">Fields captured per tariff value</div>
      <ul className="border border-[#0a0a0a] bg-white grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#e5e5df]">
        {[
          "Broker & brokerage plan",
          "Charge name",
          "Source title & source type",
          "Source reference (URL / citation)",
          "Effective date & last checked date",
          "Published value & observed value",
          "Verification status",
          "Notes",
        ].map((f) => <li key={f} className="p-4 text-[13px]">{f}</li>)}
      </ul>
    </section>
  </div>
);
