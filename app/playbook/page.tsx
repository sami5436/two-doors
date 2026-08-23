import type { Metadata } from "next";
import Link from "next/link";
import { Callout, Prose, Section } from "@/components/memo";
import { FHA, TEXAS } from "@/lib/data/texas";
import { money, pct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Playbook",
  description:
    "The first twelve months of buying a Texas duplex and living in half of it, in the order the steps actually happen.",
};

function Step({
  n,
  title,
  when,
  children,
}: {
  n: number;
  title: string;
  when: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 border-t border-rule pt-4 first:mt-0">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-mono text-sm text-accent">{String(n).padStart(2, "0")}</span>
        <h3 className="font-serif text-lg leading-tight">{title}</h3>
        <span className="label ml-auto">{when}</span>
      </div>
      <div className="mt-3">
        <Prose>{children}</Prose>
      </div>
    </div>
  );
}

export default function PlaybookPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl leading-tight tracking-[-0.015em]">The playbook</h1>
      <div className="mt-4">
        <Prose>
          <p>
            One path, in order, for buying a duplex in Texas and living in half of it while the
            other half pays down the loan. This assumes a W2 income, no prior property, and the
            realistic goal of doing it part time without quitting anything.
          </p>
          <p>
            The order matters more than it looks. Two of these steps have hard deadlines and one of
            them has to happen before you look at a single listing.
          </p>
        </Prose>
      </div>

      <Section label="Before you look" title="Months one and two">
        <Step n={1} title="Find out what you can actually borrow" when="Week 1">
          <p>
            Get a pre approval before you get attached to a property, not after. You need a lender
            who has actually closed FHA loans on two unit properties, which is a smaller group than
            it sounds. Ask them directly how many two unit FHA files they closed last year.
          </p>
          <p>
            The number that matters is not the purchase price they quote you. It is the monthly
            payment they will underwrite you to, because that is what constrains the deal. Ask them
            to run it both with and without the rental income credit so you can see how much of your
            approval depends on the other unit.
          </p>
        </Step>

        <Step n={2} title="Confirm the rental income credit" when="Week 1">
          <p>
            A lender will credit {pct(FHA.rentalIncomeCreditPct, 0)} of appraised market rent on the
            unit you will not occupy toward your qualifying income. Confirm your lender does this and
            what documentation they want, since it is often the difference between qualifying and not.
          </p>
          <p>
            Ask explicitly whether the self sufficiency test applies. It does not, because it covers
            three and four unit properties only, but a loan officer who tells you otherwise on a
            duplex is telling you they have not done this before. That is useful information early.
          </p>
        </Step>

        <Step n={3} title="Pick one submarket and learn it" when="Weeks 2 to 6">
          <p>
            You cannot underwrite a market you do not know. Pick one, not three. The comparison
            between DFW and Houston is worth doing once on paper, and then you commit, because the
            value is in recognising a mispriced listing and that only comes from volume.
          </p>
          <p>
            Look at forty listings before you offer on one. Track the ones that sell and what they
            sold for. Two months of this makes the difference between guessing at rent and knowing it.
          </p>
        </Step>
      </Section>

      <Section label="Underwriting" title="Every property">
        <Step n={4} title="Pull the real tax rate" when="Before every offer">
          <p>
            Look the address up on the county appraisal district site and read the full list of
            taxing entities. In Houston this is where you find out whether there is a MUD, which can
            add most of a point. Do not use the current owner tax bill. If they have held it under
            the ten percent cap for years, their number has nothing to do with yours.
          </p>
        </Step>

        <Step n={5} title="Get a real insurance quote" when="Before every offer">
          <p>
            Not an estimate, a quote, with the wind and hail deductible written on it. Roof age
            drives this more than anything else and a twenty year old roof can double the premium or
            make the property uninsurable at a normal price. In Houston get the flood answer at the
            same time.
          </p>
        </Step>

        <Step n={6} title="Set rent from comps, not from hope" when="Before every offer">
          <p>
            Find three actually rented units nearby of similar size and condition. Listed rent is an
            asking price and asking prices are optimistic. If the numbers only work at the top of the
            range you found, the numbers do not work.
          </p>
          <p>
            Run it through <Link href="/calculator">the calculator</Link> at the low end of the band
            and see whether you still want it.
          </p>
        </Step>
      </Section>

      <Section label="Closing" title="And the year after">
        <Step n={7} title="Inspect for the expensive things" when="Under contract">
          <p>
            On a duplex you are buying two of everything. Two water heaters, often two HVAC systems,
            two kitchens. Foundation, roof, plumbing, and electrical panel are what actually cost
            money. Cosmetics are a negotiating lever, not a reason to walk.
          </p>
          <p>
            Ask whether the units are separately metered. If they are not, you are paying utilities
            for a tenant, which quietly changes the monthly maths.
          </p>
        </Step>

        <Step n={8} title="File the homestead exemption" when={TEXAS.homesteadFilingDeadline}>
          <p>
            Free, roughly ten minutes on the appraisal district site, and you only do it once. It
            takes {money(TEXAS.homesteadIsdExemption.value)} off the school district portion of your
            taxable value and, just as importantly, it turns on the{" "}
            {pct(TEXAS.appraisalCapPct.value, 0)} annual cap on assessed value.
          </p>
          <p>
            The cap is worth more than the exemption over a long hold. Do not skip this because the
            first year saving looks modest.
          </p>
        </Step>

        <Step n={9} title="Protest your appraisal" when={TEXAS.protestDeadline}>
          <p>
            Every year, without exception. Your notice of value arrives {TEXAS.noticeOfValueMailed}{" "}
            and you have until {TEXAS.protestDeadline}, or thirty days from the notice if that falls
            later. Most protests settle informally without a hearing.
          </p>
          <p>
            The year after you buy is the one that matters most, because the district has just
            reassessed the property to your purchase price and any deferred maintenance you found in
            the inspection is evidence.
          </p>
        </Step>

        <Step n={10} title="Live there twelve months" when="Year one">
          <p>
            The FHA occupancy commitment is {TEXAS.ownerOccupancyMonths} months. After that you can
            move out, keep the loan and its rate, and rent both sides. Note that moving out ends the
            homestead, which means the exemption and the ten percent cap both stop. Model that before
            you decide, because on a property that has appreciated it can cost more than the extra
            rent brings in.
          </p>
        </Step>
      </Section>

      <Callout title="What would make me walk away">
        <p>
          A deal that only works at the top of the rent band, with no vacancy allowance, and no
          capital reserve. Those three assumptions are where optimism hides. If the property needs
          all three to go your way, it is not a deal, it is a bet.
        </p>
        <p>
          At current rates a lot of Texas duplexes do not pencil, and the honest answer for those is
          to keep renting and keep looking. The calculator is built to tell you that rather than
          talk you into something.
        </p>
      </Callout>

      <div className="mt-12 border-t border-rule pt-4">
        <p className="text-sm">
          Mechanics behind the deadlines are on <Link href="/rules">the rules page</Link>.
        </p>
      </div>
    </div>
  );
}
