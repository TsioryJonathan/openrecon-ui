"use client";

interface ScanStateProps {
  username: string;
}

export function ScanState({ username }: ScanStateProps) {
  return (
    <div style={{ padding: "2rem 0" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.14em",
          color: "var(--accent)",
          marginBottom: "1.25rem",
          animation: "scan-pulse 1.5s ease-in-out infinite",
        }}
      >
        RECON IN PROGRESS
      </p>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "1.1rem",
          color: "var(--text)",
          marginBottom: "1.75rem",
        }}
      >
        @{username}
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "1px",
          background: "var(--border-subtle)",
          position: "relative",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
        role="progressbar"
        aria-label="Scanning platforms"
        aria-valuetext="Scanning in progress"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "60%",
            height: "100%",
            background: "var(--accent)",
            animation: "shimmer 1.6s ease-in-out infinite",
          }}
        />
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--text-dim)",
        }}
      >
        Scanning 480+ platforms — this may take a moment.
      </p>
    </div>
  );
}
