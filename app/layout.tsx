import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import "./globals.css";

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body>
        <div className="mx-auto flex min-h-screen max-w-[52rem] flex-col px-5 sm:px-8">
          <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pt-8 pb-3">
            <Link
              href="/"
              className="font-serif text-[1.35rem] leading-none tracking-[-0.01em] no-underline"
            >
              {SITE.name}
            </Link>
            <nav className="flex flex-wrap gap-x-5 gap-y-1">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="label no-underline hover:text-accent">
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <main className="flex-1 py-10">{children}</main>

          <footer className="border-t border-rule py-6">
            <p className="label">Figures as of {SITE.asOf}</p>
            <p className="mt-2 max-w-[58ch] text-sm text-muted">
              Estimates compiled from public sources, not advice. Tax rates, insurance, and
              rents vary by property and change every year. Verify anything you plan to act on
              with the county appraisal district, a lender, and an insurance agent.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
