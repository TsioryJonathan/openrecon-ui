"use client";

import { useState } from "react";
import type { CategorySites } from "@/types/api";

interface CategoryPickerProps {
  categories: CategorySites[];
  selected: string[];
  onChange: (sites: string[]) => void;
  max?: number;
}

export default function CategoryPicker({
  categories,
  selected,
  onChange,
  max = 50,
}: CategoryPickerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleCategory(cat: CategorySites) {
    const catSites = cat.sites;
    const allSelected = catSites.every((s) => selected.includes(s));

    if (allSelected) {
      onChange(selected.filter((s) => !catSites.includes(s)));
    } else {
      const toAdd = catSites.filter((s) => !selected.includes(s));
      const available = max - selected.length;
      if (available <= 0) return;
      onChange([...selected, ...toAdd.slice(0, available)]);
    }
  }

  function toggleSite(site: string) {
    if (selected.includes(site)) {
      onChange(selected.filter((s) => s !== site));
    } else {
      if (selected.length >= max) return;
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
                  const atMax = selected.length >= max && !isSelected;
                  return (
                    <button
                      key={site}
                      onClick={() => !atMax && toggleSite(site)}
                      disabled={atMax}
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
                          : atMax
                          ? "var(--color-muted)"
                          : "var(--color-ink-soft)",
                        cursor: atMax ? "not-allowed" : "pointer",
                        transition: "all 0.1s ease",
                        opacity: atMax ? 0.5 : 1,
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
