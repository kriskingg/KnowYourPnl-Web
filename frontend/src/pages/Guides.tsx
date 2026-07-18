"import { BookOpen } from \"lucide-react\";

const guides = [
  { slug: \"how-mtf-interest-is-calculated\", title: \"How MTF interest is calculated\", published: true, minutes: 6 },
  { slug: \"how-mtf-margin-works\", title: \"How MTF margin works\", published: true, minutes: 5 },
  { slug: \"how-pledge-charges-work\", title: \"How pledge charges work\", published: true, minutes: 4 },
  { slug: \"how-unpledge-charges-work\", title: \"How unpledge charges work\", published: true, minutes: 4 },
  { slug: \"how-dp-charges-work\", title: \"How DP charges work\", published: true, minutes: 3 },
  { slug: \"how-holding-period-changes-break-even\", title: \"How holding period changes break-even\", published: true, minutes: 7 },
  { slug: \"how-to-calculate-true-mtf-profit\", title: \"How to calculate true MTF profit\", published: true, minutes: 8 },
  { slug: \"how-to-read-an-mtf-ledger\", title: \"How to read an MTF ledger\", published: true, minutes: 5 },
  { slug: \"how-to-compare-mtf-costs\", title: \"How to compare MTF costs\", published: true, minutes: 6 },
];

export const Guides = () => (
  <div className=\"mx-auto max-w-7xl px-4 md:px-6 py-10\" data-testid=\"page-guides\">
    <header className=\"border-b border-black pb-6 mb-10\">
      <div className=\"kypnl-overline\">Guides</div>
      <h1 className=\"font-editorial text-4xl md:text-5xl font-semibold mt-2\">Read before you leverage.</h1>
      <p className=\"text-[14px] text-[#525252] max-w-3xl mt-3\">
        Short, focused explanations of the mechanics behind Margin Trading Facility. Each guide is
        published only when the underlying methodology on this site supports it end-to-end.
      </p>
    </header>
    <ul className=\"grid md:grid-cols-2 gap-0 border border-[#0a0a0a] bg-white\">
      {guides.map((g, i) => (
        <li
          key={g.slug}
          className={`p-5 flex items-start gap-3 ${i % 2 === 1 ? \"md:border-l\" : \"\"} ${i >= 2 ? \"border-t\" : \"\"} border-[#e5e5df]`}
          data-testid={`guide-${g.slug}`}
        >
          <BookOpen size={16} strokeWidth={1.75} className=\"mt-0.5 text-[#d43325]\" />
          <div>
            <div className=\"font-editorial text-lg font-semibold\">{g.title}</div>
            <div className=\"text-[12px] text-[#525252] mt-1\">{g.minutes} min read · Published</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
"