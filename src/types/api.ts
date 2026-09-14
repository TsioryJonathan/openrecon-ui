export interface ResultItem {
  site: string;
  url: string;
}

export interface SearchResponse {
  username: string;
  results: ResultItem[];
}

export interface SearchResultEntry {
  id: string;
  created_at: string;
  results: ResultItem[];
}

export interface GetResultsResponse {
  username: string;
  searches: SearchResultEntry[];
}

export interface CategorySites {
  name: string;
  sites: string[];
}

export interface SitesResponse {
  categories: CategorySites[];
  total: number;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  detail: string;
}
