"use client";

import { SkeletonLine } from "@/components/ui";

interface ScanStateProps {
  username: string;
}

// Number of skeleton rows to show — mimics the result list structure
const SKELETON_ROWS = 8;

export function ScanState({ username }: ScanStateProps) {
  return (
    <div style={{ paddingTop: "0.5rem" }}>

      {/* ── Status header ── */}
      <div
        style={{
          display:      "flex",
          alignItems:   "baseline",
          gap:          "1.25rem",
          marginBottom: "1.75rem",
          flexWrap:     "wrap",
        }}
      >
        <p
          className="t-label animate-scan-pulse"
          style={{ color: "var(--accent)", letterSpacing: "0.14em" }}
        >
          SEARCHING
        </p>

        <span
          className="t-mono"
          style={{
            fontSize:  "var(--text-sm)",
            color:     "var(--text-muted)",
          }}
        >
          @{username}
        </span>
      </div>

      {/* ── Indeterminate progress bar ── */}
      <div
        role="progressbar"
        aria-label="Scanning platforms"
        aria-valuetext="Reconnaissance in progress"
        style={{
          width:        "100%",
          maxWidth:     "360px",
          height:       "1px",
          background:   "var(--border-subtle)",
          position:     "relative",
          overflow:     "hidden",
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            position:   "absolute",
            top:        0,
            left:       "-70%",
            width:      "50%",
            height:     "100%",
            background: "var(--accent)",
            animation:  "skeleton-shimmer 1.4s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
      </div>

      <p
        className="t-label"
        style={{ color: "var(--text-dim)", marginBottom: "2rem" }}
      >
        SCANNING SELECTED PLATFORMS
      </p>

      {/* ── Skeleton result rows ── */}
      <div
        aria-hidden="true"
        aria-label="Loading results"
      >
        {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
          <SkeletonRow key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

function SkeletonRow({ index }: { index: number }) {
  // Stagger the animation slightly so rows shimmer sequentially
  const delay = `${index * 0.06}s`;

  // Vary widths for a more natural look
  const siteWidths  = ["80px", "96px", "72px", "88px", "104px", "76px", "92px", "68px"];
  const urlWidths   = ["180px", "220px", "160px", "200px", "240px", "170px", "210px", "150px"];
  const catWidths   = ["60px", "72px", "54px", "68px", "64px", "76px", "58px", "70px"];

  return (
    <div
      style={{
        borderTop:   "1px solid var(--border-subtle)",
        padding:     "0.875rem 0",
        display:     "grid",
        gridTemplateColumns: "2.5rem 1fr auto",
        gap:         "1rem",
        alignItems:  "center",
        animationDelay: delay,
      }}
    >
      {/* Index placeholder */}
      <SkeletonLine width="20px" height="10px" />

      {/* Site + URL */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <SkeletonLine
          width={siteWidths[index % siteWidths.length]}
          height="13px"
        />
        <SkeletonLine
          width={urlWidths[index % urlWidths.length]}
          height="10px"
        />
      </div>

      {/* Category + icon */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "1rem",
          flexShrink: 0,
        }}
      >
        <SkeletonLine
          width={catWidths[index % catWidths.length]}
          height="10px"
        />
        <SkeletonLine width="14px" height="14px" />
      </div>
    </div>
  );
}
