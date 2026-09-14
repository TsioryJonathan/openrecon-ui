"use client";

import { useState } from "react";
import Link from "next/link";
import { ToolPage, TextInput, ActionButton, RequestError, EmptyState, Divider } from "@/components/ui";
import { SherlockHistoryList } from "@/components/sherlock/SherlockHistory";
import { useSherlockResults } from "@/hooks/useApi";
import type { GetResultsResponse } from "@/types/api";

export function SherlockHistoryTool() {
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");

  const { data, isLoading, isError, error } = useSherlockResults(username, {
    enabled: username.length > 0,
  });

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) setUsername(input.trim());
  }

  const hasResults =
    data && "searches" in data && (data as GetResultsResponse).searches.length > 0;
  const isEmpty =
    data && "message" in data;

  return (
    <ToolPage
      eyebrow="SHERLOCK"
      title="Search history"
      description="Retrieve past reconnaissance searches for a specific username."
      actions={
        <Link
          href="/sherlock"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            color: "var(--text-dim)",
            textDecoration: "none",
            transition: "color 0.12s",
          }}
          className="hover:text-[var(--accent)]"
        >
          ← SEARCH
        </Link>
      }
    >
      {/* Username lookup */}
      <form onSubmit={handleLookup}>
        <div style={{ display: "flex", gap: 0, maxWidth: "480px" }}>
          <TextInput
            prefix="@"
            type="text"
            placeholder="username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Username to look up history for"
            required
          />
          <ActionButton type="submit" loading={isLoading} loadingText="Looking up…">
            Retrieve
          </ActionButton>
        </div>
      </form>

      {/* Results */}
      {username && (
        <>
          <Divider className="mt-8" />

          {isLoading && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-dim)",
                animation: "scan-pulse 1.5s ease-in-out infinite",
              }}
            >
              Retrieving history for @{username}…
            </p>
          )}

          {isError && (
            <RequestError
              message={(error as { detail?: string })?.detail ?? "Failed to retrieve history."}
            />
          )}

          {isEmpty && (
            <EmptyState
              title="NO HISTORY"
              description={`No searches have been performed for @${username} yet.`}
            />
          )}

          {hasResults && (
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
