"use client";

import Link from "next/link";
import { useState } from "react";
import { ToolPage, RequestError, Divider } from "@/components/ui";
import { SherlockForm } from "@/components/sherlock/SherlockForm";
import { ScanState } from "@/components/sherlock/ScanState";
import { SherlockResults } from "@/components/sherlock/SherlockResults";
import { useSearchUsername } from "@/hooks/useApi";
import type { ResultItem } from "@/types/api";

export function SherlockTool() {
  const { mutate, isPending, isError, error } = useSearchUsername();
  const [lastUsername, setLastUsername] = useState("");
  const [results, setResults] = useState<ResultItem[] | null>(null);

  function handleSearch(username: string, sites: string[]) {
    setLastUsername(username);
    setResults(null);
    mutate(
      { username, sites },
      {
        onSuccess: (data) => {
          setResults(data.results);
        },
      }
    );
  }

  return (
    <ToolPage
      eyebrow="SHERLOCK"
      title="Username reconnaissance"
      description="Find accounts associated with a username across 480+ platforms."
      actions={
        <Link
          href="/sherlock/history"
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
          HISTORY →
        </Link>
      }
    >
      <SherlockForm onSearch={handleSearch} loading={isPending} />

      {(isPending || results !== null || isError) && (
        <>
          <Divider className="mt-8" />

          {isPending && <ScanState username={lastUsername} />}

          {isError && (
            <RequestError
              message={error?.detail ?? "The reconnaissance request could not be completed."}
              onRetry={() =>
                mutate(
                  { username: lastUsername, sites: [] },
                  { onSuccess: (d) => setResults(d.results) }
                )
              }
            />
          )}

          {!isPending && results !== null && (
            <SherlockResults username={lastUsername} results={results} />
          )}
        </>
      )}
    </ToolPage>
  );
}
