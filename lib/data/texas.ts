import type { SourceKey } from "./sources";

type Fact = { value: number; source: SourceKey; note?: string };

/** Statewide mechanics. These are the same wherever you buy in Texas. */
export const TEXAS = {
  /**
   * Prop 13 (SB 4), approved by voters November 2025, raised the school
   * district homestead exemption from $100k to $140k effective 2026.
   * It reduces the ISD portion of your bill only.
   */
  homesteadIsdExemption: { value: 140_000, source: "prop13" } satisfies Fact,
  seniorAdditionalExemption: { value: 60_000, source: "prop13" } satisfies Fact,

  /** Assessed value cannot rise more than this per year with an active homestead. */
  appraisalCapPct: { value: 10, source: "homestead" } satisfies Fact,

  /** Deadlines that actually cost you money if you miss them. */
  homesteadFilingDeadline: "April 30",
  protestDeadline: "May 15",
  noticeOfValueMailed: "on or about April 1",

  /** FHA owner occupancy commitment on a house hack. */
  ownerOccupancyMonths: 12,

  /** Things Texas does not have, which matter more than people expect. */
  hasStateIncomeTax: false,
  hasRentControl: false,
  hasSecurityDepositCap: false,

  /** Texas Property Code timelines. */
  securityDepositReturnDays: { value: 30, source: "deposits" } satisfies Fact,
  securityDepositPenaltyMultiple: { value: 3, source: "deposits" } satisfies Fact,
  noticeToVacateDaysDefault: { value: 3, source: "eviction" } satisfies Fact,
  noticeToVacateDaysMonthToMonth: { value: 30, source: "eviction" } satisfies Fact,
} as const;

/** Rates move weekly. These are seeds for the calculator, not gospel. */
export const RATES = {
  conventional30: { low: 6.59, mid: 6.65, high: 6.75, source: "pmms" as SourceKey },
  fha30: { low: 7.1, mid: 7.3, high: 7.5, source: "pmms" as SourceKey },
  investor30: { low: 7.3, mid: 7.55, high: 7.8, source: "investorRates" as SourceKey },
} as const;

/** FHA two unit limits. A duplex is a two unit property. */
export const FHA_TWO_UNIT_LIMIT: Record<string, { county: string; limit: number }> = {
  dfw: { county: "Dallas County", limit: 721_500 },
  hou: { county: "Harris County", limit: 693_050 },
};

export const FHA = {
  /** Financed into the loan balance rather than paid at closing. */
  upfrontMipPct: 1.75,
  /** Annual, above 95 percent LTV on a 30 year term. */
  annualMipPct: 0.55,
  minDownPct: 3.5,
  /**
   * The self sufficiency test applies to 3 and 4 unit properties only.
   * A duplex is exempt. This is widely misreported.
   */
  selfSufficiencyAppliesToDuplex: false,
  /** Share of appraised market rent a lender will credit toward qualifying. */
  rentalIncomeCreditPct: 75,
  source: "fhaLimits" as SourceKey,
};

/**
 * Wind and hail carry a separate percentage deductible in Texas, so a claim
 * costs far more out of pocket than the usual flat deductible. Budgeted as a
 * reserve rather than a monthly expense.
 */
export const WIND_HAIL_DEDUCTIBLE_PCT = { low: 1, mid: 2, high: 5, source: "insuranceTx" as SourceKey };
