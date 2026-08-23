import { analyzeDeal, type DealInputs, type DealResult } from "./deal";
import { assessedValueInYear } from "./tax";

export type StressCase = {
  label: string;
  /** What it does to the number that matters for the mode you are in. */
  monthlyDelta: number;
  resultMonthly: number;
};

/**
 * The downside cases. Most calculators show you the happy path and stop, which
 * is exactly the part you already believe.
 */
export function stressCases(input: DealInputs): StressCase[] {
  const base = analyzeDeal(input);
  const baseMonthly = monthlyFigure(input, base);

  const variants: { label: string; patch: Partial<DealInputs> }[] = [
    { label: "Rent comes in 10 percent under", patch: { rentPerUnit: input.rentPerUnit * 0.9 } },
    { label: "Vacancy runs at 15 percent", patch: { vacancyPct: 15 } },
    { label: "Rate is a point higher", patch: { ratePct: input.ratePct + 1 } },
    { label: "Insurance jumps 25 percent", patch: { insuranceAnnual: input.insuranceAnnual * 1.25 } },
    { label: "Tax reassessed 10 percent up", patch: { taxRatePct: input.taxRatePct * 1.1 } },
  ];

  return variants.map(({ label, patch }) => {
    const result = analyzeDeal({ ...input, ...patch });
    const resultMonthly = monthlyFigure({ ...input, ...patch }, result);
    return { label, monthlyDelta: resultMonthly - baseMonthly, resultMonthly };
  });
}

function monthlyFigure(input: DealInputs, result: DealResult): number {
  return input.mode === "househack" ? result.effectiveHousingCost : result.cashFlow;
}

/**
 * How many months of negative carry a reserve covers. Returns Infinity when the
 * deal carries itself, which is the answer you want.
 */
export function monthsOfRunway(input: DealInputs, reserve: number): number {
  const result = analyzeDeal(input);
  const burn =
    input.mode === "househack"
      ? result.effectiveHousingCost - input.currentRent
      : -result.cashFlow;

  if (burn <= 0) return Infinity;
  return reserve / burn;
}

export type ProjectionRow = {
  year: number;
  assessedValue: number;
  annualTax: number;
  grossRent: number;
  cashFlow: number;
  effectiveHousingCost: number;
};

/**
 * Forward projection. The homestead cap matters here: with it your assessed
 * value cannot climb more than 10 percent a year, without it you eat the full
 * appraisal every year.
 */
export function project(
  input: DealInputs,
  years: number,
  opts: { rentGrowthPct: number; marketGrowthPct: number },
): ProjectionRow[] {
  const hasHomestead = input.mode === "househack";
  const rows: ProjectionRow[] = [];

  for (let year = 1; year <= years; year += 1) {
    const assessedValue = assessedValueInYear(
      input.price,
      opts.marketGrowthPct,
      year - 1,
      hasHomestead,
    );
    const rentPerUnit = input.rentPerUnit * Math.pow(1 + opts.rentGrowthPct / 100, year - 1);

    // Reassessment moves the tax bill, so re-run the deal against the new value
    // while keeping the original loan payment fixed.
    const scaledTaxRate = input.price > 0 ? (input.taxRatePct * assessedValue) / input.price : 0;
    const result = analyzeDeal({ ...input, rentPerUnit, taxRatePct: scaledTaxRate });

    rows.push({
      year,
      assessedValue,
      annualTax: result.annualTax,
      grossRent: result.grossRent,
      cashFlow: result.cashFlow,
      effectiveHousingCost: result.effectiveHousingCost,
    });
  }

  return rows;
}
