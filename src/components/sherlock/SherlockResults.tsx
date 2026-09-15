"use client";

import { useState, useMemo } from "react";
import type { ResultItem } from "@/types/api";
import { EmptyState, ExternalLinkButton, FilterBar, AccordionSection } from "@/components/ui";
import { useSites } from "@/hooks/useApi";
import { Search, X } from "lucide-react";
import { padIndex } from "@/lib/utils";

interface SherlockResultsProps {
  username: string;
  results: ResultItem[];
}

export function SherlockResults({ username, results }: SherlockResultsProps) {
  const { data: sitesData } = useSites();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  // Build site -> category lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    sitesData?.categories.forEach((cat) => {
      cat.sites.forEach((site) => {
        map.set(site.toLowerCase(), cat.name);
      });
    });
    return map;
  }, [sitesData]);

  function getCategory(site: string): string {
    return categoryMap.get(site.toLowerCase()) ?? "Other";
  }

  // Results enriched with category
  const enriched = useMemo(
    () => results.map((r) => ({ ...r, category: getCategory(r.site) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [results, categoryMap]
  );

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    enriched.forEach(({ category }) => {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    });
    return counts;
  }, [enriched]);

  // Build filter options from actual results
  const filterOptions = useMemo(() => {
    const cats = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({
        key: cat,
        label: cat.toUpperCase(),
        count,
      }));
    return [{ key: "ALL", label: "ALL", count: results.length }, ...cats];
  }, [categoryCounts, results.length]);

  // Grouped by category (for ALL view)
  const grouped = useMemo(() => {
    const map = new Map<string, ResultItem[]>();
    enriched.forEach((r) => {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [enriched]);

  // Filtered + searched results
  const filtered = useMemo(() => {
    let list = enriched;
    if (activeFilter !== "ALL") {
      list = list.filter((r) => r.category === activeFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.site.toLowerCase().includes(q) ||
          r.url.toLowerCase().includes(q)
      );
    }
    return list;
  }, [enriched, activeFilter, query]);

  const isSearchMode = query.trim().length > 0;
  const isSingleCategory = activeFilter !== "ALL";
  const showAccordionView = !isSearchMode && !isSingleCategory;

  return (
    <div className="animate-fade-in">

      {/* -- Results header -- */}
      <div
        style={{
          display:      "flex",
          alignItems:   "baseline",
          gap:          "1rem",
          marginBottom: "1.5rem",
          flexWrap:     "wrap",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.875rem" }}>
          <p className="t-label">SEARCH RESULTS</p>
          <span
            className="t-mono"
            style={{
              fontSize:  "var(--text-xs)",
              color:     results.length > 0 ? "var(--accent)" : "var(--text-dim)",
              fontWeight: 600,
            }}
          >
            {results.length} FOUND
          </span>
        </div>
        <span
          className="t-mono"
          style={{
            fontSize: "var(--text-xs)",
            color:    "var(--text-muted)",
          }}
        >
          @{username}
        </span>
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="NO MATCHES"
          description={`No results were found across the selected platforms for @${username}.`}
        />
      ) : (
        <>
          {/* -- Filter bar -- */}
          <div style={{ marginBottom: "1rem" }}>
            <FilterBar
              options={filterOptions}
              active={activeFilter}
              onChange={(k) => {
                setActiveFilter(k);
                setQuery("");
              }}
              ariaLabel="Filter results by category"
            />
          </div>

          {/* -- Search within results -- */}
          <div
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "0.5rem",
              border:       "1px solid var(--border-subtle)",
              background:   "var(--surface)",
              padding:      "0 0.875rem",
              marginBottom: "1.25rem",
              maxWidth:     "320px",
            }}
          >
            <Search
              size={12}
              style={{ color: "var(--text-dim)", flexShrink: 0 }}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Filter results..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Filter results by site name or URL"
              style={{
                background: "transparent",
                border:     "none",
                outline:    "none",
                fontFamily: "var(--font-mono)",
                fontSize:   "var(--text-xs)",
                color:      "var(--text)",
                height:     "34px",
                width:      "100%",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear filter"
                style={{
                  background: "transparent",
                  border:     "none",
                  cursor:     "pointer",
                  color:      "var(--text-dim)",
                  display:    "flex",
                  padding:    0,
                  flexShrink: 0,
                }}
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* -- Result count after filter -- */}
          {(activeFilter !== "ALL" || query) && (
            <p
              className="t-label"
              style={{ color: "var(--text-dim)", marginBottom: "0.75rem" }}
            >
              {filtered.length} of {results.length} results
            </p>
          )}

          {/* -- Results -- */}
          {filtered.length === 0 ? (
            <EmptyState
              title="NO MATCHES"
              description="No results match the current filter."
            />
          ) : showAccordionView ? (
            /* Accordion view: grouped by category, collapsed by default */
            <div>
              {grouped.map(([category, items]) => (
                <AccordionSection
                  key={category}
                  label={category}
                  count={items.length}
                >
                  <ol style={{ listStyle: "none", padding: 0 }}>
                    {items.map((result, i) => (
                      <ResultRow
                        key={result.url}
                        index={i + 1}
                        site={result.site}
                        url={result.url}
                        showCategory={false}
                      />
                    ))}
                  </ol>
                </AccordionSection>
              ))}
            </div>
          ) : (
            /* Flat list: single category or search results */
            <ol
              style={{ listStyle: "none", padding: 0 }}
              aria-label={`${filtered.length} results`}
            >
              {filtered.map((result, i) => (
                <ResultRow
                  key={result.url}
                  index={i + 1}
                  site={result.site}
                  url={result.url}
                  showCategory={false}
                />
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  );
}

// ─── ResultRow ────────────────────────────────────────────────────────────────

interface ResultRowProps {
  index: number;
  site: string;
  url: string;
  showCategory?: boolean;
}

function ResultRow({ index, site, url, showCategory = false }: ResultRowProps) {
  return (
    <li
      className="animate-fade-in-up group"
      style={{
        borderTop:   "1px solid var(--border-subtle)",
        padding:     "0.8rem 0",
        display:     "grid",
        gridTemplateColumns: showCategory ? "2.5rem 1fr auto" : "2.5rem 1fr auto",
        gap:         "1rem",
        alignItems:  "center",
        transition:  "background var(--t-fast)",
      }}
    >
      {/* Index */}
      <span
        className="t-mono"
        style={{
          fontSize:   "var(--text-2xs)",
          color:      "var(--text-dim)",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        {padIndex(index)}
      </span>

      {/* Site + URL */}
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily:   "var(--font-display)",
            fontSize:     "var(--text-sm)",
            fontWeight:   500,
            color:        "var(--text)",
            marginBottom: "0.2rem",
            letterSpacing: "-0.01em",
          }}
        >
          {site}
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
          {url}
        </p>
      </div>

      {/* External link */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "0.875rem",
          flexShrink: 0,
        }}
      >
        <ExternalLinkButton
          href={url}
          label={`Open ${site} profile`}
          size={14}
        />
      </div>
    </li>
  );
}
