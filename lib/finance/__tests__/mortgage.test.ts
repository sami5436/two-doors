import { describe, expect, it } from "vitest";
import { amortize, balanceAfter, monthlyPayment } from "../mortgage";

describe("monthlyPayment", () => {
  // Checked against a standard amortization table, not against our own code.
  it("matches known payments", () => {
    expect(monthlyPayment(300_000, 6.5, 30)).toBeCloseTo(1896.2, 1);
    expect(monthlyPayment(200_000, 5, 30)).toBeCloseTo(1073.64, 1);
    expect(monthlyPayment(500_000, 7.3, 30)).toBeCloseTo(3427.85, 1);
  });

  it("handles a zero rate as straight line repayment", () => {
    expect(monthlyPayment(120_000, 0, 10)).toBeCloseTo(1000, 6);
  });

  it("returns zero for a zero principal or term", () => {
    expect(monthlyPayment(0, 6.5, 30)).toBe(0);
    expect(monthlyPayment(300_000, 6.5, 0)).toBe(0);
  });
});

describe("balanceAfter", () => {
  it("starts at the principal and ends at zero", () => {
    expect(balanceAfter(300_000, 6.5, 30, 0)).toBeCloseTo(300_000, 6);
    expect(balanceAfter(300_000, 6.5, 30, 360)).toBeCloseTo(0, 4);
  });

  it("agrees with running the amortization schedule", () => {
    const viaSchedule = amortize(300_000, 6.5, 30, 60).at(-1)!.balance;
    expect(balanceAfter(300_000, 6.5, 30, 60)).toBeCloseTo(viaSchedule, 4);
  });

  it("pays down slowly early, which is the whole point of an amortized loan", () => {
    const afterFiveYears = balanceAfter(300_000, 6.5, 30, 60);
    // Sixty payments of ~1896 is ~114k paid, but under 20k of it touches principal.
    expect(300_000 - afterFiveYears).toBeLessThan(20_000);
  });
});

describe("amortize", () => {
  it("splits every payment into interest and principal without drift", () => {
    const rows = amortize(300_000, 6.5, 30, 12);
    const payment = monthlyPayment(300_000, 6.5, 30);
    for (const row of rows) {
      expect(row.interest + row.principal).toBeCloseTo(payment, 6);
    }
  });
});
