import type { ReactNode } from "react";

/** A labelled section with the hairline rule under its heading. */
export function Section({
  label,
  title,
  children,
}: {
  label?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      {label ? <p className="label">{label}</p> : null}
      {title ? (
        <h2 className="mt-1 font-serif text-xl leading-tight tracking-[-0.01em]">{title}</h2>
      ) : null}
      {label || title ? <hr className="mt-2 border-0 border-t border-rule" /> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Body copy, held to a readable measure. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[65ch] space-y-4 leading-[1.65]">{children}</div>;
}

/** Label on the left, figure on the right, dotted leader between. */
export function Row({
  label,
  value,
  hint,
  emphasis = false,
}: {
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline gap-2 py-1.5 ${
        emphasis ? "border-t border-ink font-medium" : "border-t border-rule"
      }`}
    >
      <span className="font-mono text-sm">{label}</span>
      <span className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dotted border-rule" />
      <span className={`tnum font-mono text-sm ${emphasis ? "text-ink" : ""}`}>{value}</span>
      {hint ? <span className="label ml-1 normal-case tracking-normal">{hint}</span> : null}
    </div>
  );
}

/** Horizontally scrollable so a wide table never scrolls the page body. */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[44rem] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, numeric = false }: { children: ReactNode; numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={`label border-b border-ink px-2 pb-1.5 font-normal first:pl-0 last:pr-0 ${
        numeric ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  numeric = false,
  muted = false,
}: {
  children: ReactNode;
  numeric?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={`border-b border-rule px-2 py-1.5 align-top font-mono text-sm first:pl-0 last:pr-0 ${
        numeric ? "tnum text-right" : ""
      } ${muted ? "text-muted" : ""}`}
    >
      {children}
    </td>
  );
}

/** Marks a figure that was interpolated rather than published. */
export function Estimated() {
  return (
    <abbr title="Estimated from a published county range, not a published city figure" className="text-accent no-underline">
      {"†"}
    </abbr>
  );
}

export function Footnotes({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 max-w-[65ch] space-y-1.5 border-t border-rule pt-3 text-xs leading-relaxed text-muted">
      {children}
    </div>
  );
}

/** A short aside for the thing that will actually bite you. */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-6 max-w-[65ch] border-l-2 border-accent pl-4">
      <p className="label text-accent">{title}</p>
      <div className="mt-1.5 space-y-2 text-sm leading-relaxed">{children}</div>
    </aside>
  );
}
