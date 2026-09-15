"use client";

import { useState } from "react";
import { ToolPage, RequestError, Divider, InlineLink } from "@/components/ui";
import { SherlockForm } from "@/components/sherlock/SherlockForm";
import { ScanState } from "@/components/sherlock/ScanState";
import { SherlockResults } from "@/components/sherlock/SherlockResults";
import { useSearchUsername } from "@/hooks/useApi";
import { IconSherlock } from "@/lib/icons";
import type { ResultItem } from "@/types/api";

export function SherlockTool() {
  const { mutate, isPending, isError, error } = useSearchUsername();
  const [lastUsername, setLastUsername] = useState("");
  const [lastSites, setLastSites] = useState<string[]>([]);
  const [results, setResults] = useState<ResultItem[] | null>(null);

  function handleSearch(username: string, sites: string[]) {
    setLastUsername(username);
    setLastSites(sites);
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

  function handleRetry() {
    mutate(
      { username: lastUsername, sites: lastSites },
      { onSuccess: (d) => setResults(d.results) }
    );
  }

  return (
    <ToolPage
      eyebrow="SHERLOCK / IDENTITY"
      title="Username reconnaissance"
      description="Discover accounts associated with a username across selected platforms."
      icon={<IconSherlock size={20} />}
      actions={
        <InlineLink href="/sherlock/history">History</InlineLink>
      }
    >
      <SherlockForm onSearch={handleSearch} loading={isPending} />

      {(isPending || results !== null || isError) && (
        <>
          <Divider style={{ margin: "2rem 0" }} />

          {isPending && <ScanState username={lastUsername} />}

          {isError && !isPending && (
            <RequestError
              message={
                (error as { detail?: string })?.detail ??
                "The reconnaissance request could not be completed."
              }
              onRetry={handleRetry}
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
