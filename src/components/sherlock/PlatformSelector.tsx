"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Settings2, X, Search, Check } from "lucide-react";
import { useSites } from "@/hooks/useApi";
import type { CategorySites } from "@/types/api";
import { SkeletonLine } from "@/components/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlatformSelection {
  /** null = "all sites" (nothing explicitly chosen) */
  selectedSites: Set<string> | null;
}

interface PlatformSelectorProps {
  value: PlatformSelection;
  onChange: (v: PlatformSelection) => void;
  disabled?: boolean;
}

// ─── PlatformSelector ────────────────────────────────────────────────────────
// Compact trigger button + dialog panel.

export function PlatformSelector({ value, onChange, disabled }: PlatformSelectorProps) {
  const { data: sitesData, isLoading } = useSites();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const allSites = useMemo(
    () => sitesData?.categories.flatMap((c) => c.sites) ?? [],
    [sitesData]
  );

  const isAll = value.selectedSites === null;
  const selectedCount = isAll ? (sitesData?.total ?? 0) : value.selectedSites!.size;

  return (
    <div style={{ position: "relative" }}>
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled || isLoading}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Configure platform selection"
        style={{
          display:       "flex",
          alignItems:    "center",
          gap:           "0.5rem",
          fontFamily:    "var(--font-mono)",
          fontSize:      "var(--text-2xs)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         isAll ? "var(--text-dim)" : "var(--accent)",
          border:        isAll ? "1px solid var(--border-subtle)" : "1px solid var(--accent)",
          background:    isAll ? "transparent" : "var(--accent-dim)",
          padding:       "0.35rem 0.75rem",
          cursor:        disabled || isLoading ? "not-allowed" : "pointer",
          opacity:       disabled || isLoading ? 0.5 : 1,
          transition:    "all var(--t-base)",
          whiteSpace:    "nowrap",
        }}
      >
        <Settings2 size={11} />
        {isLoading ? (
          "Loading…"
        ) : isAll ? (
          `All ${sitesData?.total ?? ""} platforms`
        ) : (
          `${selectedCount} selected`
        )}
      </button>

      {/* ── Dialog panel ── */}
      {open && sitesData && (
        <PlatformDialog
          ref={dialogRef}
          categories={sitesData.categories}
          total={sitesData.total}
          allSites={allSites}
          value={value}
          onChange={onChange}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}

// ─── PlatformDialog ───────────────────────────────────────────────────────────

interface PlatformDialogProps {
  categories: CategorySites[];
  total: number;
  allSites: string[];
  value: PlatformSelection;
  onChange: (v: PlatformSelection) => void;
  onClose: () => void;
}

const PlatformDialog = ({
  categories,
  total,
  allSites,
  value,
  onChange,
  onClose,
}: PlatformDialogProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus search on open
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // ── Derived state ──

  // Current effective set (null = all)
  const isAll = value.selectedSites === null;

  function getEffectiveSet(): Set<string> {
    return isAll ? new Set(allSites) : new Set(value.selectedSites!);
  }

  // Filtered sites for the list
  const filteredSites = useMemo(() => {
    const q = query.toLowerCase().trim();
    const pool =
      activeCategory === "ALL"
        ? categories.flatMap((c) => c.sites.map((s) => ({ site: s, category: c.name })))
        : (categories.find((c) => c.name === activeCategory)?.sites ?? []).map((s) => ({
            site: s,
            category: activeCategory,
          }));
    if (!q) return pool;
    return pool.filter((p) => p.site.toLowerCase().includes(q));
  }, [categories, activeCategory, query]);

  // ── Actions ──

  function selectAll() {
    onChange({ selectedSites: null });
  }

  function selectNone() {
    onChange({ selectedSites: new Set() });
  }

  function toggleSite(site: string) {
    const current = getEffectiveSet();
    const next = new Set(current);
    if (next.has(site)) {
      next.delete(site);
    } else {
      next.add(site);
    }
    // If all sites are selected, revert to "null" (all)
    if (next.size === allSites.length) {
      onChange({ selectedSites: null });
    } else {
      onChange({ selectedSites: next });
    }
  }

  function toggleCategory(catName: string) {
    const cat = categories.find((c) => c.name === catName);
    if (!cat) return;
    const current = getEffectiveSet();
    const catSet = new Set(cat.sites);
    const allCatSelected = cat.sites.every((s) => current.has(s));
    const next = new Set(current);
    if (allCatSelected) {
      cat.sites.forEach((s) => next.delete(s));
    } else {
      cat.sites.forEach((s) => next.add(s));
    }
    if (next.size === allSites.length) {
      onChange({ selectedSites: null });
    } else {
      onChange({ selectedSites: next });
    }
  }

  function isCategorySelected(catName: string): boolean | "partial" {
    const cat = categories.find((c) => c.name === catName);
    if (!cat) return false;
    if (isAll) return true;
    const sel = value.selectedSites!;
    const count = cat.sites.filter((s) => sel.has(s)).length;
    if (count === 0) return false;
    if (count === cat.sites.length) return true;
    return "partial";
  }

  const effective = getEffectiveSet();
  const selectedCount = isAll ? total : value.selectedSites!.size;

  // Visible sites capped for performance
  const MAX_VISIBLE = 120;
  const visibleSites = filteredSites.slice(0, MAX_VISIBLE);
  const overflow = filteredSites.length - MAX_VISIBLE;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Platform selector"
      aria-modal="true"
      style={{
        position:     "absolute",
        top:          "calc(100% + 0.5rem)",
        left:         0,
        zIndex:       100,
        background:   "var(--surface)",
        border:       "1px solid var(--border)",
        width:        "min(520px, 92vw)",
        display:      "flex",
        flexDirection: "column",
        maxHeight:    "480px",
        boxShadow:    "0 8px 32px rgba(0,0,0,0.4)",
      }}
      className="animate-fade-in"
    >

      {/* ── Header ── */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0.875rem 1rem",
          borderBottom:   "1px solid var(--border-subtle)",
          flexShrink:     0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <p className="t-label">PLATFORMS</p>
          <span
            className="t-mono"
            style={{ fontSize: "var(--text-2xs)", color: "var(--accent)" }}
          >
            {selectedCount} / {total}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* All / None */}
          <button
            type="button"
            onClick={selectAll}
            className="t-label"
            style={{
              background:  "transparent",
              border:      "none",
              cursor:      "pointer",
              color:       isAll ? "var(--accent)" : "var(--text-dim)",
              padding:     "0.25rem 0.4rem",
              transition:  "color var(--t-base)",
            }}
          >
            ALL
          </button>
          <span className="t-label" style={{ color: "var(--border)" }}>·</span>
          <button
            type="button"
            onClick={selectNone}
            className="t-label"
            style={{
              background: "transparent",
              border:     "none",
              cursor:     "pointer",
              color:      (!isAll && value.selectedSites!.size === 0)
                ? "var(--accent)"
                : "var(--text-dim)",
              padding:    "0.25rem 0.4rem",
              transition: "color var(--t-base)",
            }}
          >
            NONE
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close platform selector"
            style={{
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              background:      "transparent",
              border:          "none",
              cursor:          "pointer",
              color:           "var(--text-dim)",
              padding:         "0.25rem",
              marginLeft:      "0.25rem",
              transition:      "color var(--t-base)",
            }}
            className="hover:text-[var(--text)]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div
        style={{
          padding:        "0.625rem 1rem",
          borderBottom:   "1px solid var(--border-subtle)",
          display:        "flex",
          alignItems:     "center",
          gap:            "0.5rem",
          flexShrink:     0,
        }}
      >
        <Search size={13} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search platforms…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search platforms"
          style={{
            background:  "transparent",
            border:      "none",
            outline:     "none",
            fontFamily:  "var(--font-mono)",
            fontSize:    "var(--text-sm)",
            color:       "var(--text)",
            width:       "100%",
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            style={{
              background: "transparent",
              border:     "none",
              cursor:     "pointer",
              color:      "var(--text-dim)",
              display:    "flex",
              padding:    0,
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* ── Body: category tabs + site list ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* Category sidebar */}
        <div
          role="tablist"
          aria-label="Platform categories"
          style={{
            width:        "130px",
            flexShrink:   0,
            borderRight:  "1px solid var(--border-subtle)",
            overflowY:    "auto",
            padding:      "0.375rem 0",
          }}
        >
          {/* ALL tab */}
          <CategoryTab
            label="All"
            count={total}
            active={activeCategory === "ALL"}
            selected={isAll}
            onClick={() => setActiveCategory("ALL")}
          />
          {categories.map((cat) => {
            const state = isCategorySelected(cat.name);
            return (
              <CategoryTab
                key={cat.name}
                label={cat.name}
                count={cat.sites.length}
                active={activeCategory === cat.name}
                selected={state === true}
                partial={state === "partial"}
                onClick={() => setActiveCategory(cat.name)}
                onToggle={() => toggleCategory(cat.name)}
              />
            );
          })}
        </div>

        {/* Site list */}
        <div
          role="listbox"
          aria-label="Individual platforms"
          aria-multiselectable="true"
          style={{
            flex:      1,
            overflowY: "auto",
            padding:   "0.375rem 0",
          }}
        >
          {visibleSites.length === 0 ? (
            <p
              className="t-label"
              style={{
                color:   "var(--text-dim)",
                padding: "1rem",
              }}
            >
              No platforms match "{query}"
            </p>
          ) : (
            <>
              {visibleSites.map(({ site }) => {
                const checked = isAll ? true : effective.has(site);
                return (
                  <button
                    key={site}
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggleSite(site)}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      gap:            "0.625rem",
                      width:          "100%",
                      background:     checked ? "var(--accent-dim)" : "transparent",
                      border:         "none",
                      borderBottom:   "1px solid var(--border-subtle)",
                      padding:        "0.45rem 0.875rem",
                      cursor:         "pointer",
                      textAlign:      "left",
                      transition:     "background var(--t-fast)",
                    }}
                    className="hover:bg-[var(--surface-raised)]"
                  >
                    {/* Checkbox */}
                    <span
                      style={{
                        width:        "13px",
                        height:       "13px",
                        border:       checked
                          ? "1px solid var(--accent)"
                          : "1px solid var(--border)",
                        background:   checked ? "var(--accent)" : "transparent",
                        flexShrink:   0,
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                        transition:   "all var(--t-fast)",
                      }}
                      aria-hidden="true"
                    >
                      {checked && (
                        <Check
                          size={9}
                          style={{ color: "#09090B", strokeWidth: 3 }}
                        />
                      )}
                    </span>
                    <span
                      className="t-mono"
                      style={{
                        fontSize:  "var(--text-xs)",
                        color:     checked ? "var(--text)" : "var(--text-muted)",
                        transition: "color var(--t-fast)",
                        minWidth:  0,
                        overflow:  "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {site}
                    </span>
                  </button>
                );
              })}

              {overflow > 0 && (
                <p
                  className="t-label"
                  style={{
                    color:   "var(--text-dim)",
                    padding: "0.625rem 0.875rem",
                  }}
                >
                  +{overflow} more — refine your search
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── CategoryTab ──────────────────────────────────────────────────────────────

interface CategoryTabProps {
  label: string;
  count: number;
  active: boolean;
  selected: boolean;
  partial?: boolean;
  onClick: () => void;
  onToggle?: () => void;
}

function CategoryTab({
  label,
  count,
  active,
  selected,
  partial,
  onClick,
  onToggle,
}: CategoryTabProps) {
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "0.4rem 0.75rem",
        background:     active ? "var(--surface-raised)" : "transparent",
        borderLeft:     active ? "2px solid var(--accent)" : "2px solid transparent",
        transition:     "all var(--t-fast)",
        cursor:         "pointer",
        gap:            "0.375rem",
      }}
      role="tab"
      aria-selected={active}
    >
      {/* Label — click to view */}
      <button
        type="button"
        onClick={onClick}
        style={{
          background:    "transparent",
          border:        "none",
          cursor:        "pointer",
          fontFamily:    "var(--font-mono)",
          fontSize:      "var(--text-2xs)",
          letterSpacing: "0.06em",
          color:         active ? "var(--text)" : "var(--text-muted)",
          textAlign:     "left",
          flex:          1,
          minWidth:      0,
          overflow:      "hidden",
          textOverflow:  "ellipsis",
          whiteSpace:    "nowrap",
          transition:    "color var(--t-fast)",
        }}
      >
        {label.toUpperCase()}
      </button>

      {/* Mini checkbox for category toggle */}
      {onToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-label={`${selected ? "Deselect" : "Select"} all ${label} platforms`}
          style={{
            width:        "11px",
            height:       "11px",
            flexShrink:   0,
            border:       (selected || partial)
              ? "1px solid var(--accent)"
              : "1px solid var(--border)",
            background:   selected
              ? "var(--accent)"
              : partial
              ? "var(--accent-dim)"
              : "transparent",
            cursor:       "pointer",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            transition:   "all var(--t-fast)",
            padding:      0,
          }}
        >
          {selected && (
            <Check size={7} style={{ color: "#09090B", strokeWidth: 3 }} />
          )}
          {partial && !selected && (
            <span
              style={{
                width:      "5px",
                height:     "1px",
                background: "var(--accent)",
                display:    "block",
              }}
            />
          )}
        </button>
      )}

      {/* Count */}
      {!onToggle && (
        <span
          className="t-mono"
          style={{
            fontSize: "0.55rem",
            color:    "var(--text-dim)",
            flexShrink: 0,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
