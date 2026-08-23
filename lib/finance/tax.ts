import { TEXAS } from "@/lib/data/texas";

export type PropertyTaxInput = {
  /** What the appraisal district assesses. On a purchase this resets to your price. */
  assessedValue: number;
  /** Total rate across every taxing entity, percent of taxable value. */
  effectiveRatePct: number;
  /** The school district slice of that total. The exemption only touches this. */
  isdRatePct: number;
  /**
   * Share of the property treated as your residence homestead, 0 to 1.
   * A duplex you live in half of is 0.5. A pure rental is 0.
   */
  homesteadShare: number;
};

export type PropertyTaxResult = {
  isdExemption: number;
  isdTaxableValue: number;
  isdTax: number;
  otherTax: number;
  annualTax: number;
  monthlyTax: number;
  /** What you would have paid with no homestead at all. */
  annualTaxWithoutHomestead: number;
  annualSavings: number;
};

/**
 * The homestead exemption reduces the school district portion of the bill and
 * nothing else, which is why the ISD rate is tracked separately from the total.
 *
 * Simplification worth knowing: on a duplex the appraisal district grants the
 * exemption against the portion you occupy, so the exemption is capped by the
 * value of your half. Local option exemptions offered by some cities and
 * counties are not modeled, so this errs toward a slightly higher bill.
 */
export function propertyTax(input: PropertyTaxInput): PropertyTaxResult {
  const { assessedValue, effectiveRatePct, isdRatePct } = input;
  const share = Math.min(Math.max(input.homesteadShare, 0), 1);

  const homesteadPortionValue = assessedValue * share;
  const isdExemption = share > 0 ? Math.min(TEXAS.homesteadIsdExemption.value, homesteadPortionValue) : 0;

  const isdTaxableValue = Math.max(assessedValue - isdExemption, 0);
  const isdTax = (isdTaxableValue * isdRatePct) / 100;

  const otherRatePct = Math.max(effectiveRatePct - isdRatePct, 0);
  const otherTax = (assessedValue * otherRatePct) / 100;

  const annualTax = isdTax + otherTax;
  const annualTaxWithoutHomestead = (assessedValue * effectiveRatePct) / 100;

  return {
    isdExemption,
    isdTaxableValue,
    isdTax,
    otherTax,
    annualTax,
    monthlyTax: annualTax / 12,
    annualTaxWithoutHomestead,
    annualSavings: annualTaxWithoutHomestead - annualTax,
  };
}

/**
 * Assessed value in year N. With an active homestead the assessed value cannot
 * climb more than 10 percent a year even when the market value runs away from
 * it. Without one, there is no cap and you eat the full appraisal.
 */
export function assessedValueInYear(
  purchasePrice: number,
  marketGrowthPct: number,
  yearsHeld: number,
  hasHomestead: boolean,
): number {
  const marketValue = purchasePrice * Math.pow(1 + marketGrowthPct / 100, yearsHeld);
  if (!hasHomestead) return marketValue;

  const capped = purchasePrice * Math.pow(1 + TEXAS.appraisalCapPct.value / 100, yearsHeld);
  return Math.min(marketValue, capped);
}
