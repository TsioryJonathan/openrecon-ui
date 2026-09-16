import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight:      "100vh",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "center",
        maxWidth:       "72rem",
        margin:         "0 auto",
        padding:        "2rem",
      }}
    >
      <p
        className="t-label"
        style={{ color: "var(--accent)", marginBottom: "1.25rem" }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily:    "var(--font-display)",
          fontSize:      "clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight:    700,
          letterSpacing: "-0.025em",
          color:         "var(--text)",
          marginBottom:  "0.75rem",
          lineHeight:    1.1,
        }}
      >
        Page not found.
      </h1>
      <p
        style={{
          fontFamily:   "var(--font-body)",
          fontSize:     "var(--text-sm)",
          color:        "var(--text-muted)",
          marginBottom: "2.5rem",
          lineHeight:   1.6,
        }}
      >
        The requested route does not exist.
      </p>
      <Link
        href="/"
        style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           "0.4rem",
          fontFamily:    "var(--font-mono)",
          fontSize:      "var(--text-xs)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         "var(--accent)",
          borderBottom:  "1px solid currentColor",
          paddingBottom: "2px",
          width:         "fit-content",
          transition:    "opacity var(--t-base)",
        }}
        className="hover:opacity-60"
      >
        ← Return home
      </Link>
    </div>
  );
}
