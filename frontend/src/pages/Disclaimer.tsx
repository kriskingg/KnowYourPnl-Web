export const Disclaimer = () => (
  <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid="page-disclaimer">
    <header className="border-b border-black pb-6 mb-10">
      <div className="kypnl-overline">Disclaimer</div>
      <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">Read this first.</h1>
    </header>
    <div className="space-y-5 text-[14px] leading-relaxed max-w-3xl">
      <p>
        KnowYourPNL is an educational tool for understanding the cost structure of Margin Trading
        Facility. Nothing on this site constitutes investment advice, a recommendation to buy or
        sell any security, or a solicitation to trade.
      </p>
      <p>
        All tariff values shown at launch are demonstration data pending account-statement
        verification. Broker names, logos and product marks remain the property of their respective
        owners. KnowYourPNL is not affiliated with, endorsed by, or licensed from any broker.
      </p>
      <p>
        Calculations run locally in your browser using the assumptions you provide. Actual charges,
        interest, taxes and net outcomes will vary based on your specific account terms, statutory
        changes, and market execution. Always verify against your own account statement before
        making any decision.
      </p>
      <p>
        By using this site you acknowledge that the authors accept no liability for losses, missed
        opportunities, or misinterpretations arising from its use.
      </p>
    </div>
  </div>
);
