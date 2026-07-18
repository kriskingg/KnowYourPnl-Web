"import type { CostBreakdown } from \"@/types\";
import { inrCurrency } from \"@/lib/formatters\";

export const ChargeBreakdown = ({ breakdown }: { breakdown: CostBreakdown }) => {
  const sections: Array<{ title: string; lines: CostBreakdown[\"buySide\"] }> = [
    { title: \"Buy-side\", lines: breakdown.buySide },
    { title: \"Sell-side\", lines: breakdown.sellSide },
    { title: \"Holding\", lines: breakdown.holding },
    { title: \"Operational\", lines: breakdown.operational },
  ];
  return (
    <div className=\"border border-[#0a0a0a] bg-white\" data-testid=\"charge-breakdown\">
      {sections.map((s) => (
        <div key={s.title} className=\"border-b border-[#e5e5df]\">
          <div className=\"px-4 py-2 kypnl-overline bg-[#f5f5ef]\">{s.title}</div>
          <table className=\"kypnl-table\">
            <tbody>
              {s.lines.map((l) => (
                <tr key={l.key} data-testid={`charge-line-${l.key}`}>
                  <td className=\"w-[55%]\">
                    <div className=\"text-[13px]\">{l.label}</div>
                    {l.formula && <div className=\"text-[11px] text-[#525252] font-mono-ibm mt-0.5\">{l.formula}</div>}
                  </td>
                  <td className=\"num text-[13px]\">{inrCurrency(l.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <div className=\"border-b border-[#e5e5df]\">
        <table className=\"kypnl-table\">
          <tbody>
            <tr>
              <td>GST on applicable charges</td>
              <td className=\"num\">{inrCurrency(breakdown.gstOnAll)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className=\"px-4 py-3 flex items-center justify-between bg-[#0a0a0a] text-[#f9f9f7]\">
        <div className=\"kypnl-overline text-[#f9f9f7]\">Total charges</div>
        <div className=\"font-mono-ibm text-lg\" data-testid=\"charge-total\">{inrCurrency(breakdown.total)}</div>
      </div>
    </div>
  );
};
"