export const inr = (n: number, opts: { compact?: boolean; decimals?: number } = {}) => {
  const { compact = false, decimals = 2 } = opts;
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (compact && abs >= 1_00_00_000) return `${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (compact && abs >= 1_00_000) return `${(n / 1_00_000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
};

export const inrCurrency = (n: number, opts: { decimals?: number } = {}) => {
  const { decimals = 2 } = opts;
  return `₹${inr(n, { decimals })}`;
};

export const pct = (n: number, decimals = 2) => {
  if (!isFinite(n)) return "—";
  return `${n.toFixed(decimals)}%`;
};

export const daysBetween = (a: string, b: string) => {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
};

export const isoDate = (d: string | Date) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toISOString().slice(0, 10);
};

export const displayDate = (d: string) => {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return d;
  }
};

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
