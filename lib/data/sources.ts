/**
 * Every figure on this site points at one of these. Nothing gets rendered
 * without a source and a date, because all of it goes stale.
 */
export const SOURCES = {
  pmms: {
    label: "Freddie Mac Primary Mortgage Market Survey",
    url: "https://www.freddiemac.com/pmms",
    asOf: "2026-08-20",
  },
  fhaLimits: {
    label: "JVM Lending, Texas FHA loan limits 2026",
    url: "https://www.jvmlending.com/blog/texas-fha-loan-limits/",
    asOf: "2026-01-01",
  },
  fhaSelfSufficiency: {
    label: "Mortgage Research, FHA self sufficiency test",
    url: "https://www.mortgageresearch.com/articles/fha-self-sufficiency-test/",
    asOf: "2026-01-01",
  },
  investorRates: {
    label: "Bankrate, investment property rates",
    url: "https://www.bankrate.com/mortgages/investment-property-rates/",
    asOf: "2026-08-20",
  },
  prop13: {
    label: "Ownwell, Texas property tax relief 2026",
    url: "https://www.ownwell.com/blog/texas-property-tax-relief-2026",
    asOf: "2026-01-01",
  },
  homestead: {
    label: "Texas homestead exemption guide, $140k and the 10% cap",
    url: "https://protestingpropertytaxes.com/texas-homestead-exemption-guide/",
    asOf: "2026-01-01",
  },
  protestDeadlines: {
    label: "PropertyTaxes.Law, Texas protest deadlines",
    url: "https://www.propertytaxes.law/texas-property-tax-deadlines/",
    asOf: "2026-01-01",
  },
  countyRates: {
    label: "TaxDrop, Texas property tax rates by county 2026",
    url: "https://www.taxdrop.com/blog/texas-property-tax-rates-by-county-2026",
    asOf: "2026-01-01",
  },
  dallasCountyRates: {
    label: "Dallas County property tax rate by taxing entity",
    url: "https://www.ballardpropertytaxprotest.com/post/dallas-county-property-tax-rate",
    asOf: "2025-10-01",
  },
  houstonCountyRates: {
    label: "A-List Properties, property tax rates in Houston by county",
    url: "https://www.texassellmyhouse.com/blog/what-are-the-property-tax-rates-in-houston-by-county/",
    asOf: "2026-01-01",
  },
  disd: {
    label: "Dallas County, notice of adopted tax rate",
    url: "https://www.dallascounty.org/about-us/hot-links/notice-of-final-vote.php",
    asOf: "2025-09-01",
  },
  hisd: {
    label: "Houston Chronicle, HISD budget and tax rate",
    url: "https://www.houstonchronicle.com/news/houston-texas/education/hisd/article/budget-2026-2027-22317443.php",
    asOf: "2026-06-01",
  },
  insuranceTx: {
    label: "Insure.com, average homeowners insurance in Texas",
    url: "https://www.insure.com/home-insurance/average-cost-of-homeowners-insurance-in-texas/",
    asOf: "2026-01-01",
  },
  rentDallas: {
    label: "RentCafe, average rent Dallas",
    url: "https://www.rentcafe.com/average-rent-market-trends/us/tx/dallas/",
    asOf: "2026-07-01",
  },
  rentDfw: {
    label: "Flat Fee Landlord, DFW rent report by ZIP",
    url: "https://flatfeelandlord.com/rent-data/dallas-fort-worth",
    asOf: "2026-01-01",
  },
  medianPriceDfw: {
    label: "Homes.com, Dallas Fort Worth housing market report",
    url: "https://www.homes.com/reports/dallas-fort-worth-housing-market/",
    asOf: "2026-06-01",
  },
  medianPriceHou: {
    label: "Redfin, Houston housing market",
    url: "https://www.redfin.com/city/8903/TX/Houston/housing-market",
    asOf: "2026-07-01",
  },
  deposits: {
    label: "Texas State Law Library, security deposits",
    url: "https://guides.sll.texas.gov/landlord-tenant-law/security-deposits",
    asOf: "2026-01-01",
  },
  eviction: {
    label: "iPropertyManagement, Texas eviction process 2026",
    url: "https://ipropertymanagement.com/laws/texas-eviction-process",
    asOf: "2026-01-01",
  },
} as const;

export type SourceKey = keyof typeof SOURCES;
