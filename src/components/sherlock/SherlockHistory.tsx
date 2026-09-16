"use client";

import { useState } from "react";
import type { SearchResultEntry } from "@/types/api";
import { ExternalLinkButton } from "@/components/ui";
import { IconChevronDown, IconChevronRight } from "@/lib/icons";
import { formatDateTime, padIndex } from "@/lib/utils";

interface SherlockHistoryListProps {
  username: string;
  searches: SearchResultEntry[];
}

export function SherlockHistoryList({ username, searches }: SherlockHistoryListProps) {
  const sorted = [...searches].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div
        style={{
          display:      "flex",
          alignItems:   "baseline",
          gap:          "1rem",
          marginBottom: "1.5rem",
          flexWrap:     "wrap",
        }}
      >
        <p className="t-label">HISTORY</p>
        <span className="t-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          @{username}
        </span>
        <span className="t-label" style={{ color: "var(--text-dim)" }}>
          {sorted.length} {sorted.length === 1 ? "search" : "searches"}
        </span>
      </div>

      <ol style={{ listStyle: "none", padding: 0 }}>
        {sorted.map((entry, i) => (
          <HistoryEntry
            key={entry.id}
            entry={entry}
            caseNumber={sorted.length - i}
          />
        ))}
      </ol>
    </div>
  );
}

// ─── HistoryEntry ─────────────────────────────────────────────────────────────

function HistoryEntry({
  entry,
  caseNumber,
}: {
  entry: SearchResultEntry;
  caseNumber: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Case #${padIndex(caseNumber, 5)} — ${formatDateTime(entry.created_at)} — ${entry.results.length} results`}
        style={{
          width:               "100%",
          background:          "transparent",
          border:              "none",
          cursor:              "pointer",
          padding:             "1.1rem 0",
          display:             "grid",
          gridTemplateColumns: "3.5rem 1fr auto auto",
          gap:                 "1rem",
          alignItems:          "center",
          textAlign:           "left",
          transition:          "background var(--t-fast)",
        }}
        className="hover:bg-[var(--surface)]"
      >
        {/* Case number */}
        <span
          className="t-mono"
          style={{
            fontSize:      "var(--text-2xs)",
            letterSpacing: "0.08em",
            color:         "var(--text-dim)",
          }}
        >
          #{padIndex(caseNumber, 5)}
        </span>

        {/* Date */}
        <span
          className="t-mono"
          style={{
            fontSize: "var(--text-xs)",
            color:    "var(--text-muted)",
          }}
        >
          {formatDateTime(entry.created_at)}
        </span>

        {/* Found count */}
        <span
          className="t-mono"
          style={{
            fontSize:   "var(--text-xs)",
            fontWeight: entry.results.length > 0 ? 600 : 400,
            color:      entry.results.length > 0 ? "var(--accent)" : "var(--text-dim)",
            flexShrink: 0,
          }}
        >
          {entry.results.length} found
        </span>

        {/* Chevron */}
        <span style={{ color: "var(--text-dim)", display: "flex", flexShrink: 0 }}>
          {open ? <IconChevronDown size={13} /> : <IconChevronRight size={13} />}
        </span>
      </button>

      {/* Expanded results */}
      {open && (
        <div style={{ paddingBottom: "0.75rem" }}>
          {entry.results.length === 0 ? (
            <p
              className="t-label"
              style={{ paddingLeft: "3.5rem", paddingBottom: "0.5rem", color: "var(--text-dim)" }}
            >
              No results found in this search.
            </p>
          ) : (
            <ol style={{ listStyle: "none", padding: 0 }}>
              {entry.results.map((r, i) => (
                <li
                  key={r.url}
                  style={{
                    display:             "grid",
                    gridTemplateColumns: "3.5rem 1fr auto",
                    gap:                 "0.75rem",
                    alignItems:          "center",
                    padding:             "0.45rem 0",
                    borderTop:           "1px solid var(--border-subtle)",
                  }}
                >
                  <span
                    className="t-mono"
                    style={{ fontSize: "var(--text-2xs)", color: "var(--text-dim)", paddingLeft: "1rem" }}
                  >
                    {padIndex(i + 1)}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily:   "var(--font-display)",
                        fontSize:     "var(--text-sm)",
                        fontWeight:   500,
                        color:        "var(--text)",
                        marginBottom: "0.15rem",
                      }}
                    >
                      {r.site}
                    </p>
                    <p
                      className="t-mono"
                      style={{
                        fontSize:     "var(--text-2xs)",
                        color:        "var(--text-dim)",
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace:   "nowrap",
                      }}
                    >
                      {r.url}
                    </p>
                  </div>
                  <ExternalLinkButton
                    href={r.url}
                    label={`Open ${r.site} profile`}
                    size={13}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </li>
  );
}
