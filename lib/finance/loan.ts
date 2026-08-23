import { FHA } from "@/lib/data/texas";
import { monthlyPayment } from "./mortgage";

export type LoanType = "fha" | "conventional";

export type LoanInput = {
  price: number;
  downPct: number;
  ratePct: number;
  termYears: number;
  loanType: LoanType;
  /** Conventional only. Ignored for FHA, which uses the statutory MIP rate. */
  pmiRatePct?: number;
};

export type LoanResult = {
  downPayment: number;
  baseLoan: number;
  /** FHA finances the upfront premium into the balance rather than charging it at closing. */
  upfrontMip: number;
  loanAmount: number;
  ltvAtOrigination: number;
  monthlyPrincipalInterest: number;
  monthlyMortgageInsurance: number;
  /**
   * FHA at more than 90 percent LTV carries mortgage insurance for the life of
   * the loan. Conventional PMI comes off at 78 percent. On a low down payment
   * house hack held a long time this is the difference between the two.
   */
  mortgageInsuranceEndsAtLtv: number | null;
};

const CONVENTIONAL_PMI_CANCELS_AT_LTV = 78;

export function buildLoan(input: LoanInput): LoanResult {
  const { price, downPct, ratePct, termYears, loanType } = input;

  const downPayment = (price * downPct) / 100;
  const baseLoan = Math.max(price - downPayment, 0);
  const ltvAtOrigination = price > 0 ? (baseLoan / price) * 100 : 0;

  const upfrontMip = loanType === "fha" ? (baseLoan * FHA.upfrontMipPct) / 100 : 0;
  const loanAmount = baseLoan + upfrontMip;

  const monthlyPrincipalInterest = monthlyPayment(loanAmount, ratePct, termYears);

  let monthlyMortgageInsurance = 0;
  let mortgageInsuranceEndsAtLtv: number | null = null;

  if (loanType === "fha") {
    monthlyMortgageInsurance = (loanAmount * FHA.annualMipPct) / 100 / 12;
    // Above 90 percent LTV at origination, FHA MIP never falls off.
    mortgageInsuranceEndsAtLtv = ltvAtOrigination > 90 ? null : CONVENTIONAL_PMI_CANCELS_AT_LTV;
  } else if (ltvAtOrigination > 80) {
    const pmiRate = input.pmiRatePct ?? 0.55;
    monthlyMortgageInsurance = (loanAmount * pmiRate) / 100 / 12;
    mortgageInsuranceEndsAtLtv = CONVENTIONAL_PMI_CANCELS_AT_LTV;
  }

  return {
    downPayment,
    baseLoan,
    upfrontMip,
    loanAmount,
    ltvAtOrigination,
    monthlyPrincipalInterest,
    monthlyMortgageInsurance,
    mortgageInsuranceEndsAtLtv,
  };
}

/** Whether mortgage insurance is still being charged at a given remaining balance. */
export function mortgageInsuranceActive(
  loan: LoanResult,
  currentBalance: number,
  originalPrice: number,
): boolean {
  if (loan.monthlyMortgageInsurance <= 0) return false;
  if (loan.mortgageInsuranceEndsAtLtv === null) return true;

  const ltv = originalPrice > 0 ? (currentBalance / originalPrice) * 100 : 0;
  return ltv > loan.mortgageInsuranceEndsAtLtv;
}

/** What a lender will credit toward qualifying income from the other unit. */
export function qualifyingRentalCredit(marketRentMonthly: number): number {
  return (marketRentMonthly * FHA.rentalIncomeCreditPct) / 100;
}
