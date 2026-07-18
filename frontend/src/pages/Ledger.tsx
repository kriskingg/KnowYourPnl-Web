"import { useEffect, useMemo, useRef, useState } from \"react\";
import { ledgerService } from \"@/services/ledgerService\";
import { brokerService } from \"@/services/brokerService\";
import type { Broker, MtfLot, PortfolioSummary } from \"@/types\";
import { LedgerTable } from \"@/components/shared/LedgerTable\";
import { LedgerMobileCard } from \"@/components/shared/LedgerMobileCard\";
import { Button } from \"@/components/ui/button\";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from \"@/components/ui/dialog\";
import { Input } from \"@/components/ui/input\";
import { Label } from \"@/components/ui/label\";
import { inrCurrency, uid, displayDate } from \"@/lib/formatters\";
import { calculateMtf } from \"@/services/calculationService\";
import { toast } from \"sonner\";
import { Plus, Download, Upload, Trash, RotateCcw } from \"lucide-react\";

const inputCls = \"rounded-none border-[#0a0a0a] h-9 font-mono-ibm text-[13px] focus-visible:ring-1 focus-visible:ring-black\";

const emptyLot = (broker: Broker): MtfLot => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: uid(),
    brokerSlug: broker.slug,
    planId: broker.plans[0].id,
    instrument: \"\",
    purchaseDate: today,
    quantity: 10,
    buyPrice: 1000,
    currentPrice: 1000,
    userCapital: 0,
    brokerFunded: 0,
    mtfInterest: 0,
    entryCharges: 0,
    estimatedExitCharges: 0,
    breakevenPrice: 0,
    unrealisedPnl: 0,
    estimatedNetPnl: 0,
    tariffVersion: broker.currentTariffVersion,
    methodologyVersion: \"mtf-methodology-v1\",
    verificationStatus: \"user_modified\",
    isMock: false,
    createdAt: new Date().toISOString(),
  };
};

const recomputeLot = (lot: MtfLot, broker: Broker): MtfLot => {
  const today = new Date().toISOString().slice(0, 10);
  const r = calculateMtf({
    brokerSlug: lot.brokerSlug,
    planId: lot.planId,
    buyPrice: lot.buyPrice,
    quantity: lot.quantity,
    expectedSellPrice: lot.currentPrice,
    purchaseDate: lot.purchaseDate,
    expectedExitDate: today,
    userMarginPct: broker.mtf.minMarginPct,
    brokerFundedPct: broker.mtf.brokerFundedPct,
    annualInterestRatePct: broker.mtf.annualInterestRatePct,
    pledgeRequests: 1,
    unpledgeRequests: 0,
    dpDebitEvents: 0,
  });
  const buyBrokerage = r.breakdown.buySide.find((l) => l.key === \"buy_brokerage\")!.amount;
  const sellBrokerage = r.breakdown.sellSide.find((l) => l.key === \"sell_brokerage\")!.amount;
  return {
    ...lot,
    userCapital: r.userCapital,
    brokerFunded: r.brokerFunded,
    mtfInterest: r.interestTotal,
    entryCharges: buyBrokerage + r.breakdown.buySide.reduce((s, l) => s + (l.key !== \"buy_brokerage\" ? l.amount : 0), 0),
    estimatedExitCharges: sellBrokerage + r.breakdown.sellSide.reduce((s, l) => s + (l.key !== \"sell_brokerage\" ? l.amount : 0), 0) + r.breakdown.operational.reduce((s, l) => s + l.amount, 0),
    breakevenPrice: r.breakevenPrice,
    unrealisedPnl: (lot.currentPrice - lot.buyPrice) * lot.quantity,
    estimatedNetPnl: r.netPnl,
  };
};

export const Ledger = () => {
  const [lots, setLots] = useState<MtfLot[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [editing, setEditing] = useState<MtfLot | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLots(ledgerService.init());
    brokerService.list().then(setBrokers);
  }, []);

  const summary: PortfolioSummary = useMemo(() => ledgerService.summary(), [lots]);

  const brokerFor = (slug: string) => brokers.find((b) => b.slug === slug) ?? brokers[0];

  const onAddNew = () => {
    if (!brokers[0]) return;
    setEditing(emptyLot(brokers[0]));
  };

  const onEdit = (id: string) => {
    const lot = lots.find((l) => l.id === id);
    if (lot) setEditing({ ...lot });
  };

  const onDelete = (id: string) => {
    setLots(ledgerService.remove(id));
    toast.success(\"Position removed\");
  };

  const onSave = () => {
    if (!editing) return;
    const broker = brokerFor(editing.brokerSlug);
    if (!broker) return;
    const recomputed = recomputeLot(editing, broker);
    const exists = lots.find((l) => l.id === recomputed.id);
    if (exists) {
      setLots(ledgerService.update(recomputed.id, { ...recomputed, isMock: false, verificationStatus: \"user_modified\" }));
      toast.success(\"Position updated\");
    } else {
      setLots(ledgerService.add({ ...recomputed, isMock: false, verificationStatus: \"user_modified\" }));
      toast.success(\"Position added\");
    }
    setEditing(null);
  };

  const onExport = () => {
    const blob = new Blob([ledgerService.exportJson()], { type: \"application/json\" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement(\"a\");
    a.href = url;
    a.download = `kypnl-ledger-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      setLots(ledgerService.importJson(text));
      toast.success(\"Ledger imported\");
    } catch (err) {
      toast.error(\"Invalid ledger file\");
    } finally {
      if (fileRef.current) fileRef.current.value = \"\";
    }
  };

  const onClear = () => {
    if (!window.confirm(\"Clear all ledger positions? This cannot be undone.\")) return;
    setLots(ledgerService.clearAll());
  };

  const onResetDemo = () => {
    setLots(ledgerService.resetToDemo());
    toast.success(\"Demo ledger restored\");
  };

  return (
    <div className=\"mx-auto max-w-7xl px-4 md:px-6 py-10\" data-testid=\"page-ledger\">
      <header className=\"border-b border-black pb-6 mb-8 flex items-start justify-between gap-6 flex-wrap\">
        <div>
          <div className=\"kypnl-overline\">MTF Ledger</div>
          <h1 className=\"font-editorial text-4xl md:text-5xl font-semibold mt-2\">Positions in view.</h1>
          <p className=\"text-[14px] text-[#525252] max-w-2xl mt-3\">
            A local ledger that sits in your browser. Demonstration lots are labelled Mock and prices
            are user-entered. Nothing is uploaded.
          </p>
        </div>
        <div className=\"flex flex-wrap gap-2\">
          <Button className=\"rounded-none bg-black text-[#f9f9f7] hover:bg-[#d43325]\" onClick={onAddNew} data-testid=\"ledger-add-button\">
            <Plus size={13} className=\"mr-1\" /> Add position
          </Button>
          <Button variant=\"outline\" className=\"rounded-none border-black\" onClick={onExport} data-testid=\"ledger-export-button\">
            <Download size={13} className=\"mr-1\" /> Export
          </Button>
          <label className=\"inline-flex items-center gap-1 border border-black px-3 h-9 text-[13px] cursor-pointer hover:bg-white\" data-testid=\"ledger-import-label\">
            <Upload size={13} /> Import
            <input ref={fileRef} type=\"file\" accept=\"application/json\" className=\"hidden\" onChange={onImport} data-testid=\"ledger-import-input\" />
          </label>
          <Button variant=\"outline\" className=\"rounded-none border-black\" onClick={onResetDemo} data-testid=\"ledger-reset-button\">
            <RotateCcw size={13} className=\"mr-1\" /> Reset to demo
          </Button>
          <Button variant=\"outline\" className=\"rounded-none border-black hover:border-[#d43325] hover:text-[#d43325]\" onClick={onClear} data-testid=\"ledger-clear-button\">
            <Trash size={13} className=\"mr-1\" /> Clear all
          </Button>
        </div>
      </header>

      <section className=\"grid grid-cols-2 md:grid-cols-4 border border-[#0a0a0a] bg-white mb-8\" data-testid=\"ledger-summary\">
        <SummaryCell label=\"Positions\" value={String(summary.positions)} />
        <SummaryCell label=\"User capital\" value={inrCurrency(summary.totalUserCapital)} border />
        <SummaryCell label=\"Broker funded\" value={inrCurrency(summary.totalBrokerFunded)} border />
        <SummaryCell label=\"Interest accrued\" value={inrCurrency(summary.totalInterestAccrued)} border />
        <SummaryCell label=\"Entry charges\" value={inrCurrency(summary.totalEntryCharges)} borderTop />
        <SummaryCell label=\"Est. exit charges\" value={inrCurrency(summary.totalEstimatedExitCharges)} border borderTop />
        <SummaryCell label=\"Unrealised P&L\" value={inrCurrency(summary.totalUnrealisedPnl)} border borderTop tone={summary.totalUnrealisedPnl >= 0 ? \"pos\" : \"neg\"} />
        <SummaryCell label=\"Est. Net P&L\" value={inrCurrency(summary.totalEstimatedNetPnl)} border borderTop tone={summary.totalEstimatedNetPnl >= 0 ? \"pos\" : \"neg\"} />
      </section>

      {lots.length === 0 ? (
        <div className=\"border border-dashed border-[#0a0a0a] p-8 text-center text-[13px] text-[#525252]\" data-testid=\"ledger-empty\">
          Your ledger is empty. Add a position or restore the demo ledger to see it in action.
        </div>
      ) : (
        <>
          <div className=\"hidden md:block\">
            <LedgerTable lots={lots} onEdit={onEdit} onDelete={onDelete} />
          </div>
          <div className=\"md:hidden grid gap-3\">
            {lots.map((l) => (
              <LedgerMobileCard key={l.id} lot={l} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
          <p className=\"mt-3 text-[11px] text-[#525252] italic\">
            Current prices are user-entered or from demo seeds — never a live quote.
            Last synced: {displayDate(new Date().toISOString())}.
          </p>
        </>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className=\"rounded-none border-black\" data-testid=\"ledger-editor-dialog\">
          <DialogHeader>
            <DialogTitle className=\"font-editorial text-2xl\">
              {editing && lots.find((l) => l.id === editing.id) ? \"Edit position\" : \"Add position\"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className=\"grid grid-cols-2 gap-3\">
              <Field label=\"Instrument\">
                <Input className={inputCls} value={editing.instrument} onChange={(e) => setEditing({ ...editing, instrument: e.target.value.toUpperCase() })} data-testid=\"editor-instrument\" />
              </Field>
              <Field label=\"Broker\">
                <select
                  className={inputCls + \" px-2 bg-white\"}
                  value={editing.brokerSlug}
                  onChange={(e) => setEditing({ ...editing, brokerSlug: e.target.value, planId: brokerFor(e.target.value).plans[0].id })}
                  data-testid=\"editor-broker\"
                >
                  {brokers.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
                </select>
              </Field>
              <Field label=\"Purchase date\">
                <Input className={inputCls} type=\"date\" value={editing.purchaseDate} onChange={(e) => setEditing({ ...editing, purchaseDate: e.target.value })} data-testid=\"editor-purchase-date\" />
              </Field>
              <Field label=\"Quantity\">
                <Input className={inputCls} type=\"number\" value={editing.quantity} onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })} data-testid=\"editor-quantity\" />
              </Field>
              <Field label=\"Buy price\">
                <Input className={inputCls} type=\"number\" step=\"0.05\" value={editing.buyPrice} onChange={(e) => setEditing({ ...editing, buyPrice: Number(e.target.value) })} data-testid=\"editor-buy\" />
              </Field>
              <Field label=\"Current price\">
                <Input className={inputCls} type=\"number\" step=\"0.05\" value={editing.currentPrice} onChange={(e) => setEditing({ ...editing, currentPrice: Number(e.target.value) })} data-testid=\"editor-current\" />
              </Field>
            </div>
          )}
          <DialogFooter>
            <Button variant=\"outline\" className=\"rounded-none border-black\" onClick={() => setEditing(null)} data-testid=\"editor-cancel\">Cancel</Button>
            <Button className=\"rounded-none bg-black text-[#f9f9f7] hover:bg-[#d43325]\" onClick={onSave} data-testid=\"editor-save\">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className=\"flex flex-col gap-1\">
    <Label className=\"kypnl-overline\">{label}</Label>
    {children}
  </div>
);

const SummaryCell = ({
  label,
  value,
  border,
  borderTop,
  tone,
}: {
  label: string;
  value: string;
  border?: boolean;
  borderTop?: boolean;
  tone?: \"pos\" | \"neg\";
}) => (
  <div
    className={`p-4 ${border ? \"border-l\" : \"\"} ${borderTop ? \"border-t\" : \"\"} border-[#e5e5df]`}
  >
    <div className=\"kypnl-overline\">{label}</div>
    <div
      className={`font-mono-ibm text-[15px] mt-1 ${tone === \"pos\" ? \"text-[#057a55]\" : tone === \"neg\" ? \"text-[#d43325]\" : \"\"}`}
    >
      {value}
    </div>
  </div>
);
"