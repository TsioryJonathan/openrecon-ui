// ─── Sherlock ────────────────────────────────────────────────────────────────

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

export interface MessageResponse {
  message: string;
}

export interface CategorySites {
  name: string;
  sites: string[];
}

export interface SitesResponse {
  categories: CategorySites[];
  total: number;
}

// ─── Dork ────────────────────────────────────────────────────────────────────

export interface DorkItem {
  title: string;
  query: string;
  url: string;
}

export interface DorkCategory {
  name: string;
  description: string;
  dorks: DorkItem[];
}

export interface DorkGenerateResponse {
  target: string;
  total: number;
  categories: DorkCategory[];
}

// ─── EXIF ────────────────────────────────────────────────────────────────────

export interface ExifGps {
  lat: number;
  lon: number;
  altitude?: number | null;
}

export interface ExifDevice {
  make?: string | null;
  model?: string | null;
}

export interface ExifCameraSettings {
  focal_length?: number | null;
  focal_length_35mm?: number | null;
  f_number?: number | null;
  exposure_time?: number | null;
  iso?: number | null;
  exposure_program?: string | null;
  exposure_compensation?: number | null;
}

export interface ExifImage {
  width?: number | null;
  height?: number | null;
  color_space?: number | null;
  bits_per_sample?: number | null;
}

export interface ExifResponse {
  filename: string;
  has_gps: boolean;
  gps?: ExifGps | null;
  device?: ExifDevice | null;
  lens?: string | null;
  camera_settings?: ExifCameraSettings | null;
  image?: ExifImage | null;
  flash?: string | null;
  white_balance?: string | null;
  scene_type?: string | null;
  datetime?: string | null;
  software?: string | null;
  artist?: string | null;
  copyright?: string | null;
}

// ─── Recon ───────────────────────────────────────────────────────────────────

export interface ReconIpData {
  country?: string | null;
  country_code?: string | null;
  region?: string | null;
  city?: string | null;
  coordinates?: { lat: number; lon: number } | null;
  isp?: string | null;
  organization?: string | null;
  asn?: string | null;
  as_name?: string | null;
  proxy?: boolean | null;
  hosting?: boolean | null;
  mobile?: boolean | null;
  error?: string;
}

export interface ReconDomainData {
  registrar?: string | null;
  created?: string | null;
  expires?: string | null;
  status?: string[];
  nameservers?: string[];
  subdomains?: string[];
  dns?: {
    NS?: string[];
    MX?: string[];
    A?: string[];
    TXT?: string[];
    CNAME?: string[];
  };
}

export interface ReconResponse {
  query: string;
  type: "ip" | "domain";
  data: ReconIpData | ReconDomainData;
}

// ─── Errors ──────────────────────────────────────────────────────────────────

export interface ErrorResponse {
  detail: string;
}

export interface ApiError {
  status: number;
  detail: string;
}
