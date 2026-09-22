import type {
  SitesResponse,
  SearchResponse,
  GetResultsResponse,
  MessageResponse,
  DorkGenerateResponse,
  ExifResponse,
  ReconResponse,
  ApiError,
  InvestigationListResponse,
  InvestigationSummaryResponse,
  InvestigationScanResponse,
  InvestigationTargetFindingsResponse,
  InvestigationRelationsResponse,
  AdaptiveScanResponse,
  CorrelationResponse,
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
    // Do NOT set Content-Type header - browser sets it with boundary
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

// ─── Investigations ─────────────────────────────────────────────────────────

export async function listInvestigations(
  status?: string,
  limit = 50,
  offset = 0
): Promise<InvestigationListResponse> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  return request<InvestigationListResponse>(
    `/api/investigations?${params.toString()}`
  );
}

export async function createInvestigation(
  name: string,
  description?: string
): Promise<InvestigationSummaryResponse> {
  return request<InvestigationSummaryResponse>("/api/investigations", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function getInvestigation(
  id: string
): Promise<InvestigationSummaryResponse> {
  return request<InvestigationSummaryResponse>(
    `/api/investigations/${id}`
  );
}

export async function addTargetToInvestigation(
  investigationId: string,
  targetType: string,
  targetValue: string,
  role?: string
): Promise<InvestigationSummaryResponse> {
  return request<InvestigationSummaryResponse>(
    `/api/investigations/${investigationId}/targets`,
    {
      method: "POST",
      body: JSON.stringify({
        target_type: targetType,
        target_value: targetValue,
        role,
      }),
    }
  );
}

export async function scanInInvestigation(
  investigationId: string,
  targetType: string,
  targetValue: string,
  options?: Record<string, unknown>,
  role?: string
): Promise<InvestigationScanResponse> {
  return request<InvestigationScanResponse>(
    `/api/investigations/${investigationId}/scan`,
    {
      method: "POST",
      body: JSON.stringify({
        target_type: targetType,
        target_value: targetValue,
        options,
        role,
      }),
    }
  );
}

export async function getTargetFindings(
  investigationId: string,
  targetId: string
): Promise<InvestigationTargetFindingsResponse> {
  return request<InvestigationTargetFindingsResponse>(
    `/api/investigations/${investigationId}/targets/${targetId}/findings`
  );
}

export async function getInvestigationRelations(
  investigationId: string
): Promise<InvestigationRelationsResponse> {
  return request<InvestigationRelationsResponse>(
    `/api/investigations/${investigationId}/relations`
  );
}

export async function getInvestigationReport(
  investigationId: string,
  format: "json" | "markdown" = "markdown"
): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/api/investigations/${investigationId}/report?format=${format}`
  );

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

  return res.text();
}

export async function adaptiveScanInInvestigation(
  investigationId: string,
  targetType: string,
  targetValue: string,
  maxDepth = 2,
  options?: Record<string, unknown>,
  role?: string
): Promise<AdaptiveScanResponse> {
  const params = new URLSearchParams();
  params.set("max_depth", String(maxDepth));
  return request<AdaptiveScanResponse>(
    `/api/investigations/${investigationId}/adaptive-scan?${params.toString()}`,
    {
      method: "POST",
      body: JSON.stringify({
        target_type: targetType,
        target_value: targetValue,
        options,
        role,
      }),
    }
  );
}

export async function correlateInvestigation(
  investigationId: string
): Promise<CorrelationResponse> {
  return request<CorrelationResponse>(
    `/api/investigations/${investigationId}/correlate`,
    { method: "POST" }
  );
}

export async function closeInvestigation(
  id: string
): Promise<InvestigationSummaryResponse> {
  return request<InvestigationSummaryResponse>(
    `/api/investigations/${id}/close`,
    { method: "POST" }
  );
}
