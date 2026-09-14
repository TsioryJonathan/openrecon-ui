"use client";

import { useState } from "react";
import type { CategorySites } from "@/types/api";

interface CategoryPickerProps {
  categories: CategorySites[];
  selected: string[];
  onChange: (sites: string[]) => void;
}

export default function CategoryPicker({
  categories,
  selected,
  onChange,
}: CategoryPickerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const allSites = categories.flatMap((c) => c.sites);
  const allSelected = allSites.length > 0 && allSites.every((s) => selected.includes(s));
  const someSelected = selected.length > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...allSites]);
    }
  }

  function toggleCategory(cat: CategorySites) {
    const catSites = cat.sites;
    const allCatSelected = catSites.every((s) => selected.includes(s));

    if (allCatSelected) {
      onChange(selected.filter((s) => !catSites.includes(s)));
    } else {
      const toAdd = catSites.filter((s) => !selected.includes(s));
      onChange([...selected, ...toAdd]);
    }
  }

  function toggleSite(site: string) {
    if (selected.includes(site)) {
      onChange(selected.filter((s) => s !== site));
    } else {
      onChange([...selected, site]);
    }
  }

  function getCategoryState(cat: CategorySites): "all" | "some" | "none" {
    const count = cat.sites.filter((s) => selected.includes(s)).length;
    if (count === cat.sites.length) return "all";
    if (count > 0) return "some";
    return "none";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
      {/* All sites row */}
      <div
        style={{
          border: "1px solid var(--color-rule)",
          background: allSelected ? "var(--color-found-bg)" : "white",
          transition: "background 0.15s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 14px",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={toggleAll}
        >
          <button
            aria-label="Select all sites"
            style={{
              width: "16px",
              height: "16px",
              border: "1.5px solid var(--color-ink)",
              background: allSelected
                ? "var(--color-ink)"
                : someSelected
                ? "var(--color-muted)"
                : "transparent",
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            {(allSelected || someSelected) && (
              <span style={{ color: "white", fontSize: "10px", lineHeight: 1, fontWeight: 700 }}>
                {allSelected ? "✓" : "–"}
              </span>
            )}
          </button>

          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-ink)",
              flex: 1,
            }}
          >
            All sites
          </span>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-muted)",
            }}
          >
            {selected.length}/{allSites.length}
          </span>
        </div>
      </div>

      {categories.map((cat) => {
        const state = getCategoryState(cat);
        const isOpen = expanded === cat.name;
        const selectedCount = cat.sites.filter((s) =>
          selected.includes(s)
        ).length;

        return (
          <div
            key={cat.name}
            style={{
              border: "1px solid var(--color-rule)",
              background:
                state !== "none" ? "var(--color-found-bg)" : "white",
              transition: "background 0.15s ease",
            }}
          >
            {/* Category row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleCategory(cat)}
                aria-label={`Select all ${cat.name}`}
                style={{
                  width: "16px",
                  height: "16px",
                  border: "1.5px solid var(--color-ink)",
                  background:
                    state === "all"
                      ? "var(--color-ink)"
                      : state === "some"
                      ? "var(--color-muted)"
                      : "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                {state !== "none" && (
                  <span
                    style={{
                      color: "white",
                      fontSize: "10px",
                      lineHeight: 1,
                      fontWeight: 700,
                    }}
                  >
                    {state === "all" ? "✓" : "–"}
                  </span>
                )}
              </button>

              {/* Label */}
              <span
                onClick={() => setExpanded(isOpen ? null : cat.name)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                  flex: 1,
                }}
              >
                {cat.name}
              </span>

              {/* Count badge */}
              {selectedCount > 0 && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--color-found)",
                    fontWeight: 500,
                  }}
                >
                  {selectedCount}/{cat.sites.length}
                </span>
              )}

              {/* Expand toggle */}
              <button
                onClick={() => setExpanded(isOpen ? null : cat.name)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--color-muted)",
                  padding: "0 2px",
                  transition: "transform 0.15s ease",
                  transform: isOpen ? "rotate(90deg)" : "none",
                }}
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                ›
              </button>
            </div>

            {/* Site list */}
            {isOpen && (
              <div
                style={{
                  borderTop: "1px solid var(--color-rule)",
                  padding: "10px 14px 10px 42px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 10px",
                }}
              >
                {cat.sites.map((site) => {
                  const isSelected = selected.includes(site);
                  return (
                    <button
                      key={site}
                      onClick={() => toggleSite(site)}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        fontWeight: isSelected ? 600 : 400,
                        padding: "3px 8px",
                        border: `1px solid ${
                          isSelected ? "var(--color-found)" : "var(--color-rule)"
                        }`,
                        background: isSelected
                          ? "var(--color-found-bg)"
                          : "transparent",
                        color: isSelected
                          ? "var(--color-found)"
                          : "var(--color-ink-soft)",
                        cursor: "pointer",
                        transition: "all 0.1s ease",
                      }}
                    >
                      {site}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
