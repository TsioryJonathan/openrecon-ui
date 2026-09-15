"use client";

import { useState } from "react";
import {
  ToolPage,
  TextInput,
  ActionButton,
  RequestError,
  Divider,
  SkeletonLine,
  SectionHeader,
} from "@/components/ui";
import { DorksResults } from "@/components/dorks/DorksResults";
import { useGenerateDorks } from "@/hooks/useApi";
import { IconDorks } from "@/lib/icons";

// ─── Input hint examples ──────────────────────────────────────────────────────

const EXAMPLES = [
  { type: "USERNAME", value: "john_doe"        },
  { type: "EMAIL",    value: "john@example.com" },
  { type: "DOMAIN",   value: "example.com"      },
  { type: "NAME",     value: "John Doe"          },
] as const;

// ─── DorksTool ────────────────────────────────────────────────────────────────

export function DorksTool() {
  const [target, setTarget] = useState("");
  const { mutate, isPending, isError, error, data, reset } = useGenerateDorks();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = target.trim();
    if (!t) return;
    reset();
    mutate({ target: t });
  }

  return (
    <ToolPage
      eyebrow="DORKS / SEARCH"
      title="Search intelligence"
      description="Generate targeted search operator queries for a username, email, domain, or real name."
      icon={<IconDorks size={20} />}
    >
      {/* ── Example hints ── */}
      <div
        style={{
          display:      "flex",
          gap:          "2rem",
          marginBottom: "1.75rem",
          flexWrap:     "wrap",
        }}
        aria-label="Input examples"
      >
        {EXAMPLES.map(({ type, value }) => (
          <button
            key={type}
            type="button"
            onClick={() => setTarget(value)}
            title={`Use "${value}" as target`}
            style={{
              background: "transparent",
              border:     "none",
              cursor:     "pointer",
              textAlign:  "left",
              padding:    0,
            }}
          >
            <p className="t-label" style={{ marginBottom: "0.2rem" }}>
              {type}
            </p>
            <p
              className="t-mono hover:text-[var(--accent)]"
              style={{
                fontSize:   "var(--text-xs)",
                color:      "var(--text-muted)",
                transition: "color var(--t-base)",
              }}
            >
              {value}
            </p>
          </button>
        ))}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", gap: 0, maxWidth: "520px" }}>
          <TextInput
            type="text"
            placeholder="username, email, domain, or name"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-label="Target to generate dork queries for"
            required
            maxLength={64}
            disabled={isPending}
          />
          <ActionButton
            type="submit"
            loading={isPending}
            loadingText="Generating…"
          >
            Generate →
          </ActionButton>
        </div>
      </form>

      {/* ── Results / states ── */}
      {(isPending || data || isError) && (
        <>
          <Divider style={{ margin: "2rem 0" }} />

          {isPending && <DorksSkeleton />}

          {isError && !isPending && (
            <RequestError
              message={
                (error as { detail?: string })?.detail ??
                "Failed to generate dork queries."
              }
              onRetry={() => mutate({ target: target.trim() })}
            />
          )}

          {!isPending && data && <DorksResults data={data} />}
        </>
      )}
    </ToolPage>
  );
}

// ─── DorksSkeleton ────────────────────────────────────────────────────────────

function DorksSkeleton() {
  return (
    <div aria-label="Generating queries" aria-busy="true">

      {/* Header */}
      <div
        style={{
          display:      "flex",
          alignItems:   "baseline",
          gap:          "0.875rem",
          marginBottom: "1.5rem",
        }}
      >
        <p className="t-label animate-scan-pulse" style={{ color: "var(--accent)" }}>
          GENERATING QUERIES
        </p>
      </div>

      {/* Mock categories */}
      {[4, 3, 5].map((count, ci) => (
        <div key={ci} style={{ marginBottom: "2.5rem" }}>

          {/* Category header skeleton */}
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              padding:   "1rem 0 0.875rem",
              display:   "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <SkeletonLine width="90px"  height="10px" />
              <SkeletonLine width="180px" height="10px" />
            </div>
            <SkeletonLine width="60px" height="10px" />
          </div>

          {/* Dork row skeletons */}
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid var(--border-subtle)",
                padding:   "1rem 0",
              }}
            >
              {/* Title */}
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem", alignItems: "baseline" }}>
                <SkeletonLine width="18px"  height="9px" />
                <SkeletonLine width={`${110 + (i * 27) % 80}px`} height="12px" />
              </div>

              {/* Query box */}
              <div
                style={{
                  background: "var(--surface)",
                  border:     "1px solid var(--border-subtle)",
                  padding:    "0.75rem 1rem",
                  marginBottom: "0.75rem",
                  display:    "flex",
                  flexDirection: "column",
                  gap:        "0.4rem",
                }}
              >
                <SkeletonLine width={`${160 + (i * 43) % 120}px`} height="12px" />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <SkeletonLine width="80px"  height="10px" />
                <SkeletonLine width="4px"   height="4px"  />
                <SkeletonLine width="110px" height="28px" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
