"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { ActionButton, Divider, TextInput } from "@/components/ui";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      if (isSignup) {
        const { error: signUpError } = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        if (signUpError) {
          setError(signUpError.message ?? "Could not create the account.");
          return;
        }
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(signInError.message ?? "Could not sign in.");
          return;
        }
      }
      router.push("/investigations");
      router.refresh();
    } catch {
      setError(isSignup ? "Something went wrong while signing up." : "Something went wrong while signing in.");
    } finally {
      setPending(false);
    }
  }

  async function handleGithub() {
    setError(null);
    const { error: socialError } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/investigations",
    });
    if (socialError) {
      setError(socialError.message ?? "Could not sign in with GitHub.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      {isSignup && (
        <TextInput
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
      )}
      <TextInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <TextInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={isSignup ? "new-password" : "current-password"}
        minLength={8}
        required
      />

      {error && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            color: "var(--accent)",
          }}
        >
          {error}
        </p>
      )}

      <ActionButton type="submit" loading={pending} loadingText="Please wait…">
        {isSignup ? "Create account →" : "Sign in →"}
      </ActionButton>

      <Divider style={{ margin: "0.25rem 0" }} />

      <button
        type="button"
        onClick={handleGithub}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--text)",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          padding: "0 1.25rem",
          height: "40px",
          cursor: "pointer",
          transition: "all var(--t-base)",
        }}
        className="hover:border-[var(--text-dim)]"
      >
        <GithubMark />
        Continue with GitHub
      </button>
    </form>
  );
}

function GithubMark() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.09 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.35.95.1-.74.4-1.25.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.3-.52-1.48.12-3.08 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.64 1.6.24 2.78.12 3.08.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.35.77 1.05.77 2.12v3.14c0 .3.21.67.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}