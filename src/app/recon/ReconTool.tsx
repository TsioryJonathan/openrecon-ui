"use client";

import { useState } from "react";
import {
  ToolPage,
  TextInput,
  ActionButton,
  RequestError,
  Divider,
} from "@/components/ui";
import { IpResults } from "@/components/recon/IpResults";
import { DomainResults } from "@/components/recon/DomainResults";
import { useRecon } from "@/hooks/useApi";
import type { ReconIpData, ReconDomainData, ReconResponse } from "@/types/api";

type Mode = "ip" | "domain";

export function ReconTool() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("ip");
  const { mutate, isPending, isError, error, data } = useRecon();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    mutate({ query: query.trim() });
  }

  return (
    <ToolPage
      eyebrow="RECON"
      title="Network intelligence"
      description="Investigate an IP address or domain — geolocation, ISP, ASN, DNS records, subdomains."
    >
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Mode toggle */}
        <div
          style={{ display: "flex", gap: "0", marginBottom: "1rem" }}
          role="group"
          aria-label="Query type"
        >
          {(["ip", "domain"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                padding: "0.35rem 0.85rem",
                border: "1px solid var(--border-subtle)",
                borderRight: m === "ip" ? "none" : "1px solid var(--border-subtle)",
                background: mode === m ? "var(--accent-dim)" : "transparent",
                color: mode === m ? "var(--accent)" : "var(--text-dim)",
                cursor: "pointer",
                transition: "all 0.12s",
                textTransform: "uppercase",
              }}
            >
              {m === "ip" ? "IP Address" : "Domain"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 0, maxWidth: "560px" }}>
          <TextInput
            type="text"
            placeholder={
              mode === "ip" ? "e.g. 8.8.8.8 or 2001:4860:4860::8888" : "e.g. example.com"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label={mode === "ip" ? "IP address to analyse" : "Domain to analyse"}
            required
          />
          <ActionButton type="submit" loading={isPending} loadingText="Analysing…">
            Analyze →
          </ActionButton>
        </div>
      </form>

      {/* Results */}
      {(isPending || data || isError) && (
        <>
          <Divider className="mt-8" />

          {isPending && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-dim)",
                animation: "scan-pulse 1.5s ease-in-out infinite",
              }}
            >
              Analysing target — gathering intelligence…
            </p>
          )}

          {isError && (
            <RequestError
              message={error?.detail ?? "The recon request could not be completed."}
              onRetry={() => mutate({ query })}
            />
          )}

          {!isPending && data && <ReconOutput data={data} />}
        </>
      )}
    </ToolPage>
  );
}

function ReconOutput({ data }: { data: ReconResponse }) {
  if (data.type === "ip") {
    return <IpResults query={data.query} data={data.data as ReconIpData} />;
  }
  return <DomainResults query={data.query} data={data.data as ReconDomainData} />;
}
