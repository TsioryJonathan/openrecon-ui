"use client";

import { useEffect, useRef, useState } from "react";
import Masthead from "@/components/layout/Masthead";
import CategoryPicker from "@/components/ui/CategoryPicker";
import ScanResults from "@/components/ui/ScanResults";
import { getSites, searchUsername } from "@/lib/api";
import type { CategorySites, ResultItem } from "@/types/api";

type Phase = "idle" | "scanning" | "done" | "error";

export default function HomePage() {
  const [categories, setCategories] = useState<CategorySites[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSites()
      .then((data) => setCategories(data.categories))
      .catch(() => {/* silently fail, user will see empty picker */});
  }, []);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || selected.length === 0) return;

    setPhase("scanning");
    setError(null);
    setResults([]);

    const start = performance.now();

    try {
      const data = await searchUsername(username.trim(), selected);
      const elapsed = (performance.now() - start) / 1000;
      setResults(data.results);
      setDuration(elapsed);
      setPhase("done");

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      setPhase("error");
    }
  }

  function handleReset() {
    setPhase("idle");
    setResults([]);
    setError(null);
    setUsername("");
    setSelected([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const canSubmit =
    username.trim().length > 0 && selected.length > 0 && phase !== "scanning";

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-paper)" }}>
      <Masthead />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Search form */}
        <form onSubmit={handleScan}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0",
              borderBottom: "1px solid var(--color-rule)",
              paddingBottom: "32px",
              marginBottom: "32px",
            }}
          >
            {/* Username input — styled as a newspaper headline input */}
            <label
              htmlFor="username"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                fontStyle: "italic",
                color: "var(--color-muted)",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Username to investigate
            </label>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                ref={inputRef}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
                autoComplete="off"
                spellCheck={false}
                disabled={phase === "scanning"}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 4vw, 40px)",
                  fontWeight: 500,
                  fontOpticalSizing: "auto",
                  border: "none",
                  borderBottom: "2px solid var(--color-ink)",
                  background: "transparent",
                  color: "var(--color-ink)",
                  padding: "4px 0",
                  width: "100%",
                  outline: "none",
                  flex: 1,
                } as React.CSSProperties}
              />

              {/* Scan / Reset button */}
              {phase === "done" || phase === "error" ? (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "10px 20px",
                    background: "transparent",
                    border: "1.5px solid var(--color-rule)",
                    color: "var(--color-ink-soft)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  New scan
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 600,
                    padding: "10px 24px",
                    background: canSubmit ? "var(--color-ink)" : "var(--color-rule)",
                    border: "none",
                    color: canSubmit ? "var(--color-paper)" : "var(--color-muted)",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    transition: "background 0.15s ease",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {phase === "scanning" ? "Scanning…" : "Run scan"}
                </button>
              )}
            </div>

            {/* Selection counter */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: selected.length > 0 ? "var(--color-found)" : "var(--color-muted)",
                marginTop: "8px",
              }}
            >
              {selected.length} platform{selected.length !== 1 ? "s" : ""} selected
            </p>
          </div>

          {/* Category picker */}
          {phase === "idle" || phase === "error" ? (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "14px",
                  fontStyle: "italic",
                  color: "var(--color-muted)",
                  marginBottom: "16px",
                }}
              >
                Select which categories to scan
              </p>

              {categories.length === 0 ? (
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--color-muted)",
                    padding: "32px 0",
                    textAlign: "center",
                  }}
                >
                  Loading platforms… (is the API running?)
                </div>
              ) : (
                <CategoryPicker
                  categories={categories}
                  selected={selected}
                  onChange={setSelected}
                />
              )}
            </div>
          ) : null}
        </form>

        {/* Scanning state */}
        {phase === "scanning" && (
          <div
            style={{
              padding: "64px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontWeight: 600,
                fontStyle: "italic",
                color: "var(--color-ink)",
                textAlign: "center",
                fontOpticalSizing: "auto",
              } as React.CSSProperties}
            >
              Scanning &ldquo;{username}&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--color-muted)",
              }}
            >
              checking {selected.length} platforms via sherlock-rs…
            </p>
            <ScanningDots />
          </div>
        )}

        {/* Error state */}
        {phase === "error" && error && (
          <div
            style={{
              border: "1.5px solid var(--color-ink)",
              padding: "20px 24px",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                fontStyle: "italic",
                color: "var(--color-ink)",
                marginBottom: "4px",
              }}
            >
              Scan failed
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--color-muted)",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Results */}
        {phase === "done" && (
          <div ref={resultsRef}>
            <ScanResults
              username={username}
              results={results}
              scannedCount={selected.length}
              duration={duration}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function ScanningDots() {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--color-ink)",
            display: "inline-block",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
