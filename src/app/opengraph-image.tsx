import { ImageResponse } from "next/og";

export const alt = "PolicyScanner — Cover match, not just the cheapest";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ece5d2",
          color: "#1a1816",
          padding: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Top — logo + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#e11d48",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle
                cx="17"
                cy="17"
                r="7"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M22.5 22.5 L29 29"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M13.5 17 L16 19.5 L20.5 14.5"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            PolicyScanner
          </div>
        </div>

        {/* Middle — headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.02,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            <span>Compare on&nbsp;</span>
            <span style={{ color: "#e11d48" }}>cover,</span>
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            not just price.
          </div>
        </div>

        {/* Bottom — supporting line */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#6b5f52",
          }}
        >
          <div style={{ fontSize: 26, maxWidth: 760, lineHeight: 1.3 }}>
            Upload any UK home insurance document and instantly see what
            you’re actually covered for.
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "#1a1816" }}>
            policyscanner.co.uk
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
