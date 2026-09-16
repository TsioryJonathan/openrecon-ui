"use client";

import { useState } from "react";
import {
  ToolPage,
  TextInput,
  ActionButton,
  RequestError,
  EmptyState,
  Divider,
  InlineLink,
  SkeletonLine,
} from "@/components/ui";
import { SherlockHistoryList } from "@/components/sherlock/SherlockHistory";
import { useSherlockResults } from "@/hooks/useApi";
import { IconSherlock } from "@/lib/icons";
import type { GetResultsResponse } from "@/types/api";

export function SherlockHistoryTool() {
  const [input, setInput]       = useState("");
  const [username, setUsername] = useState("");

  const { data, isLoading, isError, error } = useSherlockResults(username, {
    enabled: username.length > 0,
  });

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (t) setUsername(t);
  }

  const hasResults =
    data && "searches" in data && (data as GetResultsResponse).searches.length > 0;
  const isEmpty = data && "message" in data;

  return (
    <ToolPage
      eyebrow="SHERLOCK / HISTORY"
      title="Search history"
      description="Retrieve past reconnaissance searches for a specific username."
      icon={<IconSherlock size={20} />}
      actions={<InlineLink href="/sherlock" direction="back">Search</InlineLink>}
    >
      {/* Lookup form */}
      <form onSubmit={handleLookup} noValidate>
        <div style={{ display: "flex", gap: 0, maxWidth: "480px" }}>
          <TextInput
            prefix="@"
            type="text"
            placeholder="username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-label="Username to retrieve history for"
            required
            disabled={isLoading}
          />
          <ActionButton type="submit" loading={isLoading} loadingText="Retrieving…">
            Retrieve →
          </ActionButton>
        </div>
      </form>

      {/* Results area */}
      {username && (
        <>
          <Divider style={{ margin: "2rem 0" }} />

          {isLoading && <HistorySkeleton username={username} />}

          {isError && !isLoading && (
            <RequestError
              message={
                (error as { detail?: string })?.detail ??
                "Failed to retrieve history."
              }
            />
          )}

          {!isLoading && isEmpty && (
            <EmptyState
              title="NO HISTORY"
              description={`No searches have been performed for @${username} yet.`}
            />
          )}

          {!isLoading && hasResults && (
            <SherlockHistoryList
              username={username}
              searches={(data as GetResultsResponse).searches}
            />
          )}
        </>
      )}
    </ToolPage>
  );
}

// ─── HistorySkeleton ──────────────────────────────────────────────────────────

function HistorySkeleton({ username }: { username: string }) {
  return (
    <div aria-busy="true" aria-label={`Loading history for @${username}`}>
      {/* Header */}
      <div
        style={{
          display:      "flex",
          gap:          "1rem",
          alignItems:   "baseline",
          marginBottom: "1.5rem",
        }}
      >
        <p className="t-label animate-scan-pulse" style={{ color: "var(--accent)" }}>
          RETRIEVING
        </p>
        <span className="t-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          @{username}
        </span>
      </div>

      {/* Skeleton rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            borderTop:           "1px solid var(--border-subtle)",
            padding:             "1.1rem 0",
            display:             "grid",
            gridTemplateColumns: "3.5rem 1fr auto auto",
            gap:                 "1rem",
            alignItems:          "center",
          }}
        >
          <SkeletonLine width="40px" height="9px" />
          <SkeletonLine width={`${140 + (i * 31) % 80}px`} height="11px" />
          <SkeletonLine width="45px" height="11px" />
          <SkeletonLine width="13px" height="13px" />
        </div>
      ))}
    </div>
  );
}
