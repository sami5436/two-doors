import type { MetroId } from "@/lib/data/markets";
import { propertyTax } from "./tax";
import { buildLoan, type LoanResult, type LoanType } from "./loan";

export type DealMode = "househack" | "rental";

export type DealInputs = {
  mode: DealMode;
  metro: MetroId;
  submarket: string;
  price: number;
  downPct: number;
  ratePct: number;
  loanType: LoanType;
  termYears: number;
  /** Total effective property tax rate, percent. */
  taxRatePct: number;
  /** School district slice of that rate. Drives the homestead exemption. */
  isdRatePct: number;
  insuranceAnnual: number;
  /** Market rent for one unit. */
  rentPerUnit: number;
  /** House hack only: what you pay in rent today, for the comparison. */
  currentRent: number;
  hoaMonthly: number;
  vacancyPct: number;
  maintenancePct: number;
  capexPct: number;
  managementPct: number;
  closingCostPct: number;
};

export type DealResult = {
  loan: LoanResult;
  rentedUnits: number;
  /** Monthly. */
  grossRent: number;
  vacancyLoss: number;
  maintenance: number;
  capex: number;
  management: number;
  variableExpenses: number;
  propertyTaxMonthly: number;
  insuranceMonthly: number;
  /** Everything that does not move with rent. */
  fixedCarry: number;
  piti: number;
  /** House hack: what living there actually costs you per month after the other unit pays. */
  effectiveHousingCost: number;
  /** House hack: monthly difference against your current rent. Positive means you save. */
  savingsVsCurrentRent: number;
  /** Rental: monthly cash flow after everything including debt service. */
  cashFlow: number;
  cashInvested: number;
  closingCosts: number;
  noiAnnual: number;
  capRatePct: number;
  cashOnCashPct: number;
  dscr: number;
  /** Rent per unit at which you break even. */
  breakEvenRentPerUnit: number;
  homesteadSavingsAnnual: number;
  annualTax: number;
};

/**
 * A duplex you occupy half of gets the homestead on your half. A pure rental
 * gets nothing.
 */
function homesteadShare(mode: DealMode): number {
  return mode === "househack" ? 0.5 : 0;
}

export function analyzeDeal(input: DealInputs): DealResult {
  const loan = buildLoan({
    price: input.price,
    downPct: input.downPct,
    ratePct: input.ratePct,
    termYears: input.termYears,
    loanType: input.loanType,
  });

  const tax = propertyTax({
    assessedValue: input.price,
    effectiveRatePct: input.taxRatePct,
    isdRatePct: input.isdRatePct,
    homesteadShare: homesteadShare(input.mode),
  });

  // You rent out one unit when you live in the other, both when you do not.
  const rentedUnits = input.mode === "househack" ? 1 : 2;
  const grossRent = input.rentPerUnit * rentedUnits;

  const vacancyLoss = (grossRent * input.vacancyPct) / 100;
  const maintenance = (grossRent * input.maintenancePct) / 100;
  const capex = (grossRent * input.capexPct) / 100;
  const management = (grossRent * input.managementPct) / 100;
  const variableExpenses = vacancyLoss + maintenance + capex + management;

  const propertyTaxMonthly = tax.monthlyTax;
  const insuranceMonthly = input.insuranceAnnual / 12;

  const fixedCarry =
    loan.monthlyPrincipalInterest +
    loan.monthlyMortgageInsurance +
    propertyTaxMonthly +
    insuranceMonthly +
    input.hoaMonthly;

  const piti = fixedCarry;

  // Both modes reduce to the same identity: fixed carry minus what the rented
  // side nets after its variable costs.
  const netRent = grossRent - variableExpenses;
  const effectiveHousingCost = fixedCarry - netRent;
  const cashFlow = netRent - fixedCarry;

  const closingCosts = (input.price * input.closingCostPct) / 100;
  const cashInvested = loan.downPayment + closingCosts;

  // NOI excludes debt service and mortgage insurance by definition.
  const operatingExpensesAnnual =
    (vacancyLoss + maintenance + capex + management + input.hoaMonthly) * 12 +
    tax.annualTax +
    input.insuranceAnnual;
  const noiAnnual = grossRent * 12 - operatingExpensesAnnual;

  const annualDebtService = (loan.monthlyPrincipalInterest + loan.monthlyMortgageInsurance) * 12;

  const variableRatePct =
    input.vacancyPct + input.maintenancePct + input.capexPct + input.managementPct;
  const retainedShare = 1 - variableRatePct / 100;
  const breakEvenGrossRent = retainedShare > 0 ? fixedCarry / retainedShare : Infinity;

  return {
    loan,
    rentedUnits,
    grossRent,
    vacancyLoss,
    maintenance,
    capex,
    management,
    variableExpenses,
    propertyTaxMonthly,
    insuranceMonthly,
    fixedCarry,
    piti,
    effectiveHousingCost,
    savingsVsCurrentRent: input.currentRent - effectiveHousingCost,
    cashFlow,
    cashInvested,
    closingCosts,
    noiAnnual,
    capRatePct: input.price > 0 ? (noiAnnual / input.price) * 100 : 0,
    cashOnCashPct: cashInvested > 0 ? ((cashFlow * 12) / cashInvested) * 100 : 0,
    dscr: annualDebtService > 0 ? noiAnnual / annualDebtService : 0,
    breakEvenRentPerUnit: Number.isFinite(breakEvenGrossRent)
      ? breakEvenGrossRent / rentedUnits
      : Infinity,
    homesteadSavingsAnnual: tax.annualSavings,
    annualTax: tax.annualTax,
  };
}
