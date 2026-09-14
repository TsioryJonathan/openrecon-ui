"use client";

import { ExternalLink } from "lucide-react";
import type { ResultItem } from "@/types/api";
import { EmptyState } from "@/components/ui";
import { useSites } from "@/hooks/useApi";

interface SherlockResultsProps {
  username: string;
  results: ResultItem[];
}

export function SherlockResults({ username, results }: SherlockResultsProps) {
  const { data: sitesData } = useSites();

  // Build a site→category lookup from the sites API
  const categoryMap = new Map<string, string>();
  sitesData?.categories.forEach((cat) => {
    cat.sites.forEach((site) => {
      categoryMap.set(site.toLowerCase(), cat.name);
    });
  });

  function getCategory(site: string): string {
    return categoryMap.get(site.toLowerCase()) ?? "Other";
  }

  return (
    <div>
      {/* Results header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.5rem",
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
            SEARCH RESULTS
          </p>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: results.length > 0 ? "var(--accent)" : "var(--text-dim)",
            }}
          >
            {results.length} found
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          @{username}
        </span>
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="NO RESULTS"
          description={`No accounts were found for @${username} on the selected platforms.`}
        />
      ) : (
        <ol
          style={{ listStyle: "none", padding: 0 }}
          aria-label={`${results.length} accounts found for ${username}`}
        >
          {results.map((result, i) => (
            <ResultRow
              key={result.url}
              index={i + 1}
              result={result}
              category={getCategory(result.site)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

interface ResultRowProps {
  index: number;
  result: ResultItem;
  category: string;
}

function ResultRow({ index, result, category }: ResultRowProps) {
  return (
    <li
      style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "0.875rem 0",
        display: "grid",
        gridTemplateColumns: "2.5rem 1fr auto",
        gap: "1rem",
        alignItems: "center",
      }}
      className="animate-fade-in-up group"
    >
      {/* Index */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--text-dim)",
          userSelect: "none",
        }}
      >
        {String(index).padStart(2, "0")}
      </span>

      {/* Site + URL */}
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            color: "var(--text)",
            fontSize: "0.875rem",
            fontWeight: 400,
            marginBottom: "0.15rem",
          }}
        >
          {result.site}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--text-dim)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {result.url}
        </p>
      </div>

      {/* Category + link */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            color: "var(--text-dim)",
            textTransform: "uppercase",
            display: "none",
          }}
          className="sm:block"
        >
          {category}
        </span>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${result.site} profile`}
          style={{
            color: "var(--text-dim)",
            transition: "color 0.12s",
          }}
          className="hover:text-[var(--accent)]"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </li>
  );
}
