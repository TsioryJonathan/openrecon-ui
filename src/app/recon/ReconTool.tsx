"use client";

import { useState } from "react";
import {
  ToolPage,
  TextInput,
  ActionButton,
  RequestError,
  Divider,
  SectionHeader,
  SkeletonLine,
} from "@/components/ui";
import { IpResults } from "@/components/recon/IpResults";
import { DomainResults } from "@/components/recon/DomainResults";
import { useRecon } from "@/hooks/useApi";
import { IconRecon } from "@/lib/icons";
import type { ReconIpData, ReconDomainData, ReconResponse } from "@/types/api";

type Mode = "ip" | "domain";

export function ReconTool() {
  const [query, setQuery]   = useState("");
  const [mode, setMode]     = useState<Mode>("ip");
  const { mutate, isPending, isError, error, data, reset } = useRecon();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    reset();
    mutate({ query: q });
  }

  return (
    <ToolPage
      eyebrow="RECON / NETWORK"
      title="Network intelligence"
      description="Investigate an IP address or domain — geolocation, ISP, ASN, DNS records and subdomains."
      icon={<IconRecon size={20} />}
    >
      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Mode toggle */}
        <div
          role="group"
          aria-label="Target type"
          style={{ display: "flex", marginBottom: "0.875rem" }}
        >
          {(["ip", "domain"] as const).map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              style={{
                fontFamily:    "var(--font-mono)",
                fontSize:      "var(--text-2xs)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding:       "0.35rem 0.85rem",
                border:        "1px solid var(--border-subtle)",
                borderRight:   i === 0 ? "none" : "1px solid var(--border-subtle)",
                background:    mode === m ? "var(--accent-dim)" : "transparent",
                color:         mode === m ? "var(--accent)" : "var(--text-dim)",
                cursor:        "pointer",
                transition:    "all var(--t-base)",
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
              mode === "ip"
                ? "e.g. 8.8.8.8 or 2001:4860:4860::8888"
                : "e.g. example.com"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-label={mode === "ip" ? "IP address to analyse" : "Domain to analyse"}
            required
            disabled={isPending}
          />
          <ActionButton
            type="submit"
            loading={isPending}
            loadingText="Analysing…"
          >
            Analyze →
          </ActionButton>
        </div>
      </form>

      {/* ── Results / states ── */}
      {(isPending || data || isError) && (
        <>
          <Divider style={{ margin: "2rem 0" }} />

          {isPending && <ReconSkeleton />}

          {isError && !isPending && (
            <RequestError
              message={
                (error as { detail?: string })?.detail ??
                "The reconnaissance request could not be completed."
              }
              onRetry={() => mutate({ query: query.trim() })}
            />
          )}

          {!isPending && data && <ReconOutput data={data} />}
        </>
      )}
    </ToolPage>
  );
}

// ─── ReconOutput ──────────────────────────────────────────────────────────────

function ReconOutput({ data }: { data: ReconResponse }) {
  if (data.type === "ip") {
    return <IpResults query={data.query} data={data.data as ReconIpData} />;
  }
  return <DomainResults query={data.query} data={data.data as ReconDomainData} />;
}

// ─── ReconSkeleton ────────────────────────────────────────────────────────────

function ReconSkeleton() {
  return (
    <div aria-label="Loading reconnaissance data" aria-busy="true">

      {/* Target */}
      <div style={{ marginBottom: "2rem" }}>
        <SkeletonLine width="40px"  height="10px" />
        <div style={{ marginTop: "0.75rem", marginBottom: "0.4rem" }}>
          <SkeletonLine width="200px" height="32px" />
        </div>
        <SkeletonLine width="60px"  height="10px" />
      </div>

      <Divider />

      {/* Network block */}
      <div style={{ marginBottom: "2rem" }}>
        <SectionHeader label="NETWORK" />
        <div style={{ marginBottom: "1.25rem" }}>
          <SkeletonLine width="120px" height="26px" />
          <div style={{ marginTop: "0.4rem" }}>
            <SkeletonLine width="160px" height="14px" />
          </div>
        </div>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap:                 "1.25rem 2.5rem",
          }}
        >
          {["ISP", "Organisation"].map((label) => (
            <div key={label}>
              <p className="t-label" style={{ marginBottom: "0.4rem" }}>{label}</p>
              <SkeletonLine width="130px" height="14px" />
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Location block */}
      <div style={{ marginBottom: "2rem" }}>
        <SectionHeader label="LOCATION" />
        <SkeletonLine width="200px" height="22px" />
        <div style={{ marginTop: "0.4rem", marginBottom: "1.5rem" }}>
          <SkeletonLine width="120px" height="14px" />
        </div>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 130px)",
            gap:                 "1rem 2.5rem",
          }}
        >
          {["Latitude", "Longitude", "Maps"].map((l) => (
            <div key={l}>
              <p className="t-label" style={{ marginBottom: "0.4rem" }}>{l}</p>
              <SkeletonLine width="90px" height="14px" />
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Signals block */}
      <div>
        <SectionHeader label="SIGNALS" />
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 100px)",
            gap:                 "1.25rem 2rem",
          }}
        >
          {["Proxy", "Hosting", "Mobile"].map((l) => (
            <div key={l}>
              <p className="t-label" style={{ marginBottom: "0.4rem" }}>{l}</p>
              <SkeletonLine width="30px" height="14px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
