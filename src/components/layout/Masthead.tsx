"use client";

import Link from "next/link";

export default function Masthead() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 32px",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          fontWeight: 700,
          color: "var(--color-text)",
          textDecoration: "none",
          letterSpacing: "-0.3px",
        }}
      >
        openrecon
      </Link>

      <Link
        href="/results"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          color: "var(--color-text-muted)",
          textDecoration: "none",
          transition: "color 0.15s ease",
        }}
      >
        history →
      </Link>
    </header>
  );
}
