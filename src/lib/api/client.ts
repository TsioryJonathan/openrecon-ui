import type {
  SitesResponse,
  SearchResponse,
  GetResultsResponse,
  MessageResponse,
  DorkGenerateResponse,
  ExifResponse,
  ReconResponse,
  ApiError,
} from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    const err: ApiError = { status: res.status, detail };
    throw err;
  }

  return res.json() as Promise<T>;
}

// ─── Sherlock ─────────────────────────────────────────────────────────────────

export async function getSites(): Promise<SitesResponse> {
  return request<SitesResponse>("/api/sherlock/sites");
}

export async function searchUsername(
  username: string,
  sites: string[]
): Promise<SearchResponse> {
  return request<SearchResponse>("/api/sherlock/search", {
    method: "POST",
    body: JSON.stringify({ username, sites }),
  });
}

export async function getSherlockResults(
  username: string
): Promise<GetResultsResponse | MessageResponse> {
  return request<GetResultsResponse | MessageResponse>(
    `/api/sherlock/results?username=${encodeURIComponent(username)}`
  );
}

// ─── Dork ─────────────────────────────────────────────────────────────────────

export async function generateDorks(
  target: string
): Promise<DorkGenerateResponse> {
  return request<DorkGenerateResponse>("/api/dork/generate", {
    method: "POST",
    body: JSON.stringify({ target }),
  });
}

// ─── EXIF ─────────────────────────────────────────────────────────────────────

export async function extractExif(file: File): Promise<ExifResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/api/exif/extract`, {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type header — browser sets it with boundary
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore
    }
    const err: ApiError = { status: res.status, detail };
    throw err;
  }

  return res.json() as Promise<ExifResponse>;
}

// ─── Recon ────────────────────────────────────────────────────────────────────

export async function reconQuery(query: string): Promise<ReconResponse> {
  return request<ReconResponse>(
    `/api/recon?query=${encodeURIComponent(query)}`
  );
}
