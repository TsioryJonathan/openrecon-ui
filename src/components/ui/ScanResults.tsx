"use client";

import type { ResultItem } from "@/types/api";

interface ScanResultsProps {
  username: string;
  results: ResultItem[];
  scannedCount: number;
  duration?: number;
}

export default function ScanResults({
  username,
  results,
  scannedCount,
  duration,
}: ScanResultsProps) {
  const found = results.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Found results */}
      {results.map((item) => (
        <a
          key={item.site}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 14px",
            background: "var(--color-base)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            textDecoration: "none",
            transition: "border-color 0.15s ease",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--color-success)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "13px",
                color: "var(--color-text)",
                fontWeight: 500,
                fontFamily: "var(--font-body)",
              }}
            >
              {item.site}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-mono)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.url}
            </div>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--color-success)",
              fontFamily: "var(--font-mono)",
              flexShrink: 0,
            }}
          >
            Found
          </div>
        </a>
      ))}

      {/* Empty state */}
      {found === 0 && (
        <div
          style={{
            padding: "48px 0",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
          }}
        >
          No trace found on the scanned platforms.
          <br />
          <span
            style={{
              fontSize: "12px",
              color: "var(--color-text-faint)",
              display: "block",
              marginTop: "8px",
            }}
          >
            Try scanning more categories or check the username spelling.
          </span>
        </div>
      )}
    </div>
  );
}
