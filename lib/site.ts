export const SITE = {
  name: "Two Doors",
  /** Shown in the iMessage preview under the title. No dashes, by house rule. */
  description:
    "Underwriting duplexes in Dallas and Houston. Real Texas tax, insurance, and rent numbers, updated August 2026.",
  /** Stamped in the footer and on every data table. */
  asOf: "August 2026",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
} as const;

export const NAV = [
  { href: "/calculator", label: "Calculator" },
  { href: "/numbers", label: "Numbers" },
  { href: "/rules", label: "Rules" },
  { href: "/playbook", label: "Playbook" },
] as const;
