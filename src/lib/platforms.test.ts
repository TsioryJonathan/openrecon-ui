import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  PLATFORM_COUNT_FALLBACK,
  getTotalPlatforms,
  platformCountLabel,
} from "./platforms";

describe("platformCountLabel", () => {
  it("formats a plural count", () => {
    expect(platformCountLabel(480)).toBe("480 platforms");
    expect(platformCountLabel(481)).toBe("481 platforms");
  });

  it("formats a singular count", () => {
    expect(platformCountLabel(1)).toBe("1 platform");
  });

  it("falls back for zero, negative and non-finite values", () => {
    const expected = `${PLATFORM_COUNT_FALLBACK} platforms`;
    expect(platformCountLabel(0)).toBe(expected);
    expect(platformCountLabel(-3)).toBe(expected);
    expect(platformCountLabel(NaN)).toBe(expected);
    expect(platformCountLabel(Infinity)).toBe(expected);
  });
});

describe("getTotalPlatforms", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the API total when the catalog loads", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ categories: [], total: 512 }),
      text: async () => "",
    } as Response);
    await expect(getTotalPlatforms()).resolves.toBe(512);
  });

  it("falls back when the API is unreachable", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    await expect(getTotalPlatforms()).resolves.toBe(PLATFORM_COUNT_FALLBACK);
  });

  it("falls back when the API errors", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ detail: "unavailable" }),
      text: async () => "",
    } as Response);
    await expect(getTotalPlatforms()).resolves.toBe(PLATFORM_COUNT_FALLBACK);
  });
});
