import { describe, expect, it } from "vitest";

import {
  IDENTITY_TTL_SECONDS,
  IDENTITY_HEADERS,
  signIdentity,
} from "@/lib/identity";

/**
 * Fixed cross-language vector generated once with Node's crypto and mirrored
 * in openrecon-api/tests/test_auth.py. If either implementation changes its
 * input format, one of the two suites fails.
 */
const VECTOR = {
  secret: "openrecon-test-secret",
  userId: "user_abc123",
  exp: 1790000000,
  sig: "d7a9d3f0fe88e716ea2df88e33763bd5722641b6b2c0f6125d7273448fc2ba82",
};

describe("signIdentity", () => {
  it("produces the shared cross-language vector", () => {
    // signIdentity computes exp = now + TTL, so pick now to hit VECTOR.exp.
    const now = VECTOR.exp - IDENTITY_TTL_SECONDS;
    const assertion = signIdentity(VECTOR.userId, VECTOR.secret, now);
    expect(assertion.exp).toBe(VECTOR.exp);
    expect(assertion.sig).toBe(VECTOR.sig);
  });

  it("expires IDENTITY_TTL_SECONDS after now", () => {
    const assertion = signIdentity("u1", "s", 1000);
    expect(assertion.exp).toBe(1000 + IDENTITY_TTL_SECONDS);
  });

  it("changes the signature when the user id changes", () => {
    const a = signIdentity("user_a", "s", 1000);
    const b = signIdentity("user_b", "s", 1000);
    expect(a.sig).not.toBe(b.sig);
  });

  it("changes the signature when the secret changes", () => {
    const a = signIdentity("user_a", "s1", 1000);
    const b = signIdentity("user_a", "s2", 1000);
    expect(a.sig).not.toBe(b.sig);
  });

  it("emits a hex sha256 digest (64 chars)", () => {
    const { sig } = signIdentity("user_a", "s", 1000);
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("IDENTITY_HEADERS", () => {
  it("matches the header names the API reads", () => {
    expect(IDENTITY_HEADERS.userId).toBe("X-User-Id");
    expect(IDENTITY_HEADERS.userExp).toBe("X-User-Exp");
    expect(IDENTITY_HEADERS.userSig).toBe("X-User-Sig");
  });
});
