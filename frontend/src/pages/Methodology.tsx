import { LockKeyhole, RefreshCcw, Scale, ShieldCheck } from "lucide-react";

export const Methodology = () => {
  const sections = [
    {
      icon: Scale,
      title: "Scenario consistency",
      body: "The same user-supplied trade scenario is evaluated consistently across every supported broker and plan.",
    },
    {
      icon: RefreshCcw,
      title: "Versioned tariff intelligence",
      body: "Broker-specific rates, caps, taxes and operational rules are reviewed and assigned an internal version before use.",
    },
    {
      icon: ShieldCheck,
      title: "Validation before calculation",
      body: "Prices, quantities, dates and event counts are checked on the server before the active model is applied.",
    },
    {
      icon: LockKeyhole,
      title: "Protected implementation",
      body: "Exact tariff records, evidence citations and rule-level formulas are not published or downloaded to the browser.",
    },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid="page-methodology">
      <header className="border-b border-[#102A43] pb-6 mb-10">
        <div className="kypnl-overline">Methodology</div>
        <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">Transparent principles. Protected intelligence.</h1>
        <p className="text-[14px] text-[#486581] max-w-3xl mt-3">
          We explain how the service is governed and verified without publishing the broker-specific
          recipe that powers each estimate.
        </p>
      </header>
      <ol className="grid md:grid-cols-2 border border-[#102A43] bg-white">
        {sections.map(({ icon: Icon, title, body }, index) => (
          <li key={title} className={`p-6 ${index % 2 ? "md:border-l" : ""} ${index >= 2 ? "border-t" : ""} border-[#e5e5df]`}>
            <Icon size={18} className="text-[#087F6D]" />
            <div className="kypnl-overline mt-4">Principle {String(index + 1).padStart(2, "0")}</div>
            <h2 className="font-editorial text-2xl mt-1">{title}</h2>
            <p className="text-[14px] text-[#486581] leading-relaxed mt-3">{body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};
