"use client";

import { useState } from "react";
import {
  ToolPage,
  TextInput,
  ActionButton,
  RequestError,
  Divider,
} from "@/components/ui";
import { DorksResults } from "@/components/dorks/DorksResults";
import { useGenerateDorks } from "@/hooks/useApi";

export function DorksTool() {
  const [target, setTarget] = useState("");
  const { mutate, isPending, isError, error, data } = useGenerateDorks();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!target.trim()) return;
    mutate({ target: target.trim() });
  }

  return (
    <ToolPage
      eyebrow="DORKS"
      title="Search intelligence"
      description="Generate targeted Google dork queries for a username, email address, domain, or real name."
    >
      {/* How-to hint */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {[
          ["Username", "john_doe"],
          ["Email", "john@example.com"],
          ["Domain", "example.com"],
          ["Name", "John Doe"],
        ].map(([type, ex]) => (
          <div key={type}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                color: "var(--text-dim)",
                marginBottom: "0.15rem",
                textTransform: "uppercase",
              }}
            >
              {type}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
              }}
            >
              {ex}
            </p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 0, maxWidth: "480px" }}>
          <TextInput
            type="text"
            placeholder="username, email, domain, or name"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Target to generate dorks for"
            required
            maxLength={64}
          />
          <ActionButton type="submit" loading={isPending} loadingText="Generating…">
            Generate →
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
              Generating dork queries…
            </p>
          )}

          {isError && (
            <RequestError
              message={error?.detail ?? "Failed to generate dork queries."}
              onRetry={() => mutate({ target })}
            />
          )}

          {!isPending && data && <DorksResults data={data} />}
        </>
      )}
    </ToolPage>
  );
}
