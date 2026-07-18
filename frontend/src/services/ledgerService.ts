import type { MtfLot, PortfolioSummary } from "@/types";

const STORAGE_KEY = "kypnl.mtf.ledger.v1";

const readRaw = (): MtfLot[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MtfLot[];
  } catch {
    return null;
  }
};

const write = (lots: MtfLot[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lots));
};

export const ledgerService = {
  init(): MtfLot[] {
    const existing = readRaw();
    if (existing) return existing;
    write([]);
    return [];
  },
  list(): MtfLot[] {
    return readRaw() ?? this.init();
  },
  add(lot: MtfLot) {
    const lots = this.list();
    const next = [lot, ...lots];
    write(next);
    return next;
  },
  update(id: string, patch: Partial<MtfLot>) {
    const lots = this.list().map((l) => (l.id === id ? { ...l, ...patch } : l));
    write(lots);
    return lots;
  },
  remove(id: string) {
    const lots = this.list().filter((l) => l.id !== id);
    write(lots);
    return lots;
  },
  clearAll() {
    write([]);
    return [] as MtfLot[];
  },
  exportJson(): string {
    return JSON.stringify(this.list(), null, 2);
  },
  importJson(json: string): MtfLot[] {
    const parsed = JSON.parse(json) as MtfLot[];
    if (!Array.isArray(parsed)) throw new Error("Invalid ledger file");
    write(parsed);
    return parsed;
  },
  summary(): PortfolioSummary {
    const lots = this.list();
    const sum = (fn: (l: MtfLot) => number) => lots.reduce((s, l) => s + fn(l), 0);
    return {
      totalUserCapital: sum((l) => l.userCapital),
      totalBrokerFunded: sum((l) => l.brokerFunded),
      totalInterestAccrued: sum((l) => l.mtfInterest),
      totalEntryCharges: sum((l) => l.entryCharges),
      totalEstimatedExitCharges: sum((l) => l.estimatedExitCharges),
      totalUnrealisedPnl: sum((l) => l.unrealisedPnl),
      totalEstimatedNetPnl: sum((l) => l.estimatedNetPnl),
      positions: lots.length,
    };
  },
};
