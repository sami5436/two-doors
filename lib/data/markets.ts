import type { SourceKey } from "./sources";

/**
 * A band, not a point. These numbers move every year and vary street to
 * street, so the calculator makes you pick where in the band your deal sits
 * rather than pretending the midpoint is your answer.
 *
 * `estimated` means the figure was interpolated from a published county range
 * rather than read off a published city or district number. It renders with a
 * marker in the tables so you know which is which.
 */
export type Figure = {
  low: number;
  mid: number;
  high: number;
  source: SourceKey;
  estimated?: boolean;
  note?: string;
};

export type MetroId = "dfw" | "hou";

export type SubmarketFlag = "mud" | "flood" | "high-hail";

export type Submarket = {
  slug: string;
  name: string;
  county: string;
  metro: MetroId;
  /** Total of every taxing entity, as a percent of taxable value. */
  effectiveTaxRate: Figure;
  /** Broken out because the homestead exemption only reduces the ISD portion. */
  isdRate: Figure;
  /** Annual premium, owner occupied duplex, roughly $300k dwelling coverage. */
  insuranceAnnual: Figure;
  rent2br: Figure;
  duplexPrice: Figure;
  flags: SubmarketFlag[];
};

export const METROS: Record<MetroId, { id: MetroId; name: string; short: string; blurb: string }> = {
  dfw: {
    id: "dfw",
    name: "Dallas Fort Worth",
    short: "DFW",
    blurb:
      "Higher tax rates than Houston across most of the metro, but no coastal windstorm exposure and no MUD districts to surprise you. Hail is the dominant insurance risk.",
  },
  hou: {
    id: "hou",
    name: "Houston",
    short: "Houston",
    blurb:
      "Cheaper entry prices and deeper duplex stock, offset by higher insurance, flood zones, and MUD districts that can add most of a point to your tax rate.",
  },
};

export const FLAG_LABELS: Record<SubmarketFlag, string> = {
  mud: "MUD district common",
  flood: "Flood zone exposure",
  "high-hail": "High hail frequency",
};

export const SUBMARKETS: Submarket[] = [
  // ---------------------------------------------------------------- DFW ----
  {
    slug: "dallas",
    name: "Dallas",
    county: "Dallas County",
    metro: "dfw",
    effectiveTaxRate: {
      low: 2.0,
      mid: 2.22,
      high: 2.6,
      source: "dallasCountyRates",
      note: "City of Dallas plus DISD plus county is the typical 2.22 combination.",
    },
    isdRate: { low: 0.98, mid: 0.98, high: 0.98, source: "disd", note: "Dallas ISD TY2025 adopted rate, 0.979735." },
    insuranceAnnual: { low: 3800, mid: 4715, high: 6200, source: "insuranceTx" },
    rent2br: { low: 1520, mid: 1957, high: 2900, source: "rentDallas" },
    duplexPrice: { low: 300000, mid: 420000, high: 600000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },
  {
    slug: "garland",
    name: "Garland",
    county: "Dallas County",
    metro: "dfw",
    effectiveTaxRate: { low: 2.05, mid: 2.31, high: 2.55, source: "countyRates", estimated: true },
    isdRate: { low: 1.0, mid: 1.05, high: 1.1, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 3600, mid: 4500, high: 5900, source: "insuranceTx", estimated: true },
    rent2br: { low: 1450, mid: 1750, high: 2100, source: "rentDfw", estimated: true },
    duplexPrice: { low: 260000, mid: 350000, high: 460000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },
  {
    slug: "mesquite",
    name: "Mesquite",
    county: "Dallas County",
    metro: "dfw",
    effectiveTaxRate: { low: 2.1, mid: 2.35, high: 2.6, source: "countyRates", estimated: true },
    isdRate: { low: 1.0, mid: 1.05, high: 1.12, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 3500, mid: 4400, high: 5800, source: "insuranceTx", estimated: true },
    rent2br: { low: 1350, mid: 1650, high: 1980, source: "rentDfw", estimated: true },
    duplexPrice: { low: 240000, mid: 320000, high: 420000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },
  {
    slug: "irving",
    name: "Irving",
    county: "Dallas County",
    metro: "dfw",
    effectiveTaxRate: { low: 2.0, mid: 2.2, high: 2.45, source: "countyRates", estimated: true },
    isdRate: { low: 1.0, mid: 1.05, high: 1.1, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 3600, mid: 4500, high: 5900, source: "insuranceTx", estimated: true },
    rent2br: { low: 1500, mid: 1820, high: 2250, source: "rentDfw", estimated: true },
    duplexPrice: { low: 290000, mid: 385000, high: 500000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },
  {
    slug: "fort-worth",
    name: "Fort Worth",
    county: "Tarrant County",
    metro: "dfw",
    effectiveTaxRate: {
      low: 1.85,
      mid: 2.24,
      high: 2.4,
      source: "countyRates",
      note: "Tarrant County typical combination on a median home near $342k.",
    },
    isdRate: { low: 1.0, mid: 1.05, high: 1.12, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 3600, mid: 4600, high: 6000, source: "insuranceTx", estimated: true },
    rent2br: { low: 1300, mid: 1575, high: 2100, source: "rentDfw" },
    duplexPrice: { low: 250000, mid: 340000, high: 450000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },
  {
    slug: "arlington",
    name: "Arlington",
    county: "Tarrant County",
    metro: "dfw",
    effectiveTaxRate: { low: 1.9, mid: 2.2, high: 2.4, source: "countyRates", estimated: true },
    isdRate: { low: 1.0, mid: 1.06, high: 1.12, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 3600, mid: 4550, high: 5900, source: "insuranceTx", estimated: true },
    rent2br: { low: 1350, mid: 1650, high: 2050, source: "rentDfw", estimated: true },
    duplexPrice: { low: 260000, mid: 350000, high: 460000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },
  {
    slug: "plano",
    name: "Plano",
    county: "Collin County",
    metro: "dfw",
    effectiveTaxRate: {
      low: 1.7,
      mid: 1.71,
      high: 2.3,
      source: "countyRates",
      note: "Collin County runs the lowest combined rates in the metro.",
    },
    isdRate: { low: 1.02, mid: 1.08, high: 1.14, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 3700, mid: 4650, high: 6000, source: "insuranceTx", estimated: true },
    rent2br: { low: 1650, mid: 2050, high: 2600, source: "rentDfw", estimated: true },
    duplexPrice: { low: 400000, mid: 520000, high: 680000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },
  {
    slug: "mckinney",
    name: "McKinney",
    county: "Collin County",
    metro: "dfw",
    effectiveTaxRate: { low: 1.7, mid: 1.85, high: 2.3, source: "countyRates", estimated: true },
    isdRate: { low: 1.02, mid: 1.08, high: 1.14, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 3700, mid: 4600, high: 6000, source: "insuranceTx", estimated: true },
    rent2br: { low: 1550, mid: 1900, high: 2400, source: "rentDfw", estimated: true },
    duplexPrice: { low: 340000, mid: 450000, high: 590000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },
  {
    slug: "denton",
    name: "Denton",
    county: "Denton County",
    metro: "dfw",
    effectiveTaxRate: {
      low: 1.66,
      mid: 1.82,
      high: 1.99,
      source: "countyRates",
      note: "Denton County publishes a 1.66 to 1.99 range across taxing entities.",
    },
    isdRate: { low: 1.0, mid: 1.06, high: 1.12, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 3500, mid: 4450, high: 5800, source: "insuranceTx", estimated: true },
    rent2br: { low: 1300, mid: 1620, high: 2050, source: "rentDfw", estimated: true },
    duplexPrice: { low: 270000, mid: 360000, high: 470000, source: "medianPriceDfw", estimated: true },
    flags: ["high-hail"],
  },

  // ------------------------------------------------------------ Houston ----
  {
    slug: "houston",
    name: "Houston",
    county: "Harris County",
    metro: "hou",
    effectiveTaxRate: {
      low: 1.8,
      mid: 2.1,
      high: 2.4,
      source: "houstonCountyRates",
      note: "No MUD inside the city limits, which is why the inner loop reads lower than Katy.",
    },
    isdRate: {
      low: 0.84,
      mid: 0.88,
      high: 0.88,
      source: "hisd",
      note: "HISD TY2025 at 0.8783. The district adopted 0.8421 for 2026 to 2027.",
    },
    insuranceAnnual: { low: 4400, mid: 5714, high: 7400, source: "insuranceTx" },
    rent2br: { low: 1250, mid: 1640, high: 2300, source: "rentDfw", estimated: true },
    duplexPrice: { low: 230000, mid: 330000, high: 480000, source: "medianPriceHou", estimated: true },
    flags: ["flood"],
  },
  {
    slug: "pasadena",
    name: "Pasadena",
    county: "Harris County",
    metro: "hou",
    effectiveTaxRate: { low: 1.85, mid: 2.15, high: 2.45, source: "countyRates", estimated: true },
    isdRate: { low: 1.0, mid: 1.06, high: 1.12, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 4600, mid: 5900, high: 7600, source: "insuranceTx", estimated: true },
    rent2br: { low: 1150, mid: 1450, high: 1800, source: "rentDfw", estimated: true },
    duplexPrice: { low: 200000, mid: 280000, high: 380000, source: "medianPriceHou", estimated: true },
    flags: ["flood"],
  },
  {
    slug: "spring",
    name: "Spring",
    county: "Harris County",
    metro: "hou",
    effectiveTaxRate: {
      low: 2.1,
      mid: 2.5,
      high: 2.9,
      source: "houstonCountyRates",
      estimated: true,
      note: "Includes a typical MUD levy. Check the specific district before you offer.",
    },
    isdRate: { low: 1.0, mid: 1.06, high: 1.13, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 4300, mid: 5600, high: 7200, source: "insuranceTx", estimated: true },
    rent2br: { low: 1300, mid: 1640, high: 2050, source: "rentDfw", estimated: true },
    duplexPrice: { low: 240000, mid: 330000, high: 440000, source: "medianPriceHou", estimated: true },
    flags: ["mud", "flood"],
  },
  {
    slug: "katy",
    name: "Katy",
    county: "Fort Bend County",
    metro: "hou",
    effectiveTaxRate: {
      low: 1.9,
      mid: 2.5,
      high: 3.0,
      source: "houstonCountyRates",
      estimated: true,
      note: "Fort Bend MUDs push many properties past 2.5 percent combined.",
    },
    isdRate: { low: 1.0, mid: 1.07, high: 1.14, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 4400, mid: 5700, high: 7300, source: "insuranceTx", estimated: true },
    rent2br: { low: 1450, mid: 1800, high: 2300, source: "rentDfw", estimated: true },
    duplexPrice: { low: 280000, mid: 380000, high: 500000, source: "medianPriceHou", estimated: true },
    flags: ["mud", "flood"],
  },
  {
    slug: "sugar-land",
    name: "Sugar Land",
    county: "Fort Bend County",
    metro: "hou",
    effectiveTaxRate: { low: 1.9, mid: 2.35, high: 2.9, source: "houstonCountyRates", estimated: true },
    isdRate: { low: 1.0, mid: 1.07, high: 1.14, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 4400, mid: 5700, high: 7300, source: "insuranceTx", estimated: true },
    rent2br: { low: 1500, mid: 1880, high: 2400, source: "rentDfw", estimated: true },
    duplexPrice: { low: 310000, mid: 420000, high: 550000, source: "medianPriceHou", estimated: true },
    flags: ["mud"],
  },
  {
    slug: "conroe",
    name: "Conroe",
    county: "Montgomery County",
    metro: "hou",
    effectiveTaxRate: { low: 1.85, mid: 2.1, high: 2.4, source: "countyRates", estimated: true },
    isdRate: { low: 1.0, mid: 1.06, high: 1.12, source: "countyRates", estimated: true },
    insuranceAnnual: { low: 4100, mid: 5300, high: 6900, source: "insuranceTx", estimated: true },
    rent2br: { low: 1200, mid: 1520, high: 1900, source: "rentDfw", estimated: true },
    duplexPrice: { low: 220000, mid: 300000, high: 400000, source: "medianPriceHou", estimated: true },
    flags: ["flood"],
  },
];

export function getSubmarket(slug: string): Submarket | undefined {
  return SUBMARKETS.find((s) => s.slug === slug);
}

export function submarketsFor(metro: MetroId): Submarket[] {
  return SUBMARKETS.filter((s) => s.metro === metro);
}

export const DEFAULT_SUBMARKET: Record<MetroId, string> = {
  dfw: "garland",
  hou: "spring",
};
