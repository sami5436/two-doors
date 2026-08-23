import { describe, expect, it } from "vitest";
import { assessedValueInYear, propertyTax } from "../tax";

describe("propertyTax homestead handling", () => {
  const base = { assessedValue: 400_000, effectiveRatePct: 2.2, isdRatePct: 1.0 };

  it("applies the exemption to the ISD portion only", () => {
    const r = propertyTax({ ...base, homesteadShare: 0.5 });

    // $140k off a 1.0 percent ISD rate is exactly $1,400 a year, and nothing
    // else on the bill moves.
    expect(r.isdExemption).toBe(140_000);
    expect(r.isdTaxableValue).toBe(260_000);
    expect(r.isdTax).toBeCloseTo(2_600, 6);
    expect(r.otherTax).toBeCloseTo(4_800, 6);
    expect(r.annualTax).toBeCloseTo(7_400, 6);
    expect(r.annualSavings).toBeCloseTo(1_400, 6);
  });

  it("saves exactly the exemption times the ISD rate", () => {
    const r = propertyTax({ ...base, homesteadShare: 0.5 });
    expect(r.annualSavings).toBeCloseTo((r.isdExemption * base.isdRatePct) / 100, 6);
  });

  it("gives a pure rental no exemption at all", () => {
    const r = propertyTax({ ...base, homesteadShare: 0 });
    expect(r.isdExemption).toBe(0);
    expect(r.annualTax).toBeCloseTo(8_800, 6);
    expect(r.annualSavings).toBeCloseTo(0, 6);
  });

  it("caps the exemption at the value of the half you occupy", () => {
    // A $200k duplex has only $100k of homestead to exempt, not the full $140k.
    const r = propertyTax({ ...base, assessedValue: 200_000, homesteadShare: 0.5 });
    expect(r.isdExemption).toBe(100_000);
  });

  it("never produces a negative taxable value", () => {
    const r = propertyTax({ ...base, assessedValue: 120_000, homesteadShare: 1 });
    expect(r.isdTaxableValue).toBeGreaterThanOrEqual(0);
    expect(r.annualTax).toBeGreaterThanOrEqual(0);
  });
});

describe("assessedValueInYear", () => {
  it("holds the 10 percent cap when the market runs faster", () => {
    // 15 percent market growth for 5 years, capped to 10 percent compounding.
    const capped = assessedValueInYear(400_000, 15, 5, true);
    expect(capped).toBeCloseTo(400_000 * Math.pow(1.1, 5), 4);
    expect(capped).toBeCloseTo(644_204.0, 0);
  });

  it("does not cap a property with no homestead", () => {
    const uncapped = assessedValueInYear(400_000, 15, 5, false);
    expect(uncapped).toBeCloseTo(804_542.7, 0);
    expect(uncapped).toBeGreaterThan(assessedValueInYear(400_000, 15, 5, true));
  });

  it("uses market value when it grows slower than the cap", () => {
    expect(assessedValueInYear(400_000, 3, 5, true)).toBeCloseTo(400_000 * Math.pow(1.03, 5), 4);
  });
});
