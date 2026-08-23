import { ImageResponse } from "next/og";
import { getSubmarket } from "@/lib/data/markets";
import { parseDeal } from "@/lib/deal-url";
import { analyzeDeal } from "@/lib/finance/deal";
import { money, pct, signedMoney } from "@/lib/format";
import { SITE } from "@/lib/site";

export const contentType = "image/png";

/**
 * A route handler rather than the opengraph-image file convention, because
 * only a handler can read the query string that carries the deal.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deal = parseDeal(Object.fromEntries(searchParams.entries()));
  const r = analyzeDeal(deal);
  const sub = getSubmarket(deal.submarket);
  const isHack = deal.mode === "househack";

  const ink = "#111111";
  const muted = "#6b6b6b";
  const rule = "#d8d5d0";

  const lines: [string, string][] = [
    ["Purchase price", money(deal.price)],
    ["Down payment", `${money((deal.price * deal.downPct) / 100)}  ·  ${pct(deal.downPct, 1)}`],
    ["Rate", `${pct(deal.ratePct, 2)}  ${deal.loanType === "fha" ? "FHA" : "Conventional"}`],
    ["Property tax", pct(deal.taxRatePct, 2)],
    ["Insurance, annual", money(deal.insuranceAnnual)],
    [`Rent, ${r.rentedUnits} unit${r.rentedUnits > 1 ? "s" : ""}`, money(r.grossRent)],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: ink,
          display: "flex",
          flexDirection: "column",
          padding: "56px 72px",
          justifyContent: "space-between",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: `2px solid ${ink}`,
            paddingBottom: 14,
          }}
        >
          <div style={{ fontSize: 34, letterSpacing: -0.5 }}>{SITE.name}</div>
          <div style={{ fontSize: 18, color: muted, letterSpacing: 2 }}>
            {(sub ? `${sub.name.toUpperCase()}, ${sub.county.toUpperCase()}` : "TEXAS")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 22 }}>
          {lines.map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 25,
                padding: "7px 0",
                borderBottom: `1px solid ${rule}`,
                color: muted,
              }}
            >
              <div>{label}</div>
              <div style={{ color: ink }}>{value}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `2px solid ${ink}`,
            paddingTop: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 19, color: muted, letterSpacing: 2 }}>
              {isHack ? "COST TO LIVE THERE" : "MONTHLY CASH FLOW"}
            </div>
            {/* Satori needs an explicit display on any node with more than one child. */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                fontSize: 66,
                marginTop: 6,
                letterSpacing: -2,
              }}
            >
              <span>{isHack ? money(r.effectiveHousingCost) : signedMoney(r.cashFlow)}</span>
              <span style={{ fontSize: 26, color: muted }}>/mo</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 19, color: muted, letterSpacing: 2 }}>BREAK EVEN RENT</div>
            <div style={{ fontSize: 34, marginTop: 8 }}>{money(r.breakEvenRentPerUnit)}</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
