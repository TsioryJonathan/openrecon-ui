"use client";

import { useEffect, useRef } from "react";

/** Actions available from a graph target node. */
export type NodeAction = "scan" | "adaptive" | "correlate";

const ITEMS: { action: NodeAction; label: string }[] = [
  { action: "scan", label: "Scan" },
  { action: "adaptive", label: "Adaptive scan" },
  { action: "correlate", label: "Correlate" },
];

interface NodeActionsMenuProps {
  targetLabel: string;
  position: { x: number; y: number };
  /** Action currently running; all items are disabled while set. */
  busy: NodeAction | null;
  error?: string | null;
  onAction: (action: NodeAction) => void;
  onClose: () => void;
}

/**
 * Context menu for a graph target node: targeted scan, adaptive expansion
 * and correlation. Closes on Escape or outside click.
 */
export function NodeActionsMenu({
  targetLabel,
  position,
  busy,
  error,
  onAction,
  onClose,
}: NodeActionsMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={`Actions for ${targetLabel}`}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 1000,
        minWidth: 170,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        padding: "0.25rem 0",
      }}
      className="animate-fade-in"
    >
      <p
        className="t-label"
        style={{
          padding: "0.4rem 0.75rem 0.25rem",
          color: "var(--text-dim)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {targetLabel}
      </p>
      {ITEMS.map(({ action, label }) => (
        <button
          key={action}
          type="button"
          role="menuitem"
          disabled={busy !== null}
          onClick={() => onAction(action)}
          style={{
            textAlign: "left",
            background: "transparent",
            border: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text)",
            padding: "0.45rem 0.75rem",
            cursor: busy !== null ? "not-allowed" : "pointer",
            opacity: busy !== null ? 0.5 : 1,
          }}
          className="hover:bg-[var(--surface-raised)]"
        >
          {busy === action ? `${label}…` : label}
        </button>
      ))}
      {error && (
        <p
          role="alert"
          style={{
            padding: "0.35rem 0.75rem",
            fontSize: "var(--text-2xs)",
            color: "var(--danger, #f87171)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
