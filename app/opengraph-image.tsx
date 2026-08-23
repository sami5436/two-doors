import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name}. ${SITE.description}`;

/** Covers every page except the calculator, which builds its own from the deal. */
export default function OpengraphImage() {
  const ink = "#111111";
  const muted = "#6b6b6b";

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
          justifyContent: "space-between",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: `2px solid ${ink}`,
            paddingBottom: 16,
          }}
        >
          <div style={{ fontSize: 40, letterSpacing: -0.5 }}>{SITE.name}</div>
          <div style={{ fontSize: 18, color: muted, letterSpacing: 2 }}>
            {SITE.asOf.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 58, lineHeight: 1.15, letterSpacing: -1.5 }}>
            Underwriting duplexes in Dallas and Houston
          </div>
          <div style={{ fontSize: 26, color: muted, lineHeight: 1.4, maxWidth: 880 }}>
            Real Texas tax, insurance, and rent numbers, and a calculator willing to tell you a deal
            is bad.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 56,
            borderTop: `2px solid ${ink}`,
            paddingTop: 20,
            fontSize: 21,
            color: muted,
          }}
        >
          <div style={{ display: "flex" }}>Homestead exemption</div>
          <div style={{ display: "flex" }}>Ten percent cap</div>
          <div style={{ display: "flex" }}>MUD districts</div>
          <div style={{ display: "flex" }}>FHA two unit</div>
        </div>
      </div>
    ),
    size,
  );
}
