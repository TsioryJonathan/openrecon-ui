import { createHmac } from "node:crypto";

/**
 * HMAC-signed identity assertion for the trusted UI proxy.
 *
 * The API never trusts a bare `X-User-Id` header: the proxy also sends an
 * expiry and an HMAC over `"{userId}:{exp}"` keyed with `USER_SIGNING_SECRET`.
 * The API verifies the signature (constant-time) and the expiry window before
 * treating the header as authenticated identity.
 */

/** Lifetime of an identity assertion, in seconds. */
export const IDENTITY_TTL_SECONDS = 300;

/** Allowed clock skew when validating `exp`, in seconds. */
export const IDENTITY_CLOCK_SKEW_SECONDS = 30;

export interface IdentityAssertion {
  userId: string;
  /** Unix timestamp (seconds) after which the assertion must be rejected. */
  exp: number;
  /** Hex-encoded HMAC-SHA256 over `"{userId}:{exp}"`. */
  sig: string;
}

/** Headers injected on server-to-server requests to the investigations API. */
export const IDENTITY_HEADERS = {
  userId: "X-User-Id",
  userExp: "X-User-Exp",
  userSig: "X-User-Sig",
} as const;

/**
 * Sign a user identity for forwarding to the API.
 *
 * Pure function of (userId, secret, now) so tests can pin timestamps.
 */
export function signIdentity(
  userId: string,
  secret: string,
  now: number = Math.floor(Date.now() / 1000)
): IdentityAssertion {
  const exp = now + IDENTITY_TTL_SECONDS;
  const sig = createHmac("sha256", secret).update(`${userId}:${exp}`).digest("hex");
  return { userId, exp, sig };
}
