import type { MtfLot } from "@/types";
import { inrCurrency, displayDate } from "@/lib/formatters";
import { VerificationBadge } from "./VerificationBadge";
import { Trash2, Pencil } from "lucide-react";

export const LedgerTable = ({
  lots,
  onEdit,
  onDelete,
}: {
  lots: MtfLot[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="border border-[#102A43] bg-white overflow-x-auto" data-testid="ledger-table">
      <table className="kypnl-table">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Broker</th>
            <th>Purchase</th>
            <th className="num">Qty</th>
            <th className="num">Buy</th>
            <th className="num">Current</th>
            <th className="num">User Cap</th>
            <th className="num">Interest</th>
            <th className="num">Break-even</th>
            <th className="num">Net P&L</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lots.map((l) => (
            <tr key={l.id} data-testid={`ledger-row-${l.id}`}>
              <td className="text-[13px] font-medium">
                {l.instrument}
                {l.isMock && (
                  <span className="ml-2 text-[10px] uppercase tracking-widest text-[#d97706] border border-[#d97706] px-1 py-0.5">
                    Mock
                  </span>
                )}
              </td>
              <td className="text-[12px] text-[#486581]">{l.brokerSlug}</td>
              <td className="text-[12px]">{displayDate(l.purchaseDate)}</td>
              <td className="num font-mono-ibm">{l.quantity}</td>
              <td className="num font-mono-ibm">{inrCurrency(l.buyPrice)}</td>
              <td className="num font-mono-ibm">{inrCurrency(l.currentPrice)}</td>
              <td className="num font-mono-ibm">{inrCurrency(l.userCapital)}</td>
              <td className="num font-mono-ibm">{inrCurrency(l.mtfInterest)}</td>
              <td className="num font-mono-ibm">{inrCurrency(l.breakevenPrice)}</td>
              <td className={`num font-mono-ibm ${l.estimatedNetPnl >= 0 ? "text-[#087F6D]" : "text-[#087F6D]"}`}>
                {inrCurrency(l.estimatedNetPnl)}
              </td>
              <td><VerificationBadge status={l.verificationStatus} /></td>
              <td>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1 border border-[#e5e5df] hover:border-[#102A43]"
                    onClick={() => onEdit(l.id)}
                    aria-label="Edit"
                    data-testid={`ledger-edit-${l.id}`}
                  >
                    <Pencil size={12} strokeWidth={1.75} />
                  </button>
                  <button
                    className="p-1 border border-[#e5e5df] hover:border-[#087F6D] hover:text-[#087F6D]"
                    onClick={() => onDelete(l.id)}
                    aria-label="Delete"
                    data-testid={`ledger-delete-${l.id}`}
                  >
                    <Trash2 size={12} strokeWidth={1.75} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
