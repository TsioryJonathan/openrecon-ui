import { cn } from "@/lib/utils";

interface ToolPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function ToolPage({
  eyebrow,
  title,
  description,
  children,
  actions,
  className,
}: ToolPageProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "7rem",
        paddingBottom: "5rem",
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "7rem 2rem 5rem",
      }}
      className={cn(className)}
    >
      {/* Tool header */}
      <div
        style={{
          marginBottom: "3rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            color: "var(--accent)",
          }}
        >
          {eyebrow}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                lineHeight: 1.1,
                marginBottom: "0.5rem",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                maxWidth: "52ch",
              }}
            >
              {description}
            </p>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border-subtle)", marginBottom: "2.5rem" }} />

      {children}
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return (
    <div
      style={{ borderTop: "1px solid var(--border-subtle)" }}
      className={cn("my-6", className)}
    />
  );
}

// ─── Label / Value pair ───────────────────────────────────────────────────────

interface DataFieldProps {
  label: string;
  value?: string | number | boolean | null;
  mono?: boolean;
  children?: React.ReactNode;
}

export function DataField({ label, value, mono = false, children }: DataFieldProps) {
  const displayValue = children ?? (value === null || value === undefined ? "—" : String(value));
  const isEmpty = !children && (value === null || value === undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          color: "var(--text-dim)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
          fontSize: mono ? "0.8rem" : "0.875rem",
          color: isEmpty ? "var(--text-dim)" : "var(--text)",
          lineHeight: 1.5,
          wordBreak: "break-all",
        }}
      >
        {displayValue}
      </p>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

interface RequestErrorProps {
  message: string;
  onRetry?: () => void;
}

export function RequestError({ message, onRetry }: RequestErrorProps) {
  return (
    <div
      style={{
        padding: "2rem",
        border: "1px solid var(--border-subtle)",
        borderLeft: "2px solid rgba(231,80,80,0.5)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "rgba(231,80,80,0.8)",
          marginBottom: "0.5rem",
        }}
      >
        REQUEST FAILED
      </p>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.875rem",
          marginBottom: onRetry ? "1.25rem" : 0,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            padding: "0.4rem 0.8rem",
            cursor: "pointer",
            background: "transparent",
            transition: "all 0.15s",
          }}
          className="hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          RETRY
        </button>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ padding: "3rem 0" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "var(--text-dim)",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </p>
      {description && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse", className)}
      style={{
        background: "var(--surface-raised)",
        borderRadius: "2px",
      }}
    />
  );
}

// ─── Tag / Badge ──────────────────────────────────────────────────────────────

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.6rem",
        letterSpacing: "0.1em",
        color: "var(--text-dim)",
        border: "1px solid var(--border-subtle)",
        padding: "0.2rem 0.5rem",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

// ─── Primary button ───────────────────────────────────────────────────────────

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export function ActionButton({
  children,
  loading,
  loadingText,
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        background: "var(--accent)",
        color: "#09090B",
        fontFamily: "var(--font-sans)",
        fontSize: "0.8rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "0 1.25rem",
        height: "40px",
        border: "none",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "opacity 0.15s",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        flexShrink: 0,
      }}
      className="hover:opacity-80"
      {...props}
    >
      {loading ? (loadingText ?? "Loading…") : children}
    </button>
  );
}

// ─── Text input ───────────────────────────────────────────────────────────────

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
}

export function TextInput({ prefix, className, ...props }: TextInputProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        flex: 1,
        minWidth: 0,
      }}
    >
      {prefix && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--text-dim)",
            padding: "0 0 0 1rem",
            userSelect: "none",
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
          fontSize: "0.875rem",
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
