"import type { BrokerComparisonResult } from \"@/types\";
import { inrCurrency } from \"@/lib/formatters\";
import { VerificationBadge } from \"./VerificationBadge\";

export const BrokerComparisonTable = ({ rows }: { rows: BrokerComparisonResult[] }) => {
  if (rows.length === 0) return null;
  const best = [...rows].sort((a, b) => a.totalCost - b.totalCost)[0];
  return (
    <div className=\"border border-[#0a0a0a] bg-white overflow-x-auto\" data-testid=\"comparison-table\">
      <div className=\"px-4 py-3 border-b border-black flex items-center justify-between\">
        <h3 className=\"font-editorial text-lg font-semibold\">Comparison</h3>
        <span className=\"kypnl-overline\">Lower cost = better</span>
      </div>
      <table className=\"kypnl-table\">
        <thead>
          <tr>
            <th>Broker</th>
            <th>Plan</th>
            <th>Verification</th>
            <th className=\"num\">Interest</th>
            <th className=\"num\">Brokerage</th>
            <th className=\"num\">Taxes + Ops</th>
            <th className=\"num\">Total Cost</th>
            <th className=\"num\">Break-even</th>
            <th className=\"num\">Net P&L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.brokerSlug}
              className={r.brokerSlug === best.brokerSlug ? \"bg-[#f5f5ef]\" : \"\"}
              data-testid={`comparison-row-${r.brokerSlug}`}
            >
              <td className=\"text-[13px] font-medium\">{r.brokerName}</td>
              <td className=\"text-[13px]\">{r.planName}</td>
              <td><VerificationBadge status={r.verificationStatus} /></td>
              <td className=\"num font-mono-ibm\">{inrCurrency(r.interest)}</td>
              <td className=\"num font-mono-ibm\">{inrCurrency(r.brokerage)}</td>
              <td className=\"num font-mono-ibm\">{inrCurrency(r.taxesAndOps)}</td>
              <td className=\"num font-mono-ibm font-semibold\">{inrCurrency(r.totalCost)}</td>
              <td className=\"num font-mono-ibm\">{inrCurrency(r.breakevenPrice, { decimals: 2 })}</td>
              <td className={`num font-mono-ibm ${r.netPnl >= 0 ? \"text-[#057a55]\" : \"text-[#d43325]\"}`}>{inrCurrency(r.netPnl)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
"