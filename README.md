# Two Doors

Underwriting duplexes in Dallas and Houston.

A working set of numbers for buying a two unit property in Texas and living in half of it. Built to
answer one question: whether a part time landlord starting with a single duplex is better off in
Dallas Fort Worth or in Houston, and whether either works at current rates.

## What is in here

| Route | What it does |
| --- | --- |
| `/` | The same $350,000 duplex modelled in both metros, computed at build time |
| `/calculator` | House hack or pure rental, either metro, with the deal encoded in the URL |
| `/numbers` | Every tax rate, insurance figure, rent band and loan limit, with a source and a date |
| `/rules` | Homestead exemption, the ten percent cap, the protest calendar, the Property Code |
| `/playbook` | The first twelve months in the order the steps happen |

## Running it

```bash
npm install
npm run dev
npm test          # vitest, the finance engine
npm run build
```

## How it is put together

**`lib/finance/`** is pure functions with no React and no I/O, which is why the math can be tested
on its own. `mortgage.ts` amortizes, `loan.ts` handles FHA and conventional mortgage insurance,
`tax.ts` does the Texas property tax, `deal.ts` combines them, `stress.ts` runs the downside cases.

Three things it gets right that generic calculators do not:

- The homestead exemption reduces the **school district portion only**, and on a duplex it is capped
  by the value of the half you occupy. The saving is the exemption times the ISD rate, not the full
  rate.
- FHA mortgage insurance above 90 percent LTV at origination **never falls off**. Conventional PMI
  stops at 78 percent. Over a long hold that is the whole comparison.
- The ten percent appraisal cap **only exists with an active homestead**, so a pure rental takes the
  full appraisal every year.

**`lib/data/`** holds the market dataset. Every figure carries a source key and every source carries
its own date. Figures are bands rather than point estimates, and anything interpolated from a county
range rather than read off a published city number is flagged `estimated` so the tables can mark it.

**`lib/deal-url.ts`** encodes a deal into short query keys, writing only what differs from the
submarket defaults so a shared link stays readable. A partial link still opens a complete deal.

## The link preview

Sharing a filled out deal is the point, so the OpenGraph image renders the actual numbers.

Next.js `opengraph-image.tsx` receives route `params` only, never `searchParams`, so the file
convention cannot see a deal held in the query string. Instead `app/og/route.tsx` is a route handler
that reads `searchParams` itself, and `app/calculator/page.tsx` exports `generateMetadata`, which
**does** receive `searchParams`, pointing `openGraph.images` at that handler.

Set `NEXT_PUBLIC_SITE_URL` in production so `metadataBase` resolves absolute image URLs. On Vercel it
falls back to `VERCEL_PROJECT_PRODUCTION_URL` automatically.

> Vercel Deployment Protection is enabled by default and blocks the iMessage link scraper, which
> produces a bare link with no preview. Rich previews need a production deployment with protection
> off.

## Keeping it current

The dataset is a snapshot. Rates get adopted every autumn, insurance reprices at renewal, rents move
quarterly. Update `lib/data/markets.ts` and the `asOf` dates in `lib/data/sources.ts` about once a
year. Duplex prices are the weakest figures in there, since no public source breaks out two unit sale
prices by submarket.

Nothing here is advice. Verify anything you plan to act on with the county appraisal district, a
lender, and an insurance agent.
