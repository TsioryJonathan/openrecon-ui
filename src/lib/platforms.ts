/**
 * Platform-count copy helpers.
 *
 * The catalog size comes from the API at runtime (cached by the Next.js data
 * cache); the static fallback only covers API-unavailable renders so copy
 * never lies about the catalog.
 */
export const PLATFORM_COUNT_FALLBACK = 480;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function platformCountLabel(total: number): string {
  if (!Number.isFinite(total) || total <= 0) {
    return `${PLATFORM_COUNT_FALLBACK} platforms`;
  }
  return total === 1 ? "1 platform" : `${total} platforms`;
}

/** Total platform count from the API, with a static fallback on failure. */
export async function getTotalPlatforms(): Promise<number> {
  try {
    const res = await fetch(`${BASE_URL}/api/sherlock/sites`, {
      cache: "force-cache",
    });
    if (!res.ok) return PLATFORM_COUNT_FALLBACK;
    const data = (await res.json()) as { total?: unknown };
    return typeof data.total === "number" ? data.total : PLATFORM_COUNT_FALLBACK;
  } catch {
    return PLATFORM_COUNT_FALLBACK;
  }
}
