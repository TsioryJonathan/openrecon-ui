"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import type { SearchResultEntry } from "@/types/api";
import { formatDateTime } from "@/lib/utils";

interface SherlockHistoryListProps {
  username: string;
  searches: SearchResultEntry[];
}

export function SherlockHistoryList({
  username,
  searches,
}: SherlockHistoryListProps) {
  const sorted = [...searches].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "baseline",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "var(--text-dim)",
          }}
        >
          HISTORY
        </p>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
          }}
        >
          @{username}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
          }}
        >
          {sorted.length} {sorted.length === 1 ? "search" : "searches"}
        </span>
      </div>

      <ol style={{ listStyle: "none", padding: 0 }}>
        {sorted.map((entry, i) => (
          <HistoryEntry
            key={entry.id}
            entry={entry}
            index={sorted.length - i}
          />
        ))}
      </ol>
    </div>
  );
}

function HistoryEntry({
  entry,
  index,
}: {
  entry: SearchResultEntry;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li
      style={{
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "1.25rem 0",
          display: "grid",
          gridTemplateColumns: "2.5rem 1fr auto auto",
          gap: "1rem",
          alignItems: "center",
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        {/* Case number */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.06em",
            color: "var(--text-dim)",
          }}
        >
          #{String(index).padStart(5, "0")}
        </span>

        {/* Date */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          {formatDateTime(entry.created_at)}
        </span>

        {/* Count */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: entry.results.length > 0 ? "var(--accent)" : "var(--text-dim)",
          }}
        >
          {entry.results.length} found
        </span>

        {/* Chevron */}
        <span style={{ color: "var(--text-dim)" }}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {/* Expanded results */}
      {open && entry.results.length > 0 && (
        <div style={{ paddingBottom: "1rem" }}>
          <ol style={{ listStyle: "none", padding: 0 }}>
            {entry.results.map((r, i) => (
              <li
                key={r.url}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5rem 1fr auto",
                  gap: "0.75rem",
                  alignItems: "center",
                  padding: "0.5rem 0",
                  borderTop: "1px solid var(--border-subtle)",
                  marginLeft: "2.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--text-dim)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text)",
                      marginBottom: "0.1rem",
                    }}
                  >
                    {r.site}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      color: "var(--text-dim)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.url}
                  </p>
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${r.site} profile`}
                  style={{ color: "var(--text-dim)" }}
                  className="hover:text-[var(--accent)]"
                >
                  <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {open && entry.results.length === 0 && (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--text-dim)",
            paddingBottom: "1rem",
            paddingLeft: "3.5rem",
          }}
        >
          No results found in this search.
        </p>
      )}
    </li>
  );
}
