import type { CalculationResult } from "@/types";
import { inrCurrency, pct } from "@/lib/formatters";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const CalculationSummary = ({ result }: { result: CalculationResult }) => {
  const positive = result.netPnl >= 0;
  return (
    <div className="border border-[#102A43] bg-white" data-testid="calculation-summary">
      <div className="px-4 py-3 border-b border-[#102A43] flex items-center justify-between">
        <h3 className="font-editorial text-xl font-semibold">Calculation Summary</h3>
        <span className="kypnl-overline">{result.tariffVersion} · Secure model</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e5e5df]">
        <Metric label="Trade Value" value={inrCurrency(result.tradeValue)} testid="metric-trade-value" />
        <Metric label="Holding" value={`${result.holdingDays} days`} testid="metric-holding-days" />
        <Metric label="Funding Cost" value={inrCurrency(result.interestTotal)} testid="metric-interest" />
        <Metric label="Gross P&L" value={inrCurrency(result.grossPnl)} testid="metric-gross-pnl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-[#e5e5df] border-t border-[#e5e5df]">
        <Metric label="Total Charges" value={inrCurrency(result.breakdown.total)} testid="metric-total-charges" />
        <Metric label="Break-even" value={inrCurrency(result.breakevenPrice, { decimals: 2 })} testid="metric-breakeven" />
        <Metric label="ROI on Exposure" value={pct(result.returnOnMarketExposurePct)} testid="metric-roi-exposure" />
      </div>
      <div className="border-t border-[#102A43] px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#f5f5ef]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[13px] uppercase tracking-wider font-medium text-[#087F6D]">
            {positive ? <ArrowUpRight size={14} strokeWidth={2} /> : <ArrowDownRight size={14} strokeWidth={2} />}
            Estimated Net P&L
          </span>
          <span className="font-mono-ibm text-2xl text-[#087F6D]" data-testid="metric-net-pnl">
            {inrCurrency(result.netPnl)}
          </span>
        </div>
        <span className="text-[11px] text-[#486581]">Calculated by the private broker-cost engine</span>
      </div>
    </div>
  );
};

const Metric = ({ label, value, testid }: { label: string; value: string; testid: string }) => (
  <div className="px-4 py-3">
    <div className="kypnl-overline">{label}</div>
    <div className="font-mono-ibm text-[15px] mt-1" data-testid={testid}>{value}</div>
  </div>
);
