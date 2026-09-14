"use client";

import type { ResultItem } from "@/types/api";

interface ScanResultsProps {
  username: string;
  results: ResultItem[];
  scannedCount: number;
  duration?: number;
}

const CATEGORY_MAP: Record<string, string[]> = {
  "Social Media": ["Instagram", "Twitter", "TikTok", "Reddit", "Snapchat", "Pinterest", "Tumblr", "VK", "Bluesky", "Myspace", "threads", "9GAG", "Imgur", "Giphy"],
  "Developer": ["GitHub", "GitLab", "BitBucket", "HackerNews", "HackerOne", "HackerRank", "LeetCode", "Codepen", "Replit.com", "Docker Hub", "npm", "PyPi", "Kaggle", "Hugging Face"],
  "Creative": ["DeviantArt", "ArtStation", "Behance", "Dribbble", "Flickr", "VSCO", "Unsplash", "Wattpad", "Letterboxd", "MyAnimeList"],
  "Gaming": ["Steam Community (User)", "Roblox", "Twitch", "Itch.io", "Xbox Gamertag", "Speedrun.com", "osu!"],
  "Music": ["SoundCloud", "Bandcamp", "Spotify", "last.fm", "MixCloud"],
  "Professional": ["LinkedIn", "Patreon", "ProductHunt", "Gravatar", "About.me", "Linktree"],
  "Other": [],
};

function categorizeResults(results: ResultItem[]) {
  const buckets: Record<string, ResultItem[]> = {};

  for (const result of results) {
    let placed = false;
    for (const [cat, sites] of Object.entries(CATEGORY_MAP)) {
      if (cat === "Other") continue;
      if (sites.includes(result.site)) {
        if (!buckets[cat]) buckets[cat] = [];
        buckets[cat].push(result);
        placed = true;
        break;
      }
    }
    if (!placed) {
      if (!buckets["Other"]) buckets["Other"] = [];
      buckets["Other"].push(result);
    }
  }

  return Object.entries(buckets).filter(([, items]) => items.length > 0);
}

export default function ScanResults({
  username,
  results,
  scannedCount,
  duration,
}: ScanResultsProps) {
  const found = results.length;
  const missed = scannedCount - found;
  const categorized = categorizeResults(results);

  return (
    <article style={{ fontFamily: "var(--font-body)" }}>
      {/* Headline section */}
      <div
        style={{
          borderBottom: "2px solid var(--color-ink)",
          paddingBottom: "20px",
          marginBottom: "28px",
        }}
      >
        {/* Kicker */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-muted)",
            marginBottom: "8px",
            letterSpacing: "0.04em",
          }}
        >
          Scan complete
          {duration !== undefined && ` · ${duration.toFixed(1)}s`}
          {" · "}
          {scannedCount} platforms checked
        </p>

        {/* Big headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 7vw, 80px)",
            fontWeight: 700,
            lineHeight: 1.05,
            color: found > 0 ? "var(--color-ink)" : "var(--color-muted)",
            marginBottom: "12px",
            fontOpticalSizing: "auto",
          } as React.CSSProperties}
        >
          {found > 0 ? (
            <>
              {found} profile{found !== 1 ? "s" : ""} found
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "0.7em",
                  color: "var(--color-ink-soft)",
                }}
              >
                for &ldquo;{username}&rdquo;
              </span>
            </>
          ) : (
            <>No profiles found for &ldquo;{username}&rdquo;</>
          )}
        </h1>

        {/* Sub stats */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
          }}
        >
          <span style={{ color: "var(--color-found)" }}>
            {found} matched
          </span>
          <span style={{ color: "var(--color-muted)" }}>
            {missed} not found
          </span>
        </div>
      </div>

      {/* Results columns */}
      {found > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0",
            border: "1px solid var(--color-rule)",
          }}
        >
          {categorized.map(([category, items]) => (
            <div
              key={category}
              style={{
                borderRight: "1px solid var(--color-rule)",
                borderBottom: "1px solid var(--color-rule)",
                padding: "16px 20px",
              }}
            >
              {/* Column header */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: "var(--color-ink-soft)",
                  marginBottom: "12px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid var(--color-rule)",
                  fontOpticalSizing: "auto",
                } as React.CSSProperties}
              >
                {category}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    color: "var(--color-muted)",
                    marginLeft: "8px",
                  }}
                >
                  {items.length}
                </span>
              </h2>

              {/* Site list */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {items.map((item) => (
                  <li key={item.site}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        textDecoration: "none",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--color-ink)",
                          marginBottom: "2px",
                        }}
                      >
                        {item.site}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          color: "var(--color-found)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.url}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {found === 0 && (
        <div
          style={{
            padding: "48px 0",
            textAlign: "center",
            color: "var(--color-muted)",
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontStyle: "italic",
          }}
        >
          No trace found on the scanned platforms.
          <br />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontStyle: "normal",
              display: "block",
              marginTop: "8px",
            }}
          >
            Try scanning more categories or check the username spelling.
          </span>
        </div>
      )}
    </article>
  );
}
