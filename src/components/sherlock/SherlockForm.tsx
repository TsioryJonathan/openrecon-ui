"use client";

import { useState, useMemo } from "react";
import { useSites } from "@/hooks/useApi";
import { ActionButton, TextInput } from "@/components/ui";
import {
  PlatformSelector,
  type PlatformSelection,
} from "@/components/sherlock/PlatformSelector";

interface SherlockFormProps {
  onSearch: (username: string, sites: string[]) => void;
  loading: boolean;
}

export function SherlockForm({ onSearch, loading }: SherlockFormProps) {
  const [username, setUsername] = useState("");
  const [selection, setSelection] = useState<PlatformSelection>({
    selectedSites: null, // null = all
  });

  const { data: sitesData } = useSites();

  const allSites = useMemo(
    () => sitesData?.categories.flatMap((c) => c.sites) ?? [],
    [sitesData]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    // Resolve the final site list
    let sites: string[];
    if (selection.selectedSites === null) {
      // All
      sites = allSites;
    } else {
      sites = Array.from(selection.selectedSites);
    }

    onSearch(trimmed, sites);
  }

  const isNoneSelected =
    selection.selectedSites !== null && selection.selectedSites.size === 0;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Input row ── */}
      <div
        style={{
          display:      "flex",
          gap:          0,
          marginBottom: "1rem",
        }}
      >
        <TextInput
          prefix="@"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="Username to search"
          required
          minLength={1}
          maxLength={64}
          disabled={loading}
        />
        <ActionButton
          type="submit"
          loading={loading}
          loadingText="Scanning…"
          disabled={isNoneSelected}
          title={isNoneSelected ? "Select at least one platform" : undefined}
        >
          Search →
        </ActionButton>
      </div>

      {/* ── Platform selector row ── */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "0.875rem",
          flexWrap:   "wrap",
        }}
      >
        <PlatformSelector
          value={selection}
          onChange={setSelection}
          disabled={loading}
        />

        {/* Validation hint when nothing selected */}
        {isNoneSelected && (
          <p
            className="t-label"
            style={{ color: "var(--error)", letterSpacing: "0.08em" }}
            role="alert"
          >
            Select at least one platform to search
          </p>
        )}
      </div>
    </form>
  );
}
