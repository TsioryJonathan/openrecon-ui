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

  useEffect(() => {
    getSites()
      .then((data) => setCategories(data.categories))
      .catch(() => {});
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
    <div style={{ minHeight: "100vh", background: "var(--color-base)" }}>
      <Masthead />

      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "14px",
              fontWeight: 500,
            }}
          >
            OSINT USERNAME SCANNER
          </div>
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "32px",
              fontWeight: 700,
              color: "var(--color-text)",
              lineHeight: 1.15,
              marginBottom: "28px",
              letterSpacing: "-0.8px",
            }}
          >
            Find where a name lives online
          </h1>

          {/* Search bar */}
          <form onSubmit={handleScan}>
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                transition: "border-color 0.2s ease",
              }}
            >
              <span
                style={{
                  color: "var(--color-accent)",
                  fontSize: "15px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ~
              </span>
              <input
                ref={inputRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                autoComplete="off"
                spellCheck={false}
                disabled={phase === "scanning"}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text)",
                }}
              />
              {phase === "scanning" && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  scanning...
                </span>
              )}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "var(--color-text-faint)",
                marginTop: "10px",
                fontFamily: "var(--font-body)",
              }}
            >
              Press Enter to scan · Select categories below to filter
            </div>
          </form>
        </div>

        {/* Categories grid */}
        {phase === "idle" || phase === "error" ? (
          <div>
            {categories.length === 0 ? (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
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
                fontFamily: "var(--font-body)",
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--color-text)",
                textAlign: "center",
              }}
            >
              Scanning &ldquo;{username}&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-text-muted)",
              }}
            >
              checking {selected.length} platforms via sherlock-rs…
            </p>
          </div>
        )}

        {/* Error state */}
        {phase === "error" && error && (
          <div
            style={{
              border: "1px solid var(--color-border)",
              padding: "20px 24px",
              borderRadius: "8px",
              marginBottom: "24px",
              background: "var(--color-surface)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--color-text)",
                marginBottom: "4px",
              }}
            >
              Scan failed
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-text-muted)",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Results */}
        {phase === "done" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--color-text)",
                  }}
                >
                  Scanning @{username}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    marginTop: "4px",
                  }}
                >
                  {results.length} / {selected.length} checked · {results.length} found
                  {duration !== undefined && ` · ${duration.toFixed(1)}s`}
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--color-accent)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                New scan
              </button>
            </div>
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
