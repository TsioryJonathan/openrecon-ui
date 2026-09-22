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

// ─── Investigations ─────────────────────────────────────────────────────────

export interface InvestigationTargetItem {
  id: string;
  type: string;
  value: string;
  role: string | null;
  added_at: string;
  finding_count: number;
}

export interface InvestigationSummaryResponse {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  target_count: number;
  finding_count: number;
  evidence_count: number;
  targets: InvestigationTargetItem[];
}

export interface InvestigationListItem {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InvestigationListResponse {
  total: number;
  investigations: InvestigationListItem[];
}

export interface ScanFindingEvidence {
  id: string;
  source: string;
  evidence_type: string;
  value: string;
  observed_at: string;
}

export interface ScanFindingItem {
  id: string;
  type: string;
  value: string;
  source: string;
  confidence: string;
  confidence_reason: string;
  observed_at: string;
  evidence: ScanFindingEvidence[];
}

export interface ScanTargetItem {
  id: string;
  type: string;
  value: string;
  created_at: string;
}

export interface ScanResponse {
  target: ScanTargetItem;
  finding_count: number;
  evidence_count: number;
  modules_run: string[];
  findings: ScanFindingItem[];
  errors: string[];
}

export interface InvestigationScanResponse {
  scan: ScanResponse;
  investigation: InvestigationSummaryResponse;
}

export interface InvestigationTargetFindingsResponse {
  target_id: string;
  finding_count: number;
  findings: ScanFindingItem[];
}

export interface InvestigationRelationsResponse {
  investigation_id: string;
  relation_count: number;
  relations: RelationItem[];
}

export interface AdaptiveHopItem {
  depth: number;
  target_type: string;
  target_value: string;
  finding_count: number;
  evidence_count: number;
  new_leads: number;
  errors: string[];
}

export interface AdaptiveTargetItem {
  type: string;
  value: string;
}

export interface AdaptiveLeadItem {
  target_type: string;
  target_value: string;
  rule: string;
  source_finding_id: string;
}

export interface AdaptiveScanResponse {
  investigation_id: string;
  max_depth: number;
  hop_count: number;
  targets_scanned: AdaptiveTargetItem[];
  total_finding_count: number;
  total_evidence_count: number;
  hops: AdaptiveHopItem[];
  leads_skipped: Record<string, unknown>[];
  errors: string[];
  investigation: InvestigationSummaryResponse;
}

export interface RelationItem {
  id: string;
  source_finding_id: string;
  target_finding_id: string;
  relation_type: string;
  confidence: string;
  reason: string;
  created_at: string;
}

export interface CorrelationResponse {
  investigation_id: string;
  relations_created: number;
  relations_skipped: number;
  errors: string[];
  relations: RelationItem[];
}
