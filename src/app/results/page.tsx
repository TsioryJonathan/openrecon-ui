"use client";

import { useState } from "react";
import Masthead from "@/components/layout/Masthead";
import ScanResults from "@/components/ui/ScanResults";
import { getResults } from "@/lib/api";
import type { GetResultsResponse, SearchResultEntry } from "@/types/api";

export default function ResultsPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetResultsResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScan, setSelectedScan] = useState<SearchResultEntry | null>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setNotFound(false);
    setSelectedScan(null);

    try {
      const res = await getResults(username.trim());

      if ("message" in res) {
        setNotFound(true);
      } else {
        setData(res);
        if (res.searches.length > 0) {
          setSelectedScan(res.searches[0]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-paper)" }}>
      <Masthead />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Page title */}
        <div
          style={{
            borderBottom: "2px solid var(--color-ink)",
            paddingBottom: "20px",
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "4px",
              fontOpticalSizing: "auto",
            } as React.CSSProperties}
          >
            Scan history
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontStyle: "italic",
              color: "var(--color-muted)",
            }}
          >
            Look up previous scans by username
          </p>
        </div>

        {/* Lookup form */}
        <form
          onSubmit={handleLookup}
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-end",
            marginBottom: "40px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              htmlFor="lookup"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "12px",
                fontStyle: "italic",
                color: "var(--color-muted)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <input
              id="lookup"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
              autoComplete="off"
              spellCheck={false}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: 500,
                fontOpticalSizing: "auto",
                border: "none",
                borderBottom: "2px solid var(--color-ink)",
                background: "transparent",
                color: "var(--color-ink)",
                padding: "4px 0",
                width: "100%",
                outline: "none",
              } as React.CSSProperties}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              padding: "10px 24px",
              background:
                loading || !username.trim()
                  ? "var(--color-rule)"
                  : "var(--color-ink)",
              border: "none",
              color:
                loading || !username.trim()
                  ? "var(--color-muted)"
                  : "var(--color-paper)",
              cursor: loading || !username.trim() ? "not-allowed" : "pointer",
              transition: "background 0.15s ease",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {loading ? "Looking up…" : "Look up"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div
            style={{
              border: "1.5px solid var(--color-ink)",
              padding: "16px 20px",
              marginBottom: "24px",
            }}
          >
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

        {/* Not found */}
        {notFound && (
          <div
            style={{
              padding: "48px 0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontStyle: "italic",
                color: "var(--color-muted)",
              }}
            >
              No scans found for &ldquo;{username}&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--color-muted)",
                marginTop: "8px",
              }}
            >
              Run a scan first from the home page.
            </p>
          </div>
        )}

        {/* Scan history */}
        {data && (
          <div>
            {/* Scan selector */}
            <div
              style={{
                borderBottom: "1px solid var(--color-rule)",
                marginBottom: "28px",
                paddingBottom: "16px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "var(--color-muted)",
                  width: "100%",
                  marginBottom: "8px",
                }}
              >
                {data.searches.length} scan{data.searches.length !== 1 ? "s" : ""} on record for &ldquo;{data.username}&rdquo;
              </p>

              {data.searches.map((scan, i) => {
                const isActive = selectedScan?.id === scan.id;
                return (
                  <button
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      padding: "6px 12px",
                      border: `1px solid ${isActive ? "var(--color-ink)" : "var(--color-rule)"}`,
                      background: isActive ? "var(--color-ink)" : "transparent",
                      color: isActive ? "var(--color-paper)" : "var(--color-muted)",
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                    }}
                  >
                    {formatDate(scan.created_at)}
                    <span
                      style={{
                        marginLeft: "6px",
                        color: isActive ? "var(--color-paper)" : "var(--color-found)",
                        opacity: isActive ? 0.7 : 1,
                      }}
                    >
                      {scan.results.length} found
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected scan results */}
            {selectedScan && (
              <ScanResults
                username={data.username}
                results={selectedScan.results}
                scannedCount={selectedScan.results.length}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
