"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { METROS, submarketsFor, type MetroId } from "@/lib/data/markets";
import { FHA_TWO_UNIT_LIMIT } from "@/lib/data/texas";
import { analyzeDeal, type DealInputs, type DealMode } from "@/lib/finance/deal";
import { monthsOfRunway, project, stressCases } from "@/lib/finance/stress";
import { dealToQuery, defaultsFor } from "@/lib/deal-url";
import { money, months, pct, ratio, signedMoney } from "@/lib/format";
import { Callout, Row, Section, TableWrap, Td, Th } from "@/components/memo";

function Toggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap border border-rule">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`flex-1 px-3 py-2 font-mono text-xs tracking-wide whitespace-nowrap ${
            value === o.value
              ? "bg-ink text-paper"
              : "bg-paper text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="flex items-baseline gap-2 border-t border-rule py-2">
      <span className="font-mono text-sm">{label}</span>
      <span className="min-w-3 flex-1 translate-y-[-0.2em] border-b border-dotted border-rule" />
      {prefix ? <span className="font-mono text-xs text-muted">{prefix}</span> : null}
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        className="tnum w-24 px-1.5 py-0.5 text-right text-sm"
      />
      {suffix ? <span className="w-6 font-mono text-xs text-muted">{suffix}</span> : null}
      {hint ? <span className="sr-only">{hint}</span> : null}
    </label>
  );
}

export function Calculator({ initial }: { initial: DealInputs }) {
  const [deal, setDeal] = useState<DealInputs>(initial);
  const [copied, setCopied] = useState(false);

  // Native history so typing a number does not round trip to the server.
  useEffect(() => {
    const query = dealToQuery(deal);
    window.history.replaceState(null, "", `${window.location.pathname}?${query}`);
  }, [deal]);

  const set = useCallback(
    <K extends keyof DealInputs>(key: K, value: DealInputs[K]) =>
      setDeal((d) => ({ ...d, [key]: value })),
    [],
  );

  /** Switching mode or submarket re-seeds the numbers that depend on it. */
  const reseed = useCallback((patch: { mode?: DealMode; metro?: MetroId; submarket?: string }) => {
    setDeal((d) => {
      const mode = patch.mode ?? d.mode;
      const metro = patch.metro ?? d.metro;
      const submarket =
        patch.submarket ?? (patch.metro ? submarketsFor(patch.metro)[0].slug : d.submarket);
      return defaultsFor(metro, submarket, mode);
    });
  }, []);

  const r = useMemo(() => analyzeDeal(deal), [deal]);
  const stress = useMemo(() => stressCases(deal), [deal]);
  const rows = useMemo(
    () => project(deal, 5, { rentGrowthPct: 3, marketGrowthPct: 6 }),
    [deal],
  );
  const runway = useMemo(() => monthsOfRunway(deal, 20_000), [deal]);

  const isHack = deal.mode === "househack";
  const headline = isHack ? r.effectiveHousingCost : r.cashFlow;
  const fhaLimit = FHA_TWO_UNIT_LIMIT[deal.metro];
  const overFhaLimit = deal.loanType === "fha" && r.loan.baseLoan > fhaLimit.limit;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          value={deal.mode}
          onChange={(mode) => reseed({ mode })}
          options={[
            { value: "househack", label: "Live in one unit" },
            { value: "rental", label: "Rent both units" },
          ]}
        />
        <Toggle
          value={deal.metro}
          onChange={(metro) => reseed({ metro })}
          options={[
            { value: "dfw", label: METROS.dfw.short },
            { value: "hou", label: METROS.hou.short },
          ]}
        />
      </div>

      <label className="mt-3 flex items-center gap-3">
        <span className="label">Submarket</span>
        <select
          value={deal.submarket}
          onChange={(e) => reseed({ submarket: e.target.value })}
          className="flex-1 px-2 py-1.5 text-sm"
        >
          {submarketsFor(deal.metro).map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}, {s.county}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {/* ------------------------------------------------ assumptions -- */}
        <div>
          <p className="label">Assumptions</p>
          <hr className="mt-2 border-0 border-t border-rule" />
          <div className="mt-2">
            <Field label="Purchase price" value={deal.price} onChange={(v) => set("price", v)} prefix="$" step={5000} />
            <Field label="Down payment" value={deal.downPct} onChange={(v) => set("downPct", v)} suffix="%" step={0.5} />
            <Field label="Interest rate" value={deal.ratePct} onChange={(v) => set("ratePct", v)} suffix="%" step={0.05} />
            <Field label="Term" value={deal.termYears} onChange={(v) => set("termYears", v)} suffix="yr" step={5} />
            <label className="flex items-baseline gap-2 border-t border-rule py-2">
              <span className="font-mono text-sm">Loan type</span>
              <span className="min-w-3 flex-1 translate-y-[-0.2em] border-b border-dotted border-rule" />
              <select
                value={deal.loanType}
                onChange={(e) => set("loanType", e.target.value as DealInputs["loanType"])}
                className="w-24 px-1.5 py-0.5 text-right text-sm"
              >
                <option value="fha">FHA</option>
                <option value="conventional">Conv</option>
              </select>
              <span className="w-6" />
            </label>
            <Field label="Rent per unit" value={deal.rentPerUnit} onChange={(v) => set("rentPerUnit", v)} prefix="$" step={25} />
            {isHack ? (
              <Field label="Your rent today" value={deal.currentRent} onChange={(v) => set("currentRent", v)} prefix="$" step={50} />
            ) : null}
          </div>

          <p className="label mt-8">Carrying costs</p>
          <hr className="mt-2 border-0 border-t border-rule" />
          <div className="mt-2">
            <Field label="Property tax rate" value={deal.taxRatePct} onChange={(v) => set("taxRatePct", v)} suffix="%" step={0.05} />
            <Field label="of which school" value={deal.isdRatePct} onChange={(v) => set("isdRatePct", v)} suffix="%" step={0.01} />
            <Field label="Insurance, annual" value={deal.insuranceAnnual} onChange={(v) => set("insuranceAnnual", v)} prefix="$" step={100} />
            <Field label="HOA, monthly" value={deal.hoaMonthly} onChange={(v) => set("hoaMonthly", v)} prefix="$" step={25} />
            <Field label="Vacancy" value={deal.vacancyPct} onChange={(v) => set("vacancyPct", v)} suffix="%" step={1} />
            <Field label="Maintenance" value={deal.maintenancePct} onChange={(v) => set("maintenancePct", v)} suffix="%" step={1} />
            <Field label="Capital reserve" value={deal.capexPct} onChange={(v) => set("capexPct", v)} suffix="%" step={1} />
            <Field label="Management" value={deal.managementPct} onChange={(v) => set("managementPct", v)} suffix="%" step={1} />
            <Field label="Closing costs" value={deal.closingCostPct} onChange={(v) => set("closingCostPct", v)} suffix="%" step={0.5} />
          </div>
        </div>

        {/* ---------------------------------------------------- result -- */}
        <div>
          <p className="label">{isHack ? "Cost to live there" : "Monthly cash flow"}</p>
          <hr className="mt-2 border-0 border-t border-rule" />

          <p className="tnum mt-4 font-mono text-4xl leading-none tracking-tight">
            {isHack ? money(headline) : signedMoney(headline)}
            <span className="ml-2 font-mono text-sm text-muted">/mo</span>
          </p>

          {isHack ? (
            <p className="mt-2 text-sm text-muted">
              {r.savingsVsCurrentRent >= 0
                ? `${money(r.savingsVsCurrentRent)} a month less than the ${money(deal.currentRent)} you pay now.`
                : `${money(-r.savingsVsCurrentRent)} a month more than the ${money(deal.currentRent)} you pay now.`}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">
              After every expense including debt service and reserves.
            </p>
          )}

          <div className="mt-8">
            <p className="label">Monthly breakdown</p>
            <div className="mt-2">
              <Row label="Principal and interest" value={money(r.loan.monthlyPrincipalInterest)} />
              <Row
                label={deal.loanType === "fha" ? "Mortgage insurance" : "PMI"}
                value={money(r.loan.monthlyMortgageInsurance)}
              />
              <Row label="Property tax" value={money(r.propertyTaxMonthly)} />
              <Row label="Insurance" value={money(r.insuranceMonthly)} />
              {deal.hoaMonthly > 0 ? <Row label="HOA" value={money(deal.hoaMonthly)} /> : null}
              <Row label="Fixed carry" value={money(r.fixedCarry)} emphasis />
              <Row
                label={`Rent, ${r.rentedUnits} unit${r.rentedUnits > 1 ? "s" : ""}`}
                value={signedMoney(r.grossRent)}
              />
              <Row label="Vacancy and reserves" value={signedMoney(-r.variableExpenses)} />
              <Row
                label={isHack ? "You pay" : "Cash flow"}
                value={isHack ? money(headline) : signedMoney(headline)}
                emphasis
              />
            </div>
          </div>

          <div className="mt-8">
            <p className="label">At a glance</p>
            <div className="mt-2">
              <Row label="Cash to close" value={money(r.cashInvested)} />
              <Row label="Loan amount" value={money(r.loan.loanAmount)} />
              <Row label="Break even rent, per unit" value={money(r.breakEvenRentPerUnit)} />
              {/* Cap rate, cash on cash, and DSCR all measure a property against
                  its full rent. Half of this one is your home, so on a house
                  hack they describe something you are not doing. */}
              {isHack ? (
                <>
                  <Row
                    label="Versus renting today"
                    value={`${signedMoney(r.savingsVsCurrentRent)}/mo`}
                  />
                  <Row label="Homestead saves" value={`${money(r.homesteadSavingsAnnual)}/yr`} />
                  <Row label="Runway on $20k reserve" value={months(runway)} />
                </>
              ) : (
                <>
                  <Row label="Cap rate" value={pct(r.capRatePct)} />
                  <Row label="Cash on cash" value={pct(r.cashOnCashPct)} />
                  <Row label="DSCR" value={ratio(r.dscr)} />
                  <Row label="Runway on $20k reserve" value={months(runway)} />
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="label mt-6 w-full border border-rule py-2 hover:border-accent hover:text-accent"
          >
            {copied ? "Link copied" : "Copy link to this deal"}
          </button>
        </div>
      </div>

      {overFhaLimit ? (
        <Callout title="Over the FHA limit">
          <p>
            A {pct(deal.downPct, 1)} down loan on {money(deal.price)} comes to{" "}
            {money(r.loan.baseLoan)}, above the {money(fhaLimit.limit)} FHA two unit ceiling in{" "}
            {fhaLimit.county}. Either put more down or price lower.
          </p>
        </Callout>
      ) : null}

      {deal.loanType === "fha" && r.loan.mortgageInsuranceEndsAtLtv === null ? (
        <Callout title="This mortgage insurance never comes off">
          <p>
            At {pct(r.loan.ltvAtOrigination, 1)} LTV the FHA premium runs for the life of the loan.
            That is {money(r.loan.monthlyMortgageInsurance)} a month forever unless you refinance.
            Conventional PMI at 20 percent down would be zero, and at 10 percent down it would stop
            once you owe 78 percent of the price.
          </p>
        </Callout>
      ) : null}

      <Section label="Downside" title="What breaks it">
        <TableWrap>
          <thead>
            <tr>
              <Th>Scenario</Th>
              <Th numeric>{isHack ? "You pay" : "Cash flow"}</Th>
              <Th numeric>Change</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>As entered</Td>
              <Td numeric>{isHack ? money(headline) : signedMoney(headline)}</Td>
              <Td numeric muted>{""}</Td>
            </tr>
            {stress.map((c) => (
              <tr key={c.label}>
                <Td>{c.label}</Td>
                <Td numeric>{isHack ? money(c.resultMonthly) : signedMoney(c.resultMonthly)}</Td>
                <Td numeric muted>{signedMoney(c.monthlyDelta)}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Section>

      <Section label="Five years" title="If you hold it">
        <TableWrap>
          <thead>
            <tr>
              <Th>Year</Th>
              <Th numeric>Assessed</Th>
              <Th numeric>Tax</Th>
              <Th numeric>Rent</Th>
              <Th numeric>{isHack ? "You pay" : "Cash flow"}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year}>
                <Td>{row.year}</Td>
                <Td numeric>{money(row.assessedValue)}</Td>
                <Td numeric>{money(row.annualTax)}</Td>
                <Td numeric>{money(row.grossRent)}</Td>
                <Td numeric>
                  {isHack ? money(row.effectiveHousingCost) : signedMoney(row.cashFlow)}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <p className="mt-3 max-w-[65ch] text-xs text-muted">
          Assumes 3 percent rent growth and 6 percent market appreciation, with the loan payment
          fixed. {isHack
            ? "The homestead cap holds your assessed value to 10 percent a year."
            : "With no homestead there is no cap, so the assessed value tracks the market in full."}
        </p>
      </Section>
    </div>
  );
}
