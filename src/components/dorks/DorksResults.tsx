"use client";

import { useState, useMemo } from "react";
import type { DorkGenerateResponse, DorkCategory, DorkItem } from "@/types/api";
import { FilterBar, SectionHeader, CopyButton } from "@/components/ui";
import { IconDorks } from "@/lib/icons";
import { ExternalLink, Copy, Check } from "lucide-react";

interface DorksResultsProps {
  data: DorkGenerateResponse;
}

// ─── Operator highlighting ────────────────────────────────────────────────────
// Highlights known Google dork operators without a complex parser.

const OPERATOR_PATTERN =
  /\b(site:|inurl:|intitle:|intext:|filetype:|ext:|cache:|link:|related:|before:|after:|OR|AND)\b/g;

function HighlightedQuery({ query }: { query: string }) {
  const parts = query.split(OPERATOR_PATTERN);

  return (
    <span>
      {parts.map((part, i) =>
        OPERATOR_PATTERN.test(part) ? (
          <span
            key={i}
            style={{
              color:      "var(--accent)",
              fontWeight: 600,
            }}
          >
            {part}
          </span>
        ) : (
          <span key={i} style={{ color: "var(--text-muted)" }}>
            {part}
          </span>
        )
      )}
    </span>
  );
}

// ─── DorksResults ─────────────────────────────────────────────────────────────

export function DorksResults({ data }: DorksResultsProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filterOptions = useMemo(() => [
    { key: "ALL", label: "ALL", count: data.total },
    ...data.categories.map((c) => ({
      key:   c.name,
      label: c.name.toUpperCase(),
      count: c.dorks.length,
    })),
  ], [data]);

  const displayed = useMemo(() =>
    activeFilter === "ALL"
      ? data.categories
      : data.categories.filter((c) => c.name === activeFilter),
    [activeFilter, data.categories]
  );

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div
        style={{
          display:        "flex",
          alignItems:     "baseline",
          justifyContent: "space-between",
          flexWrap:       "wrap",
          gap:            "0.75rem",
          marginBottom:   "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.875rem" }}>
          <p className="t-label">GENERATED QUERIES</p>
          <span
            className="t-mono"
            style={{ fontSize: "var(--text-xs)", color: "var(--accent)", fontWeight: 600 }}
          >
            {data.total}
          </span>
        </div>
        <span
          className="t-mono"
          style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}
        >
          {data.target}
        </span>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ marginBottom: "2rem" }}>
        <FilterBar
          options={filterOptions}
          active={activeFilter}
          onChange={setActiveFilter}
          ariaLabel="Filter queries by category"
        />
      </div>

      {/* ── Category sections ── */}
      {displayed.map((cat) => (
        <CategorySection key={cat.name} category={cat} />
      ))}
    </div>
  );
}

// ─── CategorySection ──────────────────────────────────────────────────────────

function CategorySection({ category }: { category: DorkCategory }) {
  const [allCopied, setAllCopied] = useState(false);

  async function copyAll() {
    const all = category.dorks.map((d) => d.query).join("\n");
    try {
      await navigator.clipboard.writeText(all);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div style={{ marginBottom: "2.5rem" }}>

      {/* Category header */}
      <div
        style={{
          borderTop:   "1px solid var(--border-subtle)",
          padding:     "1rem 0 0.875rem",
          display:     "flex",
          alignItems:  "flex-start",
          justifyContent: "space-between",
          gap:         "1rem",
          flexWrap:    "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <IconDorks size={12} style={{ color: "var(--accent)" }} aria-hidden="true" />
            <p
              className="t-label"
              style={{ color: "var(--accent)", letterSpacing: "0.12em" }}
            >
              {category.name.toUpperCase()}
            </p>
            <span
              className="t-label"
              style={{ color: "var(--text-dim)" }}
            >
              {category.dorks.length} {category.dorks.length === 1 ? "query" : "queries"}
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize:   "var(--text-xs)",
              color:      "var(--text-dim)",
              lineHeight: 1.5,
            }}
          >
            {category.description}
          </p>
        </div>

        {/* Copy all button */}
        <button
          type="button"
          onClick={copyAll}
          aria-label={`Copy all ${category.name} queries`}
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "0.4rem",
            fontFamily:    "var(--font-mono)",
            fontSize:      "var(--text-2xs)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         allCopied ? "var(--accent)" : "var(--text-dim)",
            border:        "none",
            background:    "transparent",
            cursor:        "pointer",
            transition:    "color var(--t-base)",
            padding:       "0.25rem 0",
            flexShrink:    0,
          }}
          className="hover:text-[var(--text)]"
        >
          {allCopied ? <Check size={11} /> : <Copy size={11} />}
          {allCopied ? "Copied" : "Copy all"}
        </button>
      </div>

      {/* Dork rows */}
      <div>
        {category.dorks.map((dork, i) => (
          <DorkRow key={dork.query} dork={dork} index={i + 1} />
        ))}
      </div>
    </div>
  );
}

// ─── DorkRow ──────────────────────────────────────────────────────────────────

function DorkRow({ dork, index }: { dork: DorkItem; index: number }) {
  return (
    <div
      style={{
        borderTop:  "1px solid var(--border-subtle)",
        padding:    "1rem 0",
      }}
    >
      {/* Title + index */}
      <div
        style={{
          display:      "flex",
          alignItems:   "baseline",
          gap:          "0.75rem",
          marginBottom: "0.6rem",
        }}
      >
        <span
          className="t-mono"
          style={{
            fontSize:      "var(--text-2xs)",
            color:         "var(--text-dim)",
            userSelect:    "none",
            flexShrink:    0,
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize:   "var(--text-sm)",
            fontWeight: 500,
            color:      "var(--text-muted)",
            lineHeight: 1.4,
          }}
        >
          {dork.title}
        </p>
      </div>

      {/* Query — the focal point */}
      <div
        style={{
          background:   "var(--surface)",
          border:       "1px solid var(--border-subtle)",
          padding:      "0.75rem 1rem",
          marginBottom: "0.75rem",
          position:     "relative",
        }}
      >
        <p
          className="t-mono"
          style={{
            fontSize:   "var(--text-sm)",
            lineHeight: 1.6,
            wordBreak:  "break-word",
          }}
        >
          <HighlightedQuery query={dork.query} />
        </p>
      </div>

      {/* Actions row */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "0.75rem",
          flexWrap:   "wrap",
        }}
      >
        {/* Copy query */}
        <CopyQueryButton query={dork.query} title={dork.title} />

        {/* Divider dot */}
        <span style={{ color: "var(--border)", fontSize: "0.5rem" }}>●</span>

        {/* Search Google — prominent */}
        <a
          href={dork.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search Google for: ${dork.title} (opens in new tab)`}
          style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           "0.4rem",
            fontFamily:    "var(--font-mono)",
            fontSize:      "var(--text-2xs)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "var(--text)",
            border:        "1px solid var(--border)",
            padding:       "0.35rem 0.75rem",
            background:    "transparent",
            transition:    "all var(--t-base)",
            textDecoration: "none",
          }}
          className="hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Search Google
          <ExternalLink size={11} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

// ─── CopyQueryButton ──────────────────────────────────────────────────────────

function CopyQueryButton({ query, title }: { query: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy query: ${title}`}
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           "0.4rem",
        fontFamily:    "var(--font-mono)",
        fontSize:      "var(--text-2xs)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color:         copied ? "var(--accent)" : "var(--text-muted)",
        border:        "none",
        background:    "transparent",
        cursor:        "pointer",
        padding:       "0.35rem 0",
        transition:    "color var(--t-base)",
      }}
      className={!copied ? "hover:text-[var(--text)]" : ""}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy query"}
    </button>
  );
}
