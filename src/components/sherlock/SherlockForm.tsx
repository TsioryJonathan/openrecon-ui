"use client";

import { useState } from "react";
import { useSites } from "@/hooks/useApi";
import { ActionButton, TextInput, Skeleton } from "@/components/ui";

interface SherlockFormProps {
  onSearch: (username: string, sites: string[]) => void;
  loading: boolean;
}

export function SherlockForm({ onSearch, loading }: SherlockFormProps) {
  const [username, setUsername] = useState("");
  const { data: sitesData, isLoading: sitesLoading } = useSites();

  // By default, select all sites
  const allSites = sitesData?.categories.flatMap((c) => c.sites) ?? [];
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  // "all selected" when nothing specifically selected = use all
  const allSelected = selectedCategories.size === 0;

  function toggleCategory(name: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedCategories(new Set());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    const sites =
      allSelected
        ? allSites
        : (sitesData?.categories ?? [])
            .filter((c) => selectedCategories.has(c.name))
            .flatMap((c) => c.sites);
    onSearch(username.trim(), sites);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Search row */}
      <div style={{ display: "flex", gap: "0", marginBottom: "2rem" }}>
        <TextInput
          prefix="@"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label="Username to search"
          required
          minLength={1}
        />
        <ActionButton type="submit" loading={loading} loadingText="Scanning…">
          Search →
        </ActionButton>
      </div>

      {/* Category filter */}
      {sitesLoading ? (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{ width: "80px", height: "26px", background: "var(--surface-raised)", borderRadius: "2px" }}
            />
          ))}
        </div>
      ) : (
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: "var(--text-dim)",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            Platforms — {sitesData?.total ?? 0} total
          </p>
          <div
            role="group"
            aria-label="Filter by platform category"
            style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
          >
            {/* All button */}
            <CategoryPill
              label="All"
              active={allSelected}
              onClick={selectAll}
            />
            {sitesData?.categories.map((cat) => (
              <CategoryPill
                key={cat.name}
                label={cat.name}
                active={selectedCategories.has(cat.name)}
                onClick={() => toggleCategory(cat.name)}
                count={cat.sites.length}
              />
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

interface CategoryPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

function CategoryPill({ label, active, onClick, count }: CategoryPillProps) {
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
