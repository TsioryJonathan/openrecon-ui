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

  function getCategoryCount(cat: CategorySites) {
    return cat.sites.filter((s) => selected.includes(s)).length;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* All sites card */}
      <button
        type="button"
        onClick={toggleAll}
        style={{
          background: "var(--color-surface)",
          border: `1px solid ${allSelected ? "var(--color-accent)" : "var(--color-border)"}`,
          borderRadius: "10px",
          padding: "18px",
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.15s ease",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: allSelected ? "var(--color-accent)" : "var(--color-text)",
            fontWeight: 600,
            fontFamily: "var(--font-body)",
          }}
        >
          All sites
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--color-text-muted)",
            marginTop: "4px",
            fontFamily: "var(--font-mono)",
          }}
        >
          {selected.length}/{allSites.length}
        </div>
      </button>

      {/* Category cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
        }}
      >
        {categories.map((cat) => {
          const count = getCategoryCount(cat);
          const isActive = count > 0;
          const isOpen = expanded === cat.name;

          return (
            <div key={cat.name}>
              <button
                type="button"
                onClick={() => {
                  if (isOpen) {
                    setExpanded(null);
                  } else {
                    setExpanded(cat.name);
                  }
                }}
                style={{
                  background: "var(--color-surface)",
                  border: `1px solid ${isActive ? "var(--color-accent)" : "var(--color-border)"}`,
                  borderRadius: "10px",
                  padding: "18px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.15s ease",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {cat.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    marginTop: "4px",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {count > 0 ? `${count}/` : ""}{cat.sites.length}
                </div>
              </button>

              {/* Expanded site list */}
              {isOpen && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    padding: "8px 0",
                  }}
                >
                  {cat.sites.map((site) => {
                    const isSelected = selected.includes(site);
                    return (
                      <button
                        key={site}
                        type="button"
                        onClick={() => toggleSite(site)}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          padding: "4px 8px",
                          border: `1px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                          borderRadius: "6px",
                          background: isSelected ? "var(--color-accent)" : "transparent",
                          color: isSelected ? "var(--color-base)" : "var(--color-text-muted)",
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
    </div>
  );
}
