import type { CostBreakdown } from "@/types";
import { inrCurrency } from "@/lib/formatters";

export const ChargeBreakdown = ({ breakdown }: { breakdown: CostBreakdown }) => {
  const groups = [
    ...breakdown.buySide,
    ...breakdown.sellSide,
    ...breakdown.holding,
    ...breakdown.operational,
  ];
  return (
    <div className="border border-[#102A43] bg-white" data-testid="charge-breakdown">
      <div className="px-4 py-3 border-b border-[#102A43] flex items-center justify-between">
        <h3 className="font-editorial text-lg font-semibold">Estimated Cost Groups</h3>
        <span className="kypnl-overline">Rates protected</span>
      </div>
      <table className="kypnl-table">
        <tbody>
          {groups.map((line) => (
            <tr key={line.key} data-testid={`charge-line-${line.key}`}>
              <td className="text-[13px]">{line.label}</td>
              <td className="num text-[13px]">{inrCurrency(line.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 flex items-center justify-between bg-[#102A43] text-[#F7F5EF]">
        <div className="kypnl-overline text-[#F7F5EF]">Total charges</div>
        <div className="font-mono-ibm text-lg" data-testid="charge-total">{inrCurrency(breakdown.total)}</div>
      </div>
    </div>
  );
};
