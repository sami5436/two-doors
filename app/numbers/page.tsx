import type { Metadata } from "next";
import { METROS, SUBMARKETS, FLAG_LABELS, type Figure, type MetroId } from "@/lib/data/markets";
import { SOURCES } from "@/lib/data/sources";
import { FHA, FHA_TWO_UNIT_LIMIT, RATES, TEXAS, WIND_HAIL_DEDUCTIBLE_PCT } from "@/lib/data/texas";
import { Callout, Estimated, Footnotes, Prose, Section, TableWrap, Td, Th } from "@/components/memo";
import { band, money, pct } from "@/lib/format";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Numbers",
  description:
    "Property tax rates, insurance, rents, and loan limits for fifteen submarkets across Dallas Fort Worth and Houston, each with its source and date.",
};

function Cell({ figure, fmt }: { figure: Figure; fmt: (n: number) => string }) {
  return (
    <>
      <span className="whitespace-nowrap">
        {fmt(figure.mid)}
        {figure.estimated ? <Estimated /> : null}
      </span>
      <span className="block text-xs whitespace-nowrap text-muted">
        {band(figure.low, figure.high, fmt)}
      </span>
    </>
  );
}

function MetroTable({ metro }: { metro: MetroId }) {
  const rows = SUBMARKETS.filter((s) => s.metro === metro);
  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Submarket</Th>
          <Th numeric>Tax rate</Th>
          <Th numeric>ISD rate</Th>
          <Th numeric>Insurance</Th>
          <Th numeric>Rent, 2br</Th>
          <Th numeric>Duplex price</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((s) => (
          <tr key={s.slug}>
            <Td>
              {s.name}
              <span className="block text-xs text-muted">{s.county}</span>
              {s.flags.filter((f) => f !== "high-hail").length > 0 ? (
                <span className="block text-xs text-accent">
                  {s.flags
                    .filter((f) => f !== "high-hail")
                    .map((f) => FLAG_LABELS[f])
                    .join(", ")}
                </span>
              ) : null}
            </Td>
            <Td numeric>
              <Cell figure={s.effectiveTaxRate} fmt={(n) => pct(n, 2)} />
            </Td>
            <Td numeric>
              <Cell figure={s.isdRate} fmt={(n) => pct(n, 2)} />
            </Td>
            <Td numeric>
              <Cell figure={s.insuranceAnnual} fmt={money} />
            </Td>
            <Td numeric>
              <Cell figure={s.rent2br} fmt={money} />
            </Td>
            <Td numeric>
              <Cell figure={s.duplexPrice} fmt={money} />
            </Td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

export default function NumbersPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl leading-tight tracking-[-0.015em]">The numbers</h1>
      <div className="mt-4">
        <Prose>
          <p>
            Everything the calculator runs on, in one place, with a source and a date on each
            figure. All of it is a snapshot from {SITE.asOf}. Rates get adopted every autumn,
            insurance reprices every renewal, and rents move every quarter, so treat this as a
            starting point and verify anything you plan to act on.
          </p>
          <p>
            Figures are bands rather than single numbers because the spread inside a single county
            is wider than the difference between the two metros. A {"†"} marks a figure
            interpolated from a published county range rather than read off a published city or
            district number.
          </p>
        </Prose>
      </div>

      <Section label="Dallas Fort Worth" title={METROS.dfw.name}>
        <Prose>
          <p className="text-sm text-muted">{METROS.dfw.blurb}</p>
        </Prose>
        <div className="mt-4">
          <MetroTable metro="dfw" />
        </div>
      </Section>

      <Section label="Houston" title={METROS.hou.name}>
        <Prose>
          <p className="text-sm text-muted">{METROS.hou.blurb}</p>
        </Prose>
        <div className="mt-4">
          <MetroTable metro="hou" />
        </div>
        <Callout title="The MUD problem">
          <p>
            A Municipal Utility District is a separate taxing entity that funds water and sewer in
            areas the city never annexed. It layers on top of county, city, and school rates and
            typically adds 50 to 80 basis points, which is enough to turn a deal that pencils in
            Houston proper into one that does not in Katy or Spring.
          </p>
          <p>
            MUD rates are not uniform and they are not on the listing. Look the address up on the
            county appraisal district site and read the full list of taxing entities before you
            write an offer.
          </p>
        </Callout>
      </Section>

      <Section label="Financing" title="Rates and loan limits">
        <TableWrap>
          <thead>
            <tr>
              <Th>Item</Th>
              <Th numeric>Figure</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Conventional, 30 year fixed</Td>
              <Td numeric>{band(RATES.conventional30.low, RATES.conventional30.high, (n) => pct(n, 2))}</Td>
              <Td muted>Freddie Mac survey average</Td>
            </tr>
            <tr>
              <Td>FHA, 30 year fixed</Td>
              <Td numeric>{band(RATES.fha30.low, RATES.fha30.high, (n) => pct(n, 2))}</Td>
              <Td muted>Higher coupon, far lower down payment</Td>
            </tr>
            <tr>
              <Td>Investment property</Td>
              <Td numeric>{band(RATES.investor30.low, RATES.investor30.high, (n) => pct(n, 2))}</Td>
              <Td muted>Roughly 0.5 to 1.0 over a primary residence</Td>
            </tr>
            <tr>
              <Td>FHA two unit limit, {FHA_TWO_UNIT_LIMIT.dfw.county}</Td>
              <Td numeric>{money(FHA_TWO_UNIT_LIMIT.dfw.limit)}</Td>
              <Td muted>High cost area</Td>
            </tr>
            <tr>
              <Td>FHA two unit limit, {FHA_TWO_UNIT_LIMIT.hou.county}</Td>
              <Td numeric>{money(FHA_TWO_UNIT_LIMIT.hou.limit)}</Td>
              <Td muted>High cost area</Td>
            </tr>
            <tr>
              <Td>FHA minimum down, two unit</Td>
              <Td numeric>{pct(FHA.minDownPct, 1)}</Td>
              <Td muted>Owner occupied, 580 or better</Td>
            </tr>
            <tr>
              <Td>FHA upfront premium</Td>
              <Td numeric>{pct(FHA.upfrontMipPct, 2)}</Td>
              <Td muted>Financed into the balance, not paid at closing</Td>
            </tr>
            <tr>
              <Td>FHA annual premium</Td>
              <Td numeric>{pct(FHA.annualMipPct, 2)}</Td>
              <Td muted>For the life of the loan above 90 percent LTV</Td>
            </tr>
            <tr>
              <Td>Rent credited toward qualifying</Td>
              <Td numeric>{pct(FHA.rentalIncomeCreditPct, 0)}</Td>
              <Td muted>Of appraised market rent</Td>
            </tr>
          </tbody>
        </TableWrap>

        <Callout title="The self sufficiency test does not apply to you">
          <p>
            FHA requires that 75 percent of market rent cover the entire payment on three and four
            unit properties. It is a hard test and it kills most of those deals. It does not apply
            to a duplex. Two unit properties are exempt, which is a large part of why the duplex is
            the realistic entry point rather than the fourplex.
          </p>
        </Callout>
      </Section>

      <Section label="Statewide" title="Texas mechanics">
        <TableWrap>
          <thead>
            <tr>
              <Th>Item</Th>
              <Th numeric>Figure</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>School district homestead exemption</Td>
              <Td numeric>{money(TEXAS.homesteadIsdExemption.value)}</Td>
              <Td muted>Raised from $100k by Prop 13, November 2025</Td>
            </tr>
            <tr>
              <Td>Appraisal cap, with homestead</Td>
              <Td numeric>{pct(TEXAS.appraisalCapPct.value, 0)}</Td>
              <Td muted>Per year, on assessed value</Td>
            </tr>
            <tr>
              <Td>Wind and hail deductible</Td>
              <Td numeric>
                {band(WIND_HAIL_DEDUCTIBLE_PCT.low, WIND_HAIL_DEDUCTIBLE_PCT.high, (n) => pct(n, 0))}
              </Td>
              <Td muted>Of dwelling coverage, separate from the standard deductible</Td>
            </tr>
            <tr>
              <Td>Security deposit return</Td>
              <Td numeric>{TEXAS.securityDepositReturnDays.value} days</Td>
              <Td muted>Penalty is three times the amount wrongfully withheld</Td>
            </tr>
            <tr>
              <Td>Notice to vacate, nonpayment</Td>
              <Td numeric>{TEXAS.noticeToVacateDaysDefault.value} days</Td>
              <Td muted>Unless the lease sets something longer</Td>
            </tr>
            <tr>
              <Td>Owner occupancy commitment</Td>
              <Td numeric>{TEXAS.ownerOccupancyMonths} months</Td>
              <Td muted>FHA, on a house hack</Td>
            </tr>
          </tbody>
        </TableWrap>
      </Section>

      <Section label="Provenance" title="Sources">
        <div className="max-w-[65ch] space-y-1.5 text-sm">
          {Object.entries(SOURCES).map(([key, s]) => (
            <p key={key} className="flex flex-wrap items-baseline gap-x-2">
              <a href={s.url} target="_blank" rel="noreferrer noopener">
                {s.label}
              </a>
              <span className="label">{s.asOf}</span>
            </p>
          ))}
        </div>
        <Footnotes>
          <p>
            {"†"} Interpolated from a published county range rather than a published city or
            district figure. Treat these as a plausible starting band, not as fact.
          </p>
          <p>
            Duplex prices are the weakest numbers here. No public source breaks out two unit sale
            prices by submarket, so these are anchored to metro median sale prices and adjusted for
            local price level. Pull real comps before you rely on them.
          </p>
        </Footnotes>
      </Section>
    </div>
  );
}
