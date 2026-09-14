"use client";

import Link from "next/link";

function getEditionDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Masthead() {
  return (
    <header
      style={{
        borderBottom: "3px solid var(--color-ink)",
        paddingBottom: "0",
      }}
    >
      {/* Top strip */}
      <div
        style={{
          borderBottom: "1px solid var(--color-rule)",
          padding: "6px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          fontFamily: "var(--font-mono)",
          color: "var(--color-muted)",
          letterSpacing: "0.02em",
        }}
      >
        <span>{getEditionDate()}</span>
        <span>480+ platforms · sherlock-rs engine</span>
      </div>

      {/* Nameplate */}
      <div
        style={{
          padding: "20px 32px 16px",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 700,
            color: "var(--color-ink)",
            textDecoration: "none",
            lineHeight: 1,
            fontOpticalSizing: "auto",
          } as React.CSSProperties}
        >
          OpenRecon
        </Link>

        <nav
          style={{
            display: "flex",
            gap: "24px",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--color-ink-soft)",
          }}
        >
          <Link
            href="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            New scan
          </Link>
          <Link
            href="/results"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            History
          </Link>
        </nav>
      </div>

      {/* Thick bottom rule */}
      <div style={{ height: "3px", background: "var(--color-ink)" }} />
    </header>
  );
}
