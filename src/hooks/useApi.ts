"use client";

import {
  useQuery,
  useMutation,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  getSites,
  searchUsername,
  getSherlockResults,
  generateDorks,
  extractExif,
  reconQuery,
  listInvestigations,
  createInvestigation,
  getInvestigation,
  addTargetToInvestigation,
  scanInInvestigation,
  adaptiveScanInInvestigation,
  correlateInvestigation,
  closeInvestigation,
} from "@/lib/api/client";
import type {
  SitesResponse,
  SearchResponse,
  GetResultsResponse,
  MessageResponse,
  DorkGenerateResponse,
  ExifResponse,
  ReconResponse,
  InvestigationListResponse,
  InvestigationSummaryResponse,
  InvestigationScanResponse,
  AdaptiveScanResponse,
  CorrelationResponse,
} from "@/types/api";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const queryKeys = {
  sites: ["sherlock", "sites"] as const,
  sherlockResults: (username: string) =>
    ["sherlock", "results", username] as const,
};

// ─── Sherlock ─────────────────────────────────────────────────────────────────

export function useSites(
  options?: Partial<UseQueryOptions<SitesResponse>>
) {
  return useQuery<SitesResponse>({
    queryKey: queryKeys.sites,
    queryFn: getSites,
    staleTime: Infinity, // site list doesn't change
    ...options,
  });
}

export function useSearchUsername() {
  return useMutation<
    SearchResponse,
    { detail: string },
    { username: string; sites: string[] }
  >({
    mutationFn: ({ username, sites }) => searchUsername(username, sites),
  });
}

export function useSherlockResults(
  username: string,
  options?: Partial<
    UseQueryOptions<GetResultsResponse | MessageResponse>
  >
) {
  return useQuery<GetResultsResponse | MessageResponse>({
    queryKey: queryKeys.sherlockResults(username),
    queryFn: () => getSherlockResults(username),
    enabled: username.length > 0,
    ...options,
  });
}

// ─── Dork ─────────────────────────────────────────────────────────────────────

export function useGenerateDorks() {
  return useMutation<
    DorkGenerateResponse,
    { detail: string },
    { target: string }
  >({
    mutationFn: ({ target }) => generateDorks(target),
  });
}

// ─── EXIF ─────────────────────────────────────────────────────────────────────

export function useExtractExif() {
  return useMutation<ExifResponse, { detail: string }, { file: File }>({
    mutationFn: ({ file }) => extractExif(file),
  });
}

// ─── Recon ────────────────────────────────────────────────────────────────────

export function useRecon() {
  return useMutation<ReconResponse, { detail: string }, { query: string }>({
    mutationFn: ({ query }) => reconQuery(query),
  });
}

// ─── Investigations ─────────────────────────────────────────────────────────

export function useListInvestigations(
  status?: string,
  options?: Partial<UseQueryOptions<InvestigationListResponse>>
) {
  return useQuery<InvestigationListResponse>({
    queryKey: ["investigations", status],
    queryFn: () => listInvestigations(status),
    ...options,
  });
}

export function useGetInvestigation(
  id: string,
  options?: Partial<UseQueryOptions<InvestigationSummaryResponse>>
) {
  return useQuery<InvestigationSummaryResponse>({
    queryKey: ["investigations", id],
    queryFn: () => getInvestigation(id),
    enabled: id.length > 0,
    ...options,
  });
}

export function useCreateInvestigation() {
  return useMutation<
    InvestigationSummaryResponse,
    { detail: string },
    { name: string; description?: string }
  >({
    mutationFn: ({ name, description }) =>
      createInvestigation(name, description),
  });
}

export function useAddTarget() {
  return useMutation<
    InvestigationSummaryResponse,
    { detail: string },
    {
      investigationId: string;
      targetType: string;
      targetValue: string;
      role?: string;
    }
  >({
    mutationFn: ({ investigationId, targetType, targetValue, role }) =>
      addTargetToInvestigation(investigationId, targetType, targetValue, role),
  });
}

export function useScanInInvestigation() {
  return useMutation<
    InvestigationScanResponse,
    { detail: string },
    {
      investigationId: string;
      targetType: string;
      targetValue: string;
      options?: Record<string, unknown>;
      role?: string;
    }
  >({
    mutationFn: ({ investigationId, targetType, targetValue, options, role }) =>
      scanInInvestigation(
        investigationId,
        targetType,
        targetValue,
        options,
        role
      ),
  });
}

export function useAdaptiveScan() {
  return useMutation<
    AdaptiveScanResponse,
    { detail: string },
    {
      investigationId: string;
      targetType: string;
      targetValue: string;
      maxDepth?: number;
      options?: Record<string, unknown>;
      role?: string;
    }
  >({
    mutationFn: ({
      investigationId,
      targetType,
      targetValue,
      maxDepth,
      options,
      role,
    }) =>
      adaptiveScanInInvestigation(
        investigationId,
        targetType,
        targetValue,
        maxDepth,
        options,
        role
      ),
  });
}

export function useCorrelateInvestigation() {
  return useMutation<
    CorrelationResponse,
    { detail: string },
    { investigationId: string }
  >({
    mutationFn: ({ investigationId }) =>
      correlateInvestigation(investigationId),
  });
}

export function useCloseInvestigation() {
  return useMutation<
    InvestigationSummaryResponse,
    { detail: string },
    { id: string }
  >({
    mutationFn: ({ id }) => closeInvestigation(id),
  });
}
