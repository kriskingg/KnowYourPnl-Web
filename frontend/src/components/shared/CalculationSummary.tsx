import type { CalculationResult } from "@/types";
import { inrCurrency, pct } from "@/lib/formatters";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const CalculationSummary = ({ result }: { result: CalculationResult }) => {
  const positive = result.netPnl >= 0;
  return (
    <div className="border border-[#0a0a0a] bg-white" data-testid="calculation-summary">
      <div className="px-4 py-3 border-b border-black flex items-center justify-between">
        <h3 className="font-editorial text-xl font-semibold">Calculation Summary</h3>
        <span className="kypnl-overline">{result.tariffVersion} · {result.methodologyVersion}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e5e5df]">
        <Metric label="Trade Value" value={inrCurrency(result.tradeValue)} testid="metric-trade-value" />
        <Metric label="User Capital" value={inrCurrency(result.userCapital)} testid="metric-user-capital" />
        <Metric label="Broker Funded" value={inrCurrency(result.brokerFunded)} testid="metric-broker-funded" />
        <Metric label="Holding" value={`${result.holdingDays} days`} testid="metric-holding-days" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e5e5df] border-t border-[#e5e5df]">
        <Metric label="Interest" value={inrCurrency(result.interestTotal)} testid="metric-interest" />
        <Metric label="Total Charges" value={inrCurrency(result.breakdown.total)} testid="metric-total-charges" />
        <Metric label="Break-even" value={inrCurrency(result.breakevenPrice, { decimals: 2 })} testid="metric-breakeven" />
        <Metric label="Gross P&L" value={inrCurrency(result.grossPnl)} testid="metric-gross-pnl" />
      </div>
      <div className="border-t border-[#0a0a0a] px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#f5f5ef]">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 text-[13px] uppercase tracking-wider font-medium ${positive ? "text-[#057a55]" : "text-[#d43325]"}`}>
            {positive ? <ArrowUpRight size={14} strokeWidth={2} /> : <ArrowDownRight size={14} strokeWidth={2} />}
            Estimated Net P&L
          </span>
          <span className={`font-mono-ibm text-2xl ${positive ? "text-[#057a55]" : "text-[#d43325]"}`} data-testid="metric-net-pnl">
            {inrCurrency(result.netPnl)}
          </span>
        </div>
        <div className="flex items-center gap-6 text-[13px]">
          <div className="flex flex-col">
            <span className="kypnl-overline">ROI on Capital</span>
            <span className="font-mono-ibm" data-testid="metric-roi-capital">{pct(result.returnOnUserCapitalPct)}</span>
          </div>
          <div className="flex flex-col">
            <span className="kypnl-overline">ROI on Exposure</span>
            <span className="font-mono-ibm" data-testid="metric-roi-exposure">{pct(result.returnOnMarketExposurePct)}</span>
          </div>
        </div>
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
