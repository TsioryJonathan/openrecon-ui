import type {
  SitesResponse,
  SearchResponse,
  GetResultsResponse,
  MessageResponse,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }

  return res.json();
}

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

export async function getResults(
  username: string
): Promise<GetResultsResponse | MessageResponse> {
  return request<GetResultsResponse | MessageResponse>(
    `/api/sherlock/results?username=${encodeURIComponent(username)}`
  );
}
