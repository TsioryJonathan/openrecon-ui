import { cn } from "@/lib/utils";
import { AlertCircle, RotateCcw, ChevronDown, ChevronRight } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

// ─── ToolPage ────────────────────────────────────────────────────────────────
// Main wrapper for every instrument page.

interface ToolPageProps {
  eyebrow: string;           // e.g. "SHERLOCK / IDENTITY"
  title: string;             // e.g. "Username reconnaissance"
  description: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ToolPage({
  eyebrow,
  title,
  description,
  icon,
  children,
  actions,
  className,
}: ToolPageProps) {
  return (
    <div
      className={cn(className)}
      style={{
        minHeight: "100vh",
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "6.5rem 2rem 5rem",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "2.5rem" }}>
        {/* Eyebrow */}
        <p className="t-label" style={{ marginBottom: "1.25rem", color: "var(--accent)" }}>
          {eyebrow}
        </p>

        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            {icon && (
              <span style={{ color: "var(--text-dim)", flexShrink: 0, marginTop: "2px" }}>
                {icon}
              </span>
            )}
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "var(--text)",
                  lineHeight: 1.1,
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--text-muted)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.65,
                  maxWidth: "56ch",
                }}
              >
                {description}
              </p>
            </div>
          </div>

          {actions && (
            <div style={{ flexShrink: 0, paddingTop: "0.25rem" }}>
              {actions}
            </div>
          )}
        </div>
      </header>

      {/* Separator */}
      <div className="divider" style={{ marginBottom: "2.5rem" }} />

      {/* Content */}
      {children}
    </div>
  );
}

// ─── SectionHeader ───────────────────────────────────────────────────────────
// Label for a data section within a result panel.

interface SectionHeaderProps {
  label: string;
  count?: number;
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionHeader({ label, count, icon, action }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {icon && (
          <span style={{ color: "var(--text-dim)" }}>{icon}</span>
        )}
        <p className="t-label">{label}</p>
        {count !== undefined && (
          <span
            className="t-mono"
            style={{
              fontSize: "var(--text-2xs)",
              color: "var(--text-dim)",
              marginLeft: "0.25rem",
            }}
          >
            {count}
          </span>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("divider", className)}
      style={{ margin: "1.75rem 0", ...style }}
    />
  );
}

// ─── AccordionSection ────────────────────────────────────────────────────────
// Collapsible section with clickable header - used for grouped results.

interface AccordionSectionProps {
  label: string;
  count?: number;
  icon?: ReactNode;
  defaultOpen?: boolean;
  headerRight?: ReactNode;
  children: ReactNode;
}

export function AccordionSection({
  label,
  count,
  icon,
  defaultOpen = false,
  headerRight,
  children,
}: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0.7rem 0",
          textAlign: "left",
        }}
      >
        <span style={{ color: "var(--text-dim)", display: "flex", flexShrink: 0 }}>
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
        {icon && (
          <span style={{ color: "var(--accent)", display: "flex", flexShrink: 0 }}>
            {icon}
          </span>
        )}
        <span
          className="t-label"
          style={{ color: "var(--accent)", letterSpacing: "0.12em" }}
        >
          {label}
        </span>
        {count !== undefined && (
          <span
            className="t-label"
            style={{ color: "var(--text-dim)", marginLeft: "0.25rem" }}
          >
            {count}
          </span>
        )}
        {headerRight && (
          <span style={{ marginLeft: "auto" }}>{headerRight}</span>
        )}
      </button>
      {open && <div style={{ paddingBottom: "0.75rem" }}>{children}</div>}
    </div>
  );
}

// ─── DataField ───────────────────────────────────────────────────────────────
// Label + value pair used in investigation sheets.

interface DataFieldProps {
  label: string;
  value?: string | number | boolean | null;
  mono?: boolean;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function DataField({
  label,
  value,
  mono = false,
  children,
  size = "md",
}: DataFieldProps) {
  const displayValue = children ?? (value === null || value === undefined ? "-" : String(value));
  const isEmpty = !children && (value === null || value === undefined);

  const valueSizes = {
    sm: "var(--text-sm)",
    md: mono ? "var(--text-sm)" : "var(--text-base)",
    lg: "var(--text-xl)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <p className="t-label">{label}</p>
      <div
        style={{
          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
          fontSize: valueSizes[size],
          color: isEmpty ? "var(--text-dim)" : "var(--text)",
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {displayValue}
      </div>
    </div>
  );
}

// ─── RequestError ─────────────────────────────────────────────────────────────

interface RequestErrorProps {
  message: string;
  onRetry?: () => void;
}

export function RequestError({ message, onRetry }: RequestErrorProps) {
  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid var(--border-subtle)",
        borderLeft: "2px solid var(--error)",
        background: "var(--error-dim)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <AlertCircle size={13} style={{ color: "var(--error)", flexShrink: 0 }} />
        <p className="t-label" style={{ color: "var(--error)" }}>
          REQUEST FAILED
        </p>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--text-muted)",
          fontSize: "var(--text-sm)",
          marginBottom: onRetry ? "1.25rem" : 0,
          lineHeight: 1.55,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <GhostButton onClick={onRetry} icon={<RotateCcw size={12} />}>
          Retry
        </GhostButton>
      )}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div style={{ padding: "2.5rem 0" }}>
      <p className="t-label" style={{ marginBottom: "0.5rem" }}>
        {title}
      </p>
      {description && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-muted)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ className, width, height, style }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      style={{
        width,
        height,
        borderRadius: "2px",
        ...style,
      }}
    />
  );
}

// ─── SkeletonLine ─────────────────────────────────────────────────────────────
// Quick skeleton text line with configurable width

export function SkeletonLine({ width = "100%", height = "12px" }: { width?: string; height?: string }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: "2px" }}
    />
  );
}

// ─── ActionButton ─────────────────────────────────────────────────────────────
// Primary CTA button - amber fill.

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
}

export function ActionButton({
  children,
  loading,
  loadingText,
  disabled,
  icon,
  ...props
}: ActionButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      style={{
        background: "var(--accent)",
        color: "#09090B",
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-xs)",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "0 1.25rem",
        height: "40px",
        border: "none",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.55 : 1,
        transition: "opacity var(--t-base)",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        flexShrink: 0,
      }}
      className={!isDisabled ? "hover:opacity-80" : ""}
      {...props}
    >
      {icon && !loading && icon}
      {loading ? (loadingText ?? "Loading…") : children}
    </button>
  );
}

// ─── GhostButton ─────────────────────────────────────────────────────────────
// Secondary / outline button.

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  active?: boolean;
}

export function GhostButton({ children, icon, active, disabled, ...props }: GhostButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-2xs)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: active ? "var(--accent)" : "var(--text-muted)",
        border: active
          ? "1px solid var(--accent)"
          : "1px solid var(--border)",
        background: active ? "var(--accent-dim)" : "transparent",
        padding: "0.35rem 0.75rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all var(--t-base)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        whiteSpace: "nowrap",
      }}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
}

// ─── IconButton ───────────────────────────────────────────────────────────────
// Minimal icon-only action button.

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;  // always required for accessibility
  active?: boolean;
}

export function IconButton({ children, label, active, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        color: active ? "var(--accent)" : "var(--text-dim)",
        cursor: "pointer",
        padding: "0.3rem",
        transition: "color var(--t-base)",
        flexShrink: 0,
      }}
      className="hover:text-[var(--text)]"
      {...props}
    >
      {children}
    </button>
  );
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: number;
}

export function CopyButton({ text, label = "Copy", size = 13 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <IconButton
      label={copied ? "Copied" : label}
      active={copied}
      onClick={handleCopy}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </IconButton>
  );
}

// ─── ExternalLinkButton ───────────────────────────────────────────────────────

import { ExternalLink } from "lucide-react";

interface ExternalLinkButtonProps {
  href: string;
  label?: string;
  size?: number;
}

export function ExternalLinkButton({
  href,
  label = "Open link",
  size = 13,
}: ExternalLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in new tab)`}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-dim)",
        padding: "0.3rem",
        transition: "color var(--t-base)",
        flexShrink: 0,
      }}
      className="hover:text-[var(--accent)]"
    >
      <ExternalLink size={size} />
    </a>
  );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────

interface TagProps {
  children: ReactNode;
  variant?: "default" | "accent" | "dim";
}

export function Tag({ children, variant = "default" }: TagProps) {
  const colors = {
    default: { color: "var(--text-dim)", border: "var(--border-subtle)" },
    accent:  { color: "var(--accent)",   border: "var(--accent)" },
    dim:     { color: "var(--text-dim)", border: "transparent" },
  };

  return (
    <span
      className="t-label"
      style={{
        color: colors[variant].color,
        border: `1px solid ${colors[variant].border}`,
        padding: "0.18rem 0.45rem",
        display: "inline-block",
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}

// ─── TextInput ────────────────────────────────────────────────────────────────

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
}

export function TextInput({ prefix, ...props }: TextInputProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        flex: 1,
        minWidth: 0,
        transition: "border-color var(--t-base)",
      }}
      className="focus-within:border-[var(--text-dim)]"
    >
      {prefix && (
        <span
          className="t-mono"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-dim)",
            paddingLeft: "1rem",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          {prefix}
        </span>
      )}
      <input
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--text)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-sm)",
          padding: "0 1rem",
          height: "40px",
          width: "100%",
          minWidth: 0,
        }}
        {...props}
      />
    </div>
  );
}

// ─── StatusIndicator ──────────────────────────────────────────────────────────

interface StatusIndicatorProps {
  value: boolean | null | undefined;
  trueLabel?: string;
  falseLabel?: string;
  nullLabel?: string;
}

export function StatusIndicator({
  value,
  trueLabel = "YES",
  falseLabel = "NO",
  nullLabel = "-",
}: StatusIndicatorProps) {
  if (value === null || value === undefined) {
    return (
      <span className="t-mono" style={{ fontSize: "var(--text-xs)", color: "var(--text-dim)" }}>
        {nullLabel}
      </span>
    );
  }

  return (
    <span
      className="t-mono"
      style={{
        fontSize: "var(--text-xs)",
        color: value ? "var(--accent)" : "var(--text-muted)",
        fontWeight: value ? 600 : 400,
      }}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────
// Horizontal scrollable filter pills - used in Sherlock, Dorks, etc.

interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  options: FilterOption[];
  active: string;
  onChange: (key: string) => void;
  ariaLabel?: string;
}

export function FilterBar({ options, active, onChange, ariaLabel }: FilterBarProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel ?? "Filter options"}
      style={{
        display: "flex",
        gap: "0.35rem",
        flexWrap: "wrap",
      }}
    >
      {options.map((opt) => (
        <GhostButton
          key={opt.key}
          active={active === opt.key}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span style={{ opacity: 0.6, marginLeft: "0.2rem" }}>{opt.count}</span>
          )}
        </GhostButton>
      ))}
    </div>
  );
}

// ─── InlineLink ───────────────────────────────────────────────────────────────
// Internal nav link with arrow style.

import Link from "next/link";

interface InlineLinkProps {
  href: string;
  children: ReactNode;
  direction?: "forward" | "back";
}

export function InlineLink({ href, children, direction = "forward" }: InlineLinkProps) {
  return (
    <Link
      href={href}
      className="t-label hover:text-[var(--accent)]"
      style={{
        color: "var(--text-dim)",
        transition: "color var(--t-base)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
      }}
    >
      {direction === "back" && "←"} {children} {direction === "forward" && "→"}
    </Link>
  );
}
