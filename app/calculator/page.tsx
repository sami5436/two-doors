import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { getSubmarket } from "@/lib/data/markets";
import { dealToQuery, parseDeal } from "@/lib/deal-url";
import { analyzeDeal } from "@/lib/finance/deal";
import { money } from "@/lib/format";
import { SITE } from "@/lib/site";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * The whole reason the deal lives in the query string. `opengraph-image.tsx`
 * only ever receives route params, so the shareable preview has to be built
 * here, where searchParams is available, and pointed at the /og route handler.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const deal = parseDeal(params);
  const result = analyzeDeal(deal);
  const sub = getSubmarket(deal.submarket);

  const place = sub ? sub.name : "Texas";
  const isHack = deal.mode === "househack";

  const title = `${money(deal.price)} duplex in ${place}`;
  const description = isHack
    ? `Living in one unit costs ${money(result.effectiveHousingCost)} a month. Break even rent is ${money(result.breakEvenRentPerUnit)} per unit.`
    : `Renting both units cash flows ${money(result.cashFlow)} a month at a ${result.capRatePct.toFixed(2)} percent cap rate.`;

  const og = `/og?${dealToQuery(deal)}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} · ${SITE.name}`,
      description,
      type: "article",
      images: [{ url: og, width: 1200, height: 630, alt: `${title}. ${description}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE.name}`,
      description,
      images: [og],
    },
  };
}

export default async function CalculatorPage({ searchParams }: { searchParams: SearchParams }) {
  const deal = parseDeal(await searchParams);

  return (
    <div>
      <h1 className="font-serif text-3xl leading-tight tracking-[-0.015em]">The calculator</h1>
      <p className="mt-3 max-w-[65ch] leading-[1.65]">
        Every field is seeded from the submarket you pick and every field is yours to change. The
        link in your address bar carries the whole deal, so copying it sends someone these exact
        numbers rather than a blank form.
      </p>
      <div className="mt-10">
        <Calculator initial={deal} />
      </div>
    </div>
  );
}
