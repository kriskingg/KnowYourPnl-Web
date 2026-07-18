"export const About = () => (
  <div className=\"mx-auto max-w-7xl px-4 md:px-6 py-10\" data-testid=\"page-about\">
    <header className=\"border-b border-black pb-6 mb-10\">
      <div className=\"kypnl-overline\">About</div>
      <h1 className=\"font-editorial text-4xl md:text-5xl font-semibold mt-2\">An independent second opinion on MTF cost.</h1>
    </header>
    <div className=\"grid md:grid-cols-12 gap-8\">
      <div className=\"md:col-span-8 space-y-5 text-[15px] leading-relaxed\">
        <p>
          KnowYourPNL is an independent research surface for the true cost of Margin Trading Facility
          (MTF) in India. We reconcile broker interest rates, brokerage plans, statutory levies and
          depository charges into a single, editable calculation.
        </p>
        <p>
          We are not a broker. We are not a distributor. We do not receive commissions from the
          brokers we cover. Everything on this site is either derived from public disclosures or
          contributed and cross-checked by users, and every value carries a verification status.
        </p>
        <p>
          The visible product today is intentionally narrow — MTF, and only MTF. Delivery,
          intraday, futures and options are outside the scope of this release. When the underlying
          data and methodology for a new product are complete, we will publish them here explicitly;
          until then, we won't display placeholders.
        </p>
      </div>
      <aside className=\"md:col-span-4 border border-[#0a0a0a] bg-white p-5 text-[13px]\">
        <div className=\"kypnl-overline mb-2\">At a glance</div>
        <ul className=\"space-y-2\">
          <li>· Focus: Margin Trading Facility</li>
          <li>· Coverage: 1 broker (Kotak Neo) at launch</li>
          <li>· Data policy: verification status on every value</li>
          <li>· Ledger: local to your browser</li>
          <li>· Affiliation: none</li>
        </ul>
      </aside>
    </div>
  </div>
);
"