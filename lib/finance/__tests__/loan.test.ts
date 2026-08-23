import { describe, expect, it } from "vitest";
import { buildLoan, mortgageInsuranceActive } from "../loan";

const fhaHouseHack = {
  price: 385_000,
  downPct: 3.5,
  ratePct: 7.3,
  termYears: 30,
  loanType: "fha" as const,
};

describe("FHA loans", () => {
  it("finances the upfront premium into the balance", () => {
    const loan = buildLoan(fhaHouseHack);
    expect(loan.downPayment).toBeCloseTo(13_475, 6);
    expect(loan.baseLoan).toBeCloseTo(371_525, 6);
    // 1.75 percent of the base loan, added on rather than paid at closing.
    expect(loan.upfrontMip).toBeCloseTo(6_501.69, 2);
    expect(loan.loanAmount).toBeCloseTo(378_026.69, 2);
    expect(loan.loanAmount).toBeGreaterThan(loan.baseLoan);
  });

  it("charges MIP for the life of the loan above 90 percent LTV", () => {
    const loan = buildLoan(fhaHouseHack);
    expect(loan.ltvAtOrigination).toBeCloseTo(96.5, 4);
    expect(loan.mortgageInsuranceEndsAtLtv).toBeNull();

    // Still charged even once you owe half of what the place cost.
    expect(mortgageInsuranceActive(loan, 192_500, 385_000)).toBe(true);
    expect(mortgageInsuranceActive(loan, 10_000, 385_000)).toBe(true);
  });

  it("prices the annual premium at 0.55 percent of the balance", () => {
    const loan = buildLoan(fhaHouseHack);
    expect(loan.monthlyMortgageInsurance).toBeCloseTo((378_026.69 * 0.0055) / 12, 2);
  });
});

describe("conventional loans", () => {
  it("drops PMI at 78 percent LTV", () => {
    const loan = buildLoan({
      price: 400_000,
      downPct: 10,
      ratePct: 6.65,
      termYears: 30,
      loanType: "conventional",
    });

    expect(loan.upfrontMip).toBe(0);
    expect(loan.mortgageInsuranceEndsAtLtv).toBe(78);
    expect(mortgageInsuranceActive(loan, 320_000, 400_000)).toBe(true); // 80 percent
    expect(mortgageInsuranceActive(loan, 300_000, 400_000)).toBe(false); // 75 percent
  });

  it("charges no PMI at 20 percent down", () => {
    const loan = buildLoan({
      price: 400_000,
      downPct: 20,
      ratePct: 6.65,
      termYears: 30,
      loanType: "conventional",
    });
    expect(loan.monthlyMortgageInsurance).toBe(0);
    expect(mortgageInsuranceActive(loan, 320_000, 400_000)).toBe(false);
  });

  it("is cheaper to carry than FHA at the same LTV over the long run", () => {
    const conv = buildLoan({ ...fhaHouseHack, loanType: "conventional", downPct: 10 });
    // Conventional stops charging; FHA at 3.5 percent down never does.
    expect(conv.mortgageInsuranceEndsAtLtv).toBe(78);
    expect(buildLoan(fhaHouseHack).mortgageInsuranceEndsAtLtv).toBeNull();
  });
});
