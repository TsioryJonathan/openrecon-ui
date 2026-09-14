"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import type { DorkGenerateResponse, DorkCategory, DorkItem } from "@/types/api";

interface DorksResultsProps {
  data: DorkGenerateResponse;
}

export function DorksResults({ data }: DorksResultsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayed = activeCategory
    ? data.categories.filter((c) => c.name === activeCategory)
    : data.categories;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "var(--text-dim)",
            }}
          >
            DORKS
          </p>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--accent)",
            }}
          >
            {data.total} queries
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          {data.target}
        </span>
      </div>

      {/* Category filter */}
      <div
        style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "2rem" }}
        role="group"
        aria-label="Filter by category"
      >
        <FilterPill
          label="All"
          active={activeCategory === null}
          onClick={() => setActiveCategory(null)}
        />
        {data.categories.map((cat) => (
          <FilterPill
            key={cat.name}
            label={cat.name}
            active={activeCategory === cat.name}
            onClick={() =>
              setActiveCategory(activeCategory === cat.name ? null : cat.name)
            }
            count={cat.dorks.length}
          />
        ))}
      </div>

      {/* Categories */}
      {displayed.map((cat) => (
        <CategorySection key={cat.name} category={cat} />
      ))}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        padding: "0.3rem 0.65rem",
        border: active ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
        background: active ? "var(--accent-dim)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-muted)",
        cursor: "pointer",
        transition: "all 0.12s",
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
      }}
    >
      {label}
      {count !== undefined && (
        <span style={{ color: active ? "var(--accent)" : "var(--text-dim)", fontSize: "0.55rem" }}>
          {count}
        </span>
      )}
    </button>
  );
}

function CategorySection({ category }: { category: DorkCategory }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Category header */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "1rem 0 0.5rem" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "var(--accent)",
            marginBottom: "0.2rem",
          }}
        >
          {category.name.toUpperCase()}
        </p>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "0.78rem",
          }}
        >
          {category.description}
        </p>
      </div>

      {/* Dork rows */}
      <div>
        {category.dorks.map((dork) => (
          <DorkRow key={dork.query} dork={dork} />
        ))}
      </div>
    </div>
  );
}

function DorkRow({ dork }: { dork: DorkItem }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(dork.query);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  }

  return (
    <div
      style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "0.75rem 0",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1rem",
        alignItems: "start",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.78rem",
            marginBottom: "0.25rem",
          }}
        >
          {dork.title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-dim)",
            wordBreak: "break-word",
            lineHeight: 1.5,
          }}
        >
          {dork.query}
        </p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, paddingTop: "2px" }}>
        <button
          onClick={copy}
          title="Copy query"
          aria-label={`Copy query: ${dork.title}`}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: copied ? "var(--accent)" : "var(--text-dim)",
            padding: "0.25rem",
            transition: "color 0.12s",
            display: "flex",
            alignItems: "center",
          }}
          className="hover:text-[var(--text)]"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        <a
          href={dork.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Search on Google"
          aria-label={`Search Google: ${dork.title}`}
          style={{
            color: "var(--text-dim)",
            padding: "0.25rem",
            transition: "color 0.12s",
            display: "flex",
            alignItems: "center",
          }}
          className="hover:text-[var(--accent)]"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
