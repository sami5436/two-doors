const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function money(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  return usd0.format(Math.round(n));
}

/** Keeps the sign visible, which matters when a figure can go either way. */
export function signedMoney(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  const rounded = Math.round(n);
  if (rounded === 0) return usd0.format(0);
  return `${rounded > 0 ? "+" : "−"}${usd0.format(Math.abs(rounded))}`;
}

export function pct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "n/a";
  return `${n.toFixed(digits)}%`;
}

export function ratio(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "n/a";
  return n.toFixed(digits);
}

export function months(n: number): string {
  if (!Number.isFinite(n)) return "indefinite";
  return `${Math.floor(n)} mo`;
}

/** A band renders as its endpoints, since the midpoint is not the answer. */
export function band(low: number, high: number, fmt: (n: number) => string): string {
  return `${fmt(low)} to ${fmt(high)}`;
}
