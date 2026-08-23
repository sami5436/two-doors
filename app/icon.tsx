import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Two bars, read as two doors. Deliberately not a logo. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#111111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <div style={{ width: 6, height: 18, background: "#ffffff" }} />
        <div style={{ width: 6, height: 18, background: "#ffffff" }} />
      </div>
    ),
    size,
  );
}
