import {
  DEFAULT_SUBMARKET,
  getSubmarket,
  type MetroId,
  type Submarket,
} from "@/lib/data/markets";
import { RATES } from "@/lib/data/texas";
import type { DealInputs, DealMode } from "@/lib/finance/deal";
import type { LoanType } from "@/lib/finance/loan";

/**
 * Short keys, because the whole point is that the link stays readable when
 * you paste it into a message.
 */
const KEYS = {
  mode: "m",
  metro: "x",
  submarket: "s",
  price: "p",
  downPct: "d",
  ratePct: "r",
  loanType: "l",
  termYears: "n",
  taxRatePct: "t",
  isdRatePct: "i",
  insuranceAnnual: "ins",
  rentPerUnit: "rent",
  currentRent: "cur",
  hoaMonthly: "hoa",
  vacancyPct: "vac",
  maintenancePct: "mnt",
  capexPct: "cap",
  managementPct: "mgt",
  closingCostPct: "cc",
} as const satisfies Record<keyof DealInputs, string>;

export const DEFAULT_METRO: MetroId = "dfw";

/** Sensible starting point for someone who has not told us anything yet. */
export function defaultsFor(
  metro: MetroId,
  submarketSlug: string,
  mode: DealMode = "househack",
): DealInputs {
  const sub: Submarket =
    getSubmarket(submarketSlug) ?? getSubmarket(DEFAULT_SUBMARKET[metro])!;

  const loanType: LoanType = mode === "househack" ? "fha" : "conventional";

  return {
    mode,
    metro: sub.metro,
    submarket: sub.slug,
    price: sub.duplexPrice.mid,
    downPct: mode === "househack" ? 3.5 : 25,
    ratePct: mode === "househack" ? RATES.fha30.mid : RATES.investor30.mid,
    loanType,
    termYears: 30,
    taxRatePct: sub.effectiveTaxRate.mid,
    isdRatePct: sub.isdRate.mid,
    insuranceAnnual: sub.insuranceAnnual.mid,
    rentPerUnit: sub.rent2br.mid,
    currentRent: 1_800,
    hoaMonthly: 0,
    vacancyPct: 8,
    maintenancePct: 5,
    capexPct: 5,
    managementPct: 0,
    closingCostPct: 3,
  };
}

function num(raw: string | undefined, fallback: number): number {
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

type RawParams = Record<string, string | string[] | undefined>;

function one(params: RawParams, key: string): string | undefined {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Rebuilds a deal from a query string. Anything absent falls back to the
 * submarket default, so a short link still opens a complete deal.
 */
export function parseDeal(params: RawParams): DealInputs {
  const rawMode = one(params, KEYS.mode);
  const mode: DealMode = rawMode === "rent" || rawMode === "rental" ? "rental" : "househack";

  const rawMetro = one(params, KEYS.metro);
  const metro: MetroId = rawMetro === "hou" ? "hou" : rawMetro === "dfw" ? "dfw" : DEFAULT_METRO;

  const slug = one(params, KEYS.submarket) ?? DEFAULT_SUBMARKET[metro];
  const base = defaultsFor(metro, slug, mode);

  const rawLoan = one(params, KEYS.loanType);
  const loanType: LoanType =
    rawLoan === "fha" ? "fha" : rawLoan === "conv" || rawLoan === "conventional"
      ? "conventional"
      : base.loanType;

  return {
    ...base,
    loanType,
    price: num(one(params, KEYS.price), base.price),
    downPct: num(one(params, KEYS.downPct), base.downPct),
    ratePct: num(one(params, KEYS.ratePct), base.ratePct),
    termYears: num(one(params, KEYS.termYears), base.termYears),
    taxRatePct: num(one(params, KEYS.taxRatePct), base.taxRatePct),
    isdRatePct: num(one(params, KEYS.isdRatePct), base.isdRatePct),
    insuranceAnnual: num(one(params, KEYS.insuranceAnnual), base.insuranceAnnual),
    rentPerUnit: num(one(params, KEYS.rentPerUnit), base.rentPerUnit),
    currentRent: num(one(params, KEYS.currentRent), base.currentRent),
    hoaMonthly: num(one(params, KEYS.hoaMonthly), base.hoaMonthly),
    vacancyPct: num(one(params, KEYS.vacancyPct), base.vacancyPct),
    maintenancePct: num(one(params, KEYS.maintenancePct), base.maintenancePct),
    capexPct: num(one(params, KEYS.capexPct), base.capexPct),
    managementPct: num(one(params, KEYS.managementPct), base.managementPct),
    closingCostPct: num(one(params, KEYS.closingCostPct), base.closingCostPct),
  };
}

/**
 * Only what differs from the submarket defaults ends up in the URL, which
 * keeps a shared link short enough to read.
 */
export function dealToQuery(deal: DealInputs): string {
  const base = defaultsFor(deal.metro, deal.submarket, deal.mode);
  const q = new URLSearchParams();

  q.set(KEYS.mode, deal.mode === "rental" ? "rent" : "hh");
  q.set(KEYS.metro, deal.metro);
  q.set(KEYS.submarket, deal.submarket);
  if (deal.loanType !== base.loanType) {
    q.set(KEYS.loanType, deal.loanType === "conventional" ? "conv" : "fha");
  }

  const numeric: [string, number, number][] = [
    [KEYS.price, deal.price, base.price],
    [KEYS.downPct, deal.downPct, base.downPct],
    [KEYS.ratePct, deal.ratePct, base.ratePct],
    [KEYS.termYears, deal.termYears, base.termYears],
    [KEYS.taxRatePct, deal.taxRatePct, base.taxRatePct],
    [KEYS.isdRatePct, deal.isdRatePct, base.isdRatePct],
    [KEYS.insuranceAnnual, deal.insuranceAnnual, base.insuranceAnnual],
    [KEYS.rentPerUnit, deal.rentPerUnit, base.rentPerUnit],
    [KEYS.currentRent, deal.currentRent, base.currentRent],
    [KEYS.hoaMonthly, deal.hoaMonthly, base.hoaMonthly],
    [KEYS.vacancyPct, deal.vacancyPct, base.vacancyPct],
    [KEYS.maintenancePct, deal.maintenancePct, base.maintenancePct],
    [KEYS.capexPct, deal.capexPct, base.capexPct],
    [KEYS.managementPct, deal.managementPct, base.managementPct],
    [KEYS.closingCostPct, deal.closingCostPct, base.closingCostPct],
  ];

  for (const [key, value, fallback] of numeric) {
    if (value !== fallback) q.set(key, String(value));
  }

  return q.toString();
}
