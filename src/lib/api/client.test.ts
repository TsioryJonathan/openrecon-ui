import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createInvestigation,
  getInvestigationReport,
  getSites,
  listInvestigations,
} from "./client";

const BASE = "http://localhost:8000";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response;
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getSites", () => {
  it("hits the public sherlock sites endpoint", async () => {
    const payload = { categories: [], total: 0 };
    fetchMock.mockResolvedValue(jsonResponse(payload));
    const out = await getSites();
    expect(out).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}/api/sherlock/sites`,
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });
});

describe("error handling", () => {
  it("throws the API detail message on non-ok responses", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ detail: "boom" }, 404));
    await expect(getSites()).rejects.toEqual({ status: 404, detail: "boom" });
  });

  it("falls back to an HTTP status label when the body is not JSON", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error("not json");
      },
      text: async () => "<html>bad gateway</html>",
    } as unknown as Response);
    await expect(getSites()).rejects.toEqual({
      status: 502,
      detail: "HTTP 502",
    });
  });
});

describe("investigations proxy", () => {
  it("listInvestigations goes through the same-origin proxy", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ investigations: [], total: 0 }));
    await listInvestigations("open", 10, 0);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/investigations?status=open&limit=10&offset=0");
    expect((init as RequestInit).method ?? "GET").toBe("GET");
  });

  it("createInvestigation posts JSON through the proxy", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "inv1" }));
    await createInvestigation("Case 1", "desc");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/investigations");
    expect((init as RequestInit).method).toBe("POST");
    expect((init as RequestInit).body).toBe(
      JSON.stringify({ name: "Case 1", description: "desc" })
    );
  });
});

describe("getInvestigationReport", () => {
  it("requests markdown and returns raw text", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "# Investigation: Case 1\n",
      json: async () => {
        throw new Error("should not parse json");
      },
    } as unknown as Response);

    const md = await getInvestigationReport("inv1");
    expect(md).toBe("# Investigation: Case 1\n");
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/investigations/inv1/report?format=markdown"
    );
  });

  it("defaults to markdown format", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "",
      json: async () => ({}),
    } as unknown as Response);
    await getInvestigationReport("inv9");
    expect(fetchMock.mock.calls[0][0]).toContain("format=markdown");
  });
});
