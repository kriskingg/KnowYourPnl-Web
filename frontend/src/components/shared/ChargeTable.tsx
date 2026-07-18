"import type { Broker } from \"@/types\";
import { inrCurrency, pct } from \"@/lib/formatters\";
import { VerificationBadge } from \"./VerificationBadge\";

export const ChargeTable = ({ broker }: { broker: Broker }) => {
  const rows: Array<{ key: string; label: string; value: string; unit?: string }> = [
    { key: \"annual\", label: \"Annual MTF interest\", value: pct(broker.mtf.annualInterestRatePct), unit: \"p.a.\" },
    {
      key: \"daily\",
      label: \"Daily MTF interest\",
      value: pct(broker.mtf.annualInterestRatePct / 365, 4),
      unit: \"per day\",
    },
    { key: \"min_margin\", label: \"User margin (min)\", value: `${broker.mtf.minMarginPct}%`, unit: \"of trade value\" },
    { key: \"broker_funded\", label: \"Broker funded\", value: `${broker.mtf.brokerFundedPct}%`, unit: \"of trade value\" },
    {
      key: \"buy_brokerage\",
      label: \"Buy brokerage\",
      value: `${broker.plans[0].buyBrokerage.value}% (max ₹${broker.plans[0].buyBrokerage.max})`,
    },
    {
      key: \"sell_brokerage\",
      label: \"Sell brokerage\",
      value: `${broker.plans[0].sellBrokerage.value}% (max ₹${broker.plans[0].sellBrokerage.max})`,
    },
    { key: \"pledge\", label: \"Pledge fee\", value: `${inrCurrency(broker.mtf.pledgeFeeFlat)} + GST`, unit: \"per request\" },
    { key: \"unpledge\", label: \"Unpledge fee\", value: `${inrCurrency(broker.mtf.unpledgeFeeFlat)} + GST`, unit: \"per request\" },
    { key: \"dp\", label: \"DP charge\", value: `${inrCurrency(broker.mtf.dpChargeFlat)} incl. GST`, unit: \"per scrip\" },
    { key: \"stt_sell\", label: \"STT (sell)\", value: pct(broker.mtf.stt.sell, 3) },
    { key: \"stamp\", label: \"Stamp duty (buy)\", value: pct(broker.mtf.stampDuty, 3) },
    { key: \"exch_txn\", label: \"Exchange txn\", value: pct(broker.mtf.exchangeTxnPct, 5) },
    { key: \"sebi\", label: \"SEBI charges\", value: pct(broker.mtf.sebiChargesPct, 5) },
    { key: \"ipft\", label: \"IPFT\", value: pct(broker.mtf.ipftPct, 5) },
    { key: \"gst\", label: \"GST\", value: `${broker.mtf.gstOnCharges}% on brokerage & applicable charges` },
  ];

  return (
    <div className=\"border border-[#0a0a0a] bg-white overflow-x-auto\" data-testid=\"charge-table\">
      <table className=\"kypnl-table\">
        <thead>
          <tr>
            <th className=\"w-[35%]\">Charge</th>
            <th>Rate</th>
            <th>Applied</th>
            <th className=\"w-[160px]\">Verification</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} data-testid={`charge-row-${r.key}`}>
              <td className=\"text-[13px] font-medium\">{r.label}</td>
              <td className=\"font-mono-ibm text-[13px]\">{r.value}</td>
              <td className=\"text-[12px] text-[#525252]\">{r.unit ?? \"—\"}</td>
              <td>
                <VerificationBadge status={broker.verificationStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
"