import type { MtfLot } from "@/types";
import { inrCurrency, displayDate } from "@/lib/formatters";
import { VerificationBadge } from "./VerificationBadge";
import { Trash2, Pencil } from "lucide-react";

export const LedgerMobileCard = ({
  lot,
  onEdit,
  onDelete,
}: {
  lot: MtfLot;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="border border-[#0a0a0a] bg-white p-4" data-testid={`ledger-card-${lot.id}`}>
    <div className="flex items-start justify-between mb-2">
      <div>
        <div className="font-editorial text-lg font-semibold">{lot.instrument}</div>
        <div className="text-[12px] text-[#525252]">{lot.brokerSlug} · {displayDate(lot.purchaseDate)}</div>
      </div>
      <VerificationBadge status={lot.verificationStatus} />
    </div>
    <dl className="grid grid-cols-2 gap-y-1 text-[13px]">
      <dt className="kypnl-overline">Qty</dt><dd className="text-right font-mono-ibm">{lot.quantity}</dd>
      <dt className="kypnl-overline">Buy</dt><dd className="text-right font-mono-ibm">{inrCurrency(lot.buyPrice)}</dd>
      <dt className="kypnl-overline">Current</dt><dd className="text-right font-mono-ibm">{inrCurrency(lot.currentPrice)}</dd>
      <dt className="kypnl-overline">Interest</dt><dd className="text-right font-mono-ibm">{inrCurrency(lot.mtfInterest)}</dd>
      <dt className="kypnl-overline">Break-even</dt><dd className="text-right font-mono-ibm">{inrCurrency(lot.breakevenPrice)}</dd>
      <dt className="kypnl-overline">Net P&L</dt>
      <dd className={`text-right font-mono-ibm ${lot.estimatedNetPnl >= 0 ? "text-[#057a55]" : "text-[#d43325]"}`}>
        {inrCurrency(lot.estimatedNetPnl)}
      </dd>
    </dl>
    <div className="mt-3 pt-3 border-t border-[#e5e5df] flex gap-2">
      <button
        className="flex-1 inline-flex items-center justify-center gap-1 text-[12px] py-1.5 border border-[#e5e5df]"
        onClick={() => onEdit(lot.id)}
        data-testid={`ledger-card-edit-${lot.id}`}
      >
        <Pencil size={12} /> Edit
      </button>
      <button
        className="flex-1 inline-flex items-center justify-center gap-1 text-[12px] py-1.5 border border-[#e5e5df] hover:border-[#d43325] hover:text-[#d43325]"
        onClick={() => onDelete(lot.id)}
        data-testid={`ledger-card-delete-${lot.id}`}
      >
        <Trash2 size={12} /> Delete
      </button>
    </div>
  </div>
);
