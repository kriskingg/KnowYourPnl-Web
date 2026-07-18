import type { HoldingPeriodProjectionRow } from "@/types";
import { inrCurrency } from "@/lib/formatters";

export const HoldingPeriodProjection = ({ rows }: { rows: HoldingPeriodProjectionRow[] }) => (
  <div className="border border-[#102A43] bg-white overflow-x-auto" data-testid="holding-projection">
    <div className="px-4 py-3 border-b border-[#102A43] flex items-center justify-between">
      <h3 className="font-editorial text-lg font-semibold">Holding Period Projection</h3>
      <span className="kypnl-overline">Interest scales linearly with days</span>
    </div>
    <table className="kypnl-table">
      <thead>
        <tr>
          <th>Days</th>
          <th className="num">Interest</th>
          <th className="num">Total charges</th>
          <th className="num">Break-even</th>
          <th className="num">Net P&L</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.days} data-testid={`projection-row-${r.days}`}>
            <td className="font-mono-ibm text-[13px]">{r.days}d</td>
            <td className="num font-mono-ibm">{inrCurrency(r.interest)}</td>
            <td className="num font-mono-ibm">{inrCurrency(r.totalCost)}</td>
            <td className="num font-mono-ibm">{inrCurrency(r.breakevenPrice, { decimals: 2 })}</td>
            <td className={`num font-mono-ibm ${r.netPnl >= 0 ? "text-[#087F6D]" : "text-[#087F6D]"}`}>
              {inrCurrency(r.netPnl)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
