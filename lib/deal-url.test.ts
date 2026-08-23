import { describe, expect, it } from "vitest";
import { dealToQuery, defaultsFor, parseDeal } from "./deal-url";

describe("deal URL round trip", () => {
  it("restores a deal exactly from its own query string", () => {
    const deal = {
      ...defaultsFor("hou", "spring", "househack"),
      price: 412_000,
      downPct: 5,
      rentPerUnit: 1_725,
      currentRent: 2_100,
      insuranceAnnual: 6_200,
    };

    const restored = parseDeal(Object.fromEntries(new URLSearchParams(dealToQuery(deal))));
    expect(restored).toEqual(deal);
  });

  it("round trips a rental deal too", () => {
    const deal = { ...defaultsFor("dfw", "plano", "rental"), price: 520_000, vacancyPct: 12 };
    const restored = parseDeal(Object.fromEntries(new URLSearchParams(dealToQuery(deal))));
    expect(restored).toEqual(deal);
  });

  it("keeps the link short by omitting anything left at its default", () => {
    const deal = defaultsFor("dfw", "garland", "househack");
    const q = dealToQuery(deal);
    // Only the three identity keys survive.
    expect(q).toBe("m=hh&x=dfw&s=garland");
  });

  it("opens a complete deal from a partial link", () => {
    const restored = parseDeal({ s: "katy", x: "hou", p: "350000" });
    expect(restored.submarket).toBe("katy");
    expect(restored.price).toBe(350_000);
    // Everything unspecified comes from the submarket dataset.
    expect(restored.taxRatePct).toBe(defaultsFor("hou", "katy").taxRatePct);
  });

  it("falls back rather than throwing on junk input", () => {
    const restored = parseDeal({ s: "atlantis", x: "nyc", p: "not-a-number", m: "???" });
    expect(restored.mode).toBe("househack");
    expect(restored.metro).toBe("dfw");
    expect(Number.isFinite(restored.price)).toBe(true);
    expect(restored.price).toBeGreaterThan(0);
  });

  it("switches the financing default with the mode", () => {
    expect(defaultsFor("dfw", "garland", "househack").loanType).toBe("fha");
    expect(defaultsFor("dfw", "garland", "househack").downPct).toBe(3.5);
    expect(defaultsFor("dfw", "garland", "rental").loanType).toBe("conventional");
    expect(defaultsFor("dfw", "garland", "rental").downPct).toBe(25);
  });
});
