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
    <div style={{ minHeight: "100vh", background: "var(--color-base)" }}>
      <Masthead />

      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-text)",
              letterSpacing: "-0.3px",
            }}
          >
            Scan History
          </h1>
          <a
            href="/"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--color-accent)",
              textDecoration: "none",
            }}
          >
            ← back to scan
          </a>
        </div>

        {/* Lookup form */}
        <form
          onSubmit={handleLookup}
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                color: "var(--color-accent)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
              }}
            >
              ~
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username to look up"
              autoComplete="off"
              spellCheck={false}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                color: "var(--color-text)",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 600,
              padding: "12px 20px",
              background:
                loading || !username.trim()
                  ? "var(--color-surface)"
                  : "var(--color-accent)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              color:
                loading || !username.trim()
                  ? "var(--color-text-muted)"
                  : "var(--color-base)",
              cursor: loading || !username.trim() ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {loading ? "Looking up…" : "Look up"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div
            style={{
              border: "1px solid var(--color-border)",
              padding: "16px 20px",
              borderRadius: "8px",
              marginBottom: "24px",
              background: "var(--color-surface)",
            }}
          >
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
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              No scans found for &ldquo;{username}&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "var(--color-text-muted)",
                marginTop: "8px",
              }}
            >
              Run a scan first from the home page.
            </p>
          </div>
        )}

        {/* Scan history table */}
        {data && (
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-mono)",
                marginBottom: "16px",
              }}
            >
              {data.searches.length} scan{data.searches.length !== 1 ? "s" : ""} on
              record for &ldquo;{data.username}&rdquo;
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                background: "var(--color-border)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 120px 80px",
                  padding: "12px 18px",
                  background: "var(--color-surface)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span>Username</span>
                <span>Found</span>
                <span>Date</span>
                <span></span>
              </div>

              {/* Data rows */}
              {data.searches.map((scan, i) => (
                <div
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 100px 120px 80px",
                    padding: "14px 18px",
                    background:
                      i % 2 === 0 ? "var(--color-base)" : "var(--color-surface-raised)",
                    fontSize: "12px",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "background 0.1s ease",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text)",
                      fontWeight: 500,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    @{data.username}
                  </span>
                  <span
                    style={{
                      color: "var(--color-accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {scan.results.length} / 480
                  </span>
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {formatDate(scan.created_at)}
                  </span>
                  <span
                    style={{
                      color: "var(--color-accent)",
                      textAlign: "right",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    view →
                  </span>
                </div>
              ))}
            </div>

            {/* Selected scan results */}
            {selectedScan && (
              <div style={{ marginTop: "32px" }}>
                <ScanResults
                  username={data.username}
                  results={selectedScan.results}
                  scannedCount={selectedScan.results.length}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
