import Link from "next/link";
import { getSubmarket } from "@/lib/data/markets";
import { defaultsFor } from "@/lib/deal-url";
import { analyzeDeal } from "@/lib/finance/deal";
import { money, pct } from "@/lib/format";
import { Prose, Section, TableWrap, Td, Th } from "@/components/memo";
import { SITE } from "@/lib/site";

/** The same deal in both metros, which is the comparison worth making. */
const COMPARISON_PRICE = 350_000;

/** Bisection: what would this submarket have to cost to match a target monthly figure. */
function priceMatching(metro: "dfw" | "hou", slug: string, targetMonthly: number): number {
  const base = defaultsFor(metro, slug, "househack");
  let lo = 50_000;
  let hi = COMPARISON_PRICE;

  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    const cost = analyzeDeal({ ...base, price: mid }).effectiveHousingCost;
    if (cost > targetMonthly) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

function compare(metro: "dfw" | "hou", slug: string) {
  const base = defaultsFor(metro, slug, "househack");
  const deal = { ...base, price: COMPARISON_PRICE };
  return { sub: getSubmarket(slug)!, deal, result: analyzeDeal(deal) };
}

export default function Home() {
  const sides = [compare("dfw", "garland"), compare("hou", "spring")];
  const [dfw] = sides;
  // What Spring would have to cost to carry like Garland at the comparison price.
  const houBreakEvenPrice = priceMatching("hou", "spring", dfw.result.effectiveHousingCost);
  const requiredDiscount = COMPARISON_PRICE - houBreakEvenPrice;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-serif text-3xl leading-tight tracking-[-0.015em]">
          Underwriting duplexes in Dallas and Houston
        </h1>
      </div>

      <div className="mt-5">
        <Prose>
          <p>
            A working set of numbers for buying a two unit property in Texas and living in half of
            it. Built for one specific decision: whether a part time landlord starting with one
            duplex is better off in Dallas Fort Worth or in Houston, and whether either of them
            works at all at current rates.
          </p>
          <p>
            There is no course here and nothing to sign up for. Just the tax mechanics, real
            figures with dates on them, and a calculator that is willing to tell you a deal is bad.
          </p>
        </Prose>
      </div>

      <Section label="The comparison" title={`The same ${money(COMPARISON_PRICE)} duplex, both metros`}>
        <TableWrap>
          <thead>
            <tr>
              <Th>Line</Th>
              {sides.map((s) => (
                <Th key={s.sub.slug} numeric>
                  {s.sub.name}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>County</Td>
              {sides.map((s) => (
                <Td key={s.sub.slug} numeric muted>
                  {s.sub.county}
                </Td>
              ))}
            </tr>
            <tr>
              <Td>Effective tax rate</Td>
              {sides.map((s) => (
                <Td key={s.sub.slug} numeric>
                  {pct(s.deal.taxRatePct)}
                </Td>
              ))}
            </tr>
            <tr>
              <Td>Property tax, annual</Td>
              {sides.map((s) => (
                <Td key={s.sub.slug} numeric>
                  {money(s.result.annualTax)}
                </Td>
              ))}
            </tr>
            <tr>
              <Td>Insurance, annual</Td>
              {sides.map((s) => (
                <Td key={s.sub.slug} numeric>
                  {money(s.deal.insuranceAnnual)}
                </Td>
              ))}
            </tr>
            <tr>
              <Td>Market rent, one unit</Td>
              {sides.map((s) => (
                <Td key={s.sub.slug} numeric>
                  {money(s.deal.rentPerUnit)}
                </Td>
              ))}
            </tr>
            <tr>
              <Td>Fixed carry, monthly</Td>
              {sides.map((s) => (
                <Td key={s.sub.slug} numeric>
                  {money(s.result.fixedCarry)}
                </Td>
              ))}
            </tr>
            <tr>
              <Td>Cost to live there</Td>
              {sides.map((s) => (
                <Td key={s.sub.slug} numeric>
                  <strong>{money(s.result.effectiveHousingCost)}</strong>
                  <span className="block text-xs text-muted">per month</span>
                </Td>
              ))}
            </tr>
            <tr>
              <Td>Break even rent, per unit</Td>
              {sides.map((s) => (
                <Td key={s.sub.slug} numeric>
                  {money(s.result.breakEvenRentPerUnit)}
                </Td>
              ))}
            </tr>
          </tbody>
        </TableWrap>

        <div className="mt-5">
          <Prose>
            <p className="text-sm text-muted">
              FHA at 3.5 percent down, {pct(sides[0].deal.ratePct)} for 30 years, living in one unit
              and renting the other, with 8 percent vacancy and 10 percent held back for maintenance
              and capital. Both figures assume the homestead exemption on your half. Change any of
              it in <Link href="/calculator">the calculator</Link>.
            </p>
          </Prose>
        </div>
      </Section>

      <Section label="What this says" title="The short version">
        <Prose>
          <p>
            Held at the same price, Dallas Fort Worth wins on every line above. Spring carries a MUD
            levy that pushes its tax rate past Garland, its insurance runs higher, and its rents are
            lower. That is the opposite of the usual story about Houston being the cheap market.
          </p>
          <p>
            The catch is that fixing the price is exactly what hides Houston&rsquo;s advantage. You
            would not pay {money(COMPARISON_PRICE)} in Spring for what {money(COMPARISON_PRICE)}{" "}
            buys in Garland. Houston entry prices run lower, so the real question is whether the
            discount on the way in covers the higher carry every month afterward. Solving for it,
            Spring has to come in at {money(houBreakEvenPrice)} to carry the same as Garland at{" "}
            {money(COMPARISON_PRICE)}, so the discount has to be about {money(requiredDiscount)}{" "}
            before Houston is genuinely the cheaper option.
          </p>
          <p>
            Which means the metro is the wrong unit of analysis. The tax rate on one specific
            address, and whether it sits inside a MUD, moves the answer more than the choice between
            the two cities.
          </p>
          <p>
            The uncomfortable part is that at a {pct(sides[0].deal.ratePct)} FHA coupon, a duplex at
            this price does not carry itself in either place. It still beats renting in most cases,
            because the other unit covers a large share of a payment you were making anyway and you
            keep the principal. But it is a housing cost decision, not an income one, and anybody
            telling you otherwise is selling something.
          </p>
        </Prose>
      </Section>

      <Section label="Start here" title="The rest of it">
        <div className="max-w-[65ch] space-y-3 text-sm">
          <p>
            <Link href="/calculator">The calculator</Link> runs a specific deal in either mode and
            encodes it in the link, so you can send someone the actual numbers.
          </p>
          <p>
            <Link href="/numbers">The numbers</Link> lists every tax rate, insurance estimate, rent
            band, and loan limit behind it, with a source and a date on each one.
          </p>
          <p>
            <Link href="/rules">The rules</Link> covers the homestead exemption, the ten percent
            appraisal cap, the protest calendar, and the landlord side of the Property Code.
          </p>
          <p>
            <Link href="/playbook">The playbook</Link> is the first twelve months in order, with the
            two deadlines that cost money if you miss them.
          </p>
        </div>
        <p className="label mt-8">All figures {SITE.asOf}</p>
      </Section>
    </div>
  );
}
