import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          gap: 26,
        }}
      >
        <div style={{ width: 30, height: 96, background: "#ffffff" }} />
        <div style={{ width: 30, height: 96, background: "#ffffff" }} />
      </div>
    ),
    size,
  );
}
