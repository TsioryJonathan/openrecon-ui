"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function AuthStatus() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const linkBase: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-2xs)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0.35rem 0.6rem",
  };

  if (isPending) {
    return (
      <span
        style={{
          ...linkBase,
          color: "var(--text-dim)",
        }}
      >
        Loading
      </span>
    );
  }

  if (!session) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <Link
          href="/login"
          className="t-mono hover:text-[var(--text)]"
          style={{ ...linkBase, color: "var(--text-muted)" }}
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="t-mono hover:opacity-80"
          style={{
            ...linkBase,
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            background: "var(--accent-dim)",
          }}
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.35rem 0 0.35rem 0.75rem",
        borderLeft: "1px solid var(--border-subtle)",
      }}
    >
      <span
        className="t-mono"
        style={{
          fontSize: "var(--text-2xs)",
          color: "var(--text-muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          maxWidth: "12rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {session.user.email}
      </span>
      <button
        type="button"
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
          router.refresh();
        }}
        className="t-mono hover:text-[var(--accent)]"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-dim)",
          fontSize: "var(--text-2xs)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "0.35rem 0.6rem",
          cursor: "pointer",
          transition: "color var(--t-base)",
        }}
      >
        Sign out
      </button>
    </div>
  );
}