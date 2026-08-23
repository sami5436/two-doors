import type { Metadata } from "next";
import Link from "next/link";
import { Callout, Prose, Row, Section } from "@/components/memo";
import { FHA, TEXAS } from "@/lib/data/texas";
import { money, pct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "How Texas property tax, the homestead exemption, the appraisal protest calendar, and the landlord side of the Property Code actually work.",
};

export default function RulesPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl leading-tight tracking-[-0.015em]">The rules</h1>
      <div className="mt-4">
        <Prose>
          <p>
            The mechanics that make Texas different from wherever you read your last real estate
            article. Most of this is not optional knowledge. Two of these items have deadlines that
            cost real money if you miss them, and one of them decides whether a deal pencils at all.
          </p>
        </Prose>
      </div>

      <Section label="Tax" title="The homestead exemption">
        <Prose>
          <p>
            Texas has no state income tax, and it pays for that with some of the highest property
            tax rates in the country. A combined rate of 2 to 2.5 percent of value is normal. On a{" "}
            {money(385_000)} duplex that is most of a thousand dollars a month before you have paid
            a cent of principal.
          </p>
          <p>
            The homestead exemption is the main relief valve. In November 2025 voters approved
            Proposition 13, which raised the school district exemption from {money(100_000)} to{" "}
            {money(TEXAS.homesteadIsdExemption.value)} effective 2026. It is the single largest
            lever available to you, and it only exists if you live in the property.
          </p>
          <p>
            The detail that matters and that most calculators get wrong: the exemption reduces the{" "}
            <em>school district</em> portion of your bill and nothing else. Your county, city,
            hospital district, and community college lines are untouched. So the saving is not the
            exemption times your full rate. It is the exemption times your ISD rate alone, which
            usually lands somewhere near {money(1_400)} to {money(1_600)} a year.
          </p>
          <p>
            On a duplex you occupy half of, the appraisal district grants the homestead against your
            half. The exemption is therefore capped by the value of that half, which only bites on
            cheaper properties. Below roughly {money(280_000)} you stop getting the full amount.
          </p>
        </Prose>
      </Section>

      <Section label="Tax" title="The ten percent cap">
        <Prose>
          <p>
            With an active homestead, the assessed value the district can tax cannot rise more than{" "}
            {pct(TEXAS.appraisalCapPct.value, 0)} in a year, no matter what the market does. Without
            one there is no cap at all. In a market that appreciates faster than ten percent, this
            quietly becomes worth more than the exemption itself, and it compounds every year you
            hold.
          </p>
          <p>
            This is the strongest structural argument for house hacking a duplex rather than buying
            a pure rental as your first property. It is not the down payment, though that helps. It
            is that the homestead buys you a cap that a pure rental never gets.
          </p>
        </Prose>

        <Callout title="Your first year will surprise you">
          <p>
            The cap protects the value, not the price. When a property sells, the district
            reassesses it to market, which usually means your purchase price. If the seller held it
            for fifteen years under a compounding cap, their tax bill has almost nothing to do with
            yours.
          </p>
          <p>
            Never underwrite off the current owner tax bill or the number on the listing. Run your
            own purchase price through the rate. The calculator does this by default.
          </p>
        </Callout>
      </Section>

      <Section label="Calendar" title="Two deadlines">
        <div className="max-w-[65ch]">
          <Row label="File your homestead exemption" value={TEXAS.homesteadFilingDeadline} />
          <Row label="Notice of appraised value arrives" value="around April 1" />
          <Row label="File your protest" value={TEXAS.protestDeadline} emphasis />
        </div>
        <div className="mt-4">
          <Prose>
            <p>
              Filing the homestead is free, takes about ten minutes on the county appraisal district
              site, and you only do it once. Do it the year you close.
            </p>
            <p>
              The protest deadline is {TEXAS.protestDeadline}, or thirty days after your notice of
              appraised value was mailed, whichever falls later. Residential notices go out{" "}
              {TEXAS.noticeOfValueMailed}, so in practice {TEXAS.protestDeadline} is the date that
              controls unless your notice arrives late.
            </p>
            <p>
              Protest every year. It is close to free, the districts expect it, and the informal
              hearing usually settles without you ever seeing the review board. Skipping it is
              leaving money on the table annually rather than once.
            </p>
          </Prose>
        </div>
      </Section>

      <Section label="Financing" title="What owner occupancy buys you">
        <Prose>
          <p>
            FHA will finance a two unit property at {pct(FHA.minDownPct, 1)} down if you live in one
            of the units, against 20 to 25 percent for an investment property. On a{" "}
            {money(385_000)} duplex that is the difference between roughly {money(13_500)} and{" "}
            {money(96_000)} of down payment. It is the entire reason the first property is usually a
            house hack.
          </p>
          <p>
            A lender will credit {pct(FHA.rentalIncomeCreditPct, 0)} of the appraised market rent on
            the unit you do not occupy toward your qualifying income, which is what lets the deal
            clear debt to income when your salary alone would not.
          </p>
          <p>
            You commit to living there {TEXAS.ownerOccupancyMonths} months. After that you can move
            out, keep the loan, and rent both sides.
          </p>
        </Prose>

        <Callout title="The self sufficiency test does not apply to a duplex">
          <p>
            You will read that FHA requires 75 percent of market rent to cover the entire payment.
            That is the self sufficiency test and it is real, but it applies to three and four unit
            properties only. Two unit properties are exempt.
          </p>
          <p>
            This is worth knowing precisely because it is so widely misreported. It is also most of
            the reason the duplex is the realistic entry point and the fourplex is not, since almost
            no fourplex passes that test at current rates.
          </p>
        </Callout>

        <Prose>
          <p>
            The cost of the low down payment is mortgage insurance. FHA charges{" "}
            {pct(FHA.upfrontMipPct, 2)} upfront, financed into the balance rather than paid at
            closing, plus {pct(FHA.annualMipPct, 2)} a year. Above 90 percent loan to value at
            origination that annual premium runs for the life of the loan. It does not fall off the
            way conventional PMI does at 78 percent. Refinancing is the only exit, so treat it as
            permanent when you underwrite.
          </p>
        </Prose>
      </Section>

      <Section label="Insurance" title="Wind, hail, and water">
        <Prose>
          <p>
            Texas homeowners insurance runs well above the national average, and hail is the single
            largest claim driver in the state by a wide margin. Budget it as a real line item rather
            than rounding it into a percentage of value.
          </p>
          <p>
            The part that catches people is the deductible. Wind and hail carry a separate
            percentage deductible, typically 1 to 5 percent of dwelling coverage rather than a flat
            amount. On a policy with {money(300_000)} of coverage a two percent wind and hail
            deductible is {money(6_000)} out of pocket before the carrier pays anything. Hold that
            as a reserve, not as a monthly expense.
          </p>
          <p>
            In Houston, add flood. Flood is not covered by a standard policy and the flood maps have
            not kept up with where water actually goes. Check the address, not just the zone.
          </p>
        </Prose>
      </Section>

      <Section label="Tenants" title="The landlord side">
        <Prose>
          <p>
            Texas is a straightforward state to be a landlord in, which cuts both ways. There is no
            rent control and no statutory cap on what you can charge for a security deposit. There
            is also very little that protects you from your own sloppiness, because the deposit rules
            have teeth.
          </p>
        </Prose>
        <div className="mt-4 max-w-[65ch]">
          <Row
            label="Return the deposit with an itemized list"
            value={`${TEXAS.securityDepositReturnDays.value} days`}
          />
          <Row
            label="Penalty for wrongful withholding"
            value={`${TEXAS.securityDepositPenaltyMultiple.value}x plus fees`}
          />
          <Row
            label="Notice to vacate, nonpayment"
            value={`${TEXAS.noticeToVacateDaysDefault.value} days`}
          />
          <Row
            label="Notice to end a month to month"
            value={`${TEXAS.noticeToVacateDaysMonthToMonth.value} days`}
          />
        </div>
        <div className="mt-4">
          <Prose>
            <p>
              Section 92.103 of the Property Code gives you thirty days from the day the tenant
              surrenders the property to return whatever is left of the deposit with an itemized
              list of deductions. Section 92.109 lets a tenant sue for three times the amount
              wrongfully withheld plus fees. Keep receipts and photographs and send the itemization
              even when you are returning the whole thing.
            </p>
            <p>
              Eviction starts with a written notice to vacate. Three days is the statutory default
              for nonpayment unless your lease sets something longer, and thirty days ends a month
              to month tenancy without cause. Filing before the notice period runs out gets the case
              dismissed and you start over, so the shortcut costs you weeks.
            </p>
          </Prose>
        </div>
      </Section>

      <Section label="Houston" title="MUD districts">
        <Prose>
          <p>
            A Municipal Utility District is a separate taxing entity that funds water and sewer
            infrastructure in areas the city never annexed. It sits on top of your county, city, and
            school rates and typically adds 50 to 80 basis points, sometimes more in newer
            districts still paying off their bonds.
          </p>
          <p>
            That is enough to move a deal from working to not working. It is also not on the listing
            and the agent may not mention it. Look the address up on the county appraisal district
            site and read the full list of taxing entities before you write an offer. MUD rates
            generally decline as the bonds amortize, so an older district is usually cheaper than a
            new one.
          </p>
        </Prose>
      </Section>

      <div className="mt-12 border-t border-rule pt-4">
        <p className="text-sm">
          Numbers behind all of this are on <Link href="/numbers">the numbers page</Link>. To run
          your own, use <Link href="/calculator">the calculator</Link>.
        </p>
      </div>
    </div>
  );
}
