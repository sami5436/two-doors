/** Standard amortized payment. Handles the zero rate case so tests do not divide by zero. */
export function monthlyPayment(principal: number, annualRatePct: number, termYears: number): number {
  const n = Math.round(termYears * 12);
  if (n <= 0) return 0;
  if (principal <= 0) return 0;

  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;

  const growth = Math.pow(1 + r, n);
  return (principal * r * growth) / (growth - 1);
}

/** Remaining balance after `month` payments. Month 0 is the original principal. */
export function balanceAfter(
  principal: number,
  annualRatePct: number,
  termYears: number,
  month: number,
): number {
  const n = Math.round(termYears * 12);
  const m = Math.min(Math.max(Math.round(month), 0), n);
  if (principal <= 0) return 0;

  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal * (1 - m / n);

  const growth = Math.pow(1 + r, m);
  const payment = monthlyPayment(principal, annualRatePct, termYears);
  const balance = principal * growth - payment * ((growth - 1) / r);
  return Math.max(balance, 0);
}

export type AmortizationRow = {
  month: number;
  interest: number;
  principal: number;
  balance: number;
};

/** Month by month split of a payment into interest and principal. */
export function amortize(
  principal: number,
  annualRatePct: number,
  termYears: number,
  months: number,
): AmortizationRow[] {
  const payment = monthlyPayment(principal, annualRatePct, termYears);
  const r = annualRatePct / 100 / 12;
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * r;
    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(balance - principalPaid, 0);
    rows.push({ month, interest, principal: principalPaid, balance });
  }

  return rows;
}

/** Total interest paid across the first `months` payments. */
export function interestPaidThrough(
  principal: number,
  annualRatePct: number,
  termYears: number,
  months: number,
): number {
  return amortize(principal, annualRatePct, termYears, months).reduce(
    (sum, row) => sum + row.interest,
    0,
  );
}
