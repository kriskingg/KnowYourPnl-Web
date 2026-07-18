export const Methodology = () => {
  const sections: Array<{ title: string; body: string; formula?: string }> = [
    { title: "Trade value", body: "Trade value is buy price × quantity. It is the total notional exposure at entry.", formula: "trade_value = buy_price × quantity" },
    { title: "User margin", body: "The portion of trade value funded from the user's own capital.", formula: "user_capital = (user_margin_pct / 100) × trade_value" },
    { title: "Broker-funded amount", body: "The portion of trade value funded by the broker under MTF. Interest is accrued only on this amount.", formula: "broker_funded = (broker_funded_pct / 100) × trade_value" },
    { title: "Daily interest", body: "Interest is compounded daily on the broker-funded amount using a 365-day year convention.", formula: "daily_interest = broker_funded × (annual_rate / 100) / 365" },
    { title: "Holding period", body: "The number of calendar days between the purchase date and the expected exit date, inclusive of the entry day.", formula: "holding_days = ceil(exit_date − purchase_date)" },
    { title: "Buy-side charges", body: "Buy brokerage, stamp duty, exchange transaction charges, SEBI charges and IPFT are applied on the buy turnover." },
    { title: "Sell-side charges", body: "Sell brokerage, STT (sell), exchange transaction charges, SEBI charges and IPFT are applied on the sell turnover." },
    { title: "Pledge fees", body: "Flat fee per pledge request. GST is applied to this fee." },
    { title: "Unpledge fees", body: "Flat fee per unpledge request. GST is applied to this fee." },
    { title: "DP charges", body: "Per-scrip fee at sell debit. Presented inclusive of GST when the broker publishes it so." },
    { title: "GST", body: "GST is levied at 18% on brokerage, exchange transaction charges, SEBI charges, pledge and unpledge fees.", formula: "gst_total = 18% × (brokerage + exch_txn + sebi + pledge + unpledge)" },
    { title: "Break-even calculation", body: "The buy price at which net P&L is zero after all applicable costs.", formula: "breakeven = buy_price + total_cost / quantity" },
    { title: "Net P&L", body: "The gross change in price × quantity, minus total cost of holding and transacting.", formula: "net_pnl = (sell_price − buy_price) × quantity − total_cost" },
    { title: "Return on user capital", body: "The net P&L expressed as a percentage of the capital the user actually deployed.", formula: "roi_user = net_pnl / user_capital × 100" },
    { title: "Return on market exposure", body: "The net P&L expressed as a percentage of the full trade value.", formula: "roi_exposure = net_pnl / trade_value × 100" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid="page-methodology">
      <header className="border-b border-black pb-6 mb-10">
        <div className="kypnl-overline">Methodology</div>
        <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">How every number is made.</h1>
        <p className="text-[14px] text-[#525252] max-w-3xl mt-3">
          Reusable across brokers. Broker-specific values are loaded through the tariff layer; the
          formulas themselves are broker-independent.
        </p>
      </header>
      <ol className="border border-[#0a0a0a] bg-white divide-y divide-[#e5e5df]">
        {sections.map((s, i) => (
          <li key={s.title} className="grid md:grid-cols-12 gap-4 p-5" data-testid={`methodology-item-${i}`}>
            <div className="md:col-span-3">
              <div className="kypnl-overline">Section {String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-editorial text-xl mt-1">{s.title}</h3>
            </div>
            <div className="md:col-span-9">
              <p className="text-[14px] leading-relaxed">{s.body}</p>
              {s.formula && (
                <pre className="mt-3 border border-[#e5e5df] bg-[#f5f5ef] px-3 py-2 text-[12.5px] font-mono-ibm overflow-x-auto">
                  {s.formula}
                </pre>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
