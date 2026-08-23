import { describe, expect, it } from "vitest";
import { analyzeDeal, type DealInputs } from "../deal";
import { monthsOfRunway, project } from "../stress";

const deal: DealInputs = {
  mode: "househack",
  metro: "dfw",
  submarket: "garland",
  price: 385_000,
  downPct: 3.5,
  ratePct: 7.3,
  loanType: "fha",
  termYears: 30,
  taxRatePct: 2.31,
  isdRatePct: 1.05,
  insuranceAnnual: 4_500,
  rentPerUnit: 1_750,
  currentRent: 1_800,
  hoaMonthly: 0,
  vacancyPct: 8,
  maintenancePct: 5,
  capexPct: 5,
  managementPct: 0,
  closingCostPct: 3,
};

describe("analyzeDeal", () => {
  it("rents one unit when you live in the other, two when you do not", () => {
    expect(analyzeDeal(deal).rentedUnits).toBe(1);
    expect(analyzeDeal({ ...deal, mode: "rental" }).rentedUnits).toBe(2);
    expect(analyzeDeal({ ...deal, mode: "rental" }).grossRent).toBe(3_500);
  });

  it("gives the house hack a homestead and the rental none", () => {
    expect(analyzeDeal(deal).homesteadSavingsAnnual).toBeCloseTo(1_470, 0);
    expect(analyzeDeal({ ...deal, mode: "rental" }).homesteadSavingsAnnual).toBe(0);
  });

  it("makes effective housing cost the mirror of cash flow", () => {
    const r = analyzeDeal(deal);
    expect(r.effectiveHousingCost).toBeCloseTo(-r.cashFlow, 6);
  });

  it("breaks even exactly at the break even rent", () => {
    const r = analyzeDeal(deal);
    const atBreakEven = analyzeDeal({ ...deal, rentPerUnit: r.breakEvenRentPerUnit });
    expect(atBreakEven.cashFlow).toBeCloseTo(0, 6);
    expect(atBreakEven.effectiveHousingCost).toBeCloseTo(0, 6);
  });

  it("counts the down payment and closing costs as cash in", () => {
    const r = analyzeDeal(deal);
    expect(r.closingCosts).toBeCloseTo(11_550, 6);
    expect(r.cashInvested).toBeCloseTo(13_475 + 11_550, 6);
  });

  it("excludes debt service and mortgage insurance from NOI", () => {
    const r = analyzeDeal({ ...deal, mode: "rental" });
    const opex =
      (r.vacancyLoss + r.maintenance + r.capex + r.management) * 12 +
      r.annualTax +
      deal.insuranceAnnual;
    expect(r.noiAnnual).toBeCloseTo(r.grossRent * 12 - opex, 4);
  });

  it("beats renting only when the other unit covers enough of the carry", () => {
    const weak = analyzeDeal({ ...deal, rentPerUnit: 600 });
    const strong = analyzeDeal({ ...deal, rentPerUnit: 2_600 });
    expect(weak.savingsVsCurrentRent).toBeLessThan(strong.savingsVsCurrentRent);
  });
});

describe("stress", () => {
  it("reports infinite runway when the deal carries itself", () => {
    expect(monthsOfRunway({ ...deal, rentPerUnit: 6_000 }, 20_000)).toBe(Infinity);
  });

  it("burns reserves when it does not", () => {
    const runway = monthsOfRunway({ ...deal, rentPerUnit: 400, currentRent: 0 }, 20_000);
    expect(runway).toBeGreaterThan(0);
    expect(Number.isFinite(runway)).toBe(true);
  });
});

describe("project", () => {
  it("holds the assessed value to the 10 percent cap for a house hack", () => {
    const rows = project(deal, 5, { rentGrowthPct: 3, marketGrowthPct: 15 });
    expect(rows).toHaveLength(5);
    expect(rows[0].assessedValue).toBeCloseTo(385_000, 4);
    expect(rows[4].assessedValue).toBeCloseTo(385_000 * Math.pow(1.1, 4), 2);
  });

  it("lets a pure rental take the full appraisal", () => {
    const hacked = project(deal, 5, { rentGrowthPct: 3, marketGrowthPct: 15 });
    const rented = project({ ...deal, mode: "rental" }, 5, {
      rentGrowthPct: 3,
      marketGrowthPct: 15,
    });
    expect(rented[4].assessedValue).toBeGreaterThan(hacked[4].assessedValue);
  });
});
