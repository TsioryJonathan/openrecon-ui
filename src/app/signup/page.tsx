import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create an OpenRecon account to work on investigations.",
};

export default function SignupPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6.5rem 2rem 5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <p
          className="t-label"
          style={{ marginBottom: "1.25rem", color: "var(--accent)" }}
        >
          OPENRECON / AUTH
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            color: "var(--text)",
            marginBottom: "1.5rem",
          }}
        >
          Create account
        </h1>
        <AuthForm mode="signup" />
        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}