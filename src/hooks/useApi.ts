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
} from "@/lib/api/client";
import type {
  SitesResponse,
  SearchResponse,
  GetResultsResponse,
  MessageResponse,
  DorkGenerateResponse,
  ExifResponse,
  ReconResponse,
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
