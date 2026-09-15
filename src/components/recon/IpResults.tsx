"use client";

import type { ReconIpData } from "@/types/api";
import {
  Divider,
  SectionHeader,
  CopyButton,
  StatusIndicator,
  RequestError,
} from "@/components/ui";
import {
  IconLocation,
  IconNetwork,
  IconSecurity,
} from "@/lib/icons";

interface IpResultsProps {
  query: string;
  data: ReconIpData;
}

export function IpResults({ query, data }: IpResultsProps) {
  if (data.error) {
    return <RequestError message={data.error} />;
  }

  const location = [data.city, data.region, data.country]
    .filter(Boolean)
    .join(", ");

  // Detect IPv6
  const ipVersion = query.includes(":") ? "IPV6" : "IPV4";

  return (
    <div className="animate-fade-in">

      {/* ── Target block ── */}
      <div style={{ marginBottom: "2rem" }}>
        <p className="t-label" style={{ marginBottom: "0.75rem" }}>
          TARGET
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.875rem", flexWrap: "wrap" }}>
          <p
            className="t-mono"
            style={{
              fontSize:      "clamp(1.5rem, 4vw, 2.25rem)",
              color:         "var(--text)",
              letterSpacing: "0.04em",
              lineHeight:    1,
            }}
          >
            {query}
          </p>
          <CopyButton text={query} label="Copy IP address" size={14} />
        </div>
        <p
          className="t-label"
          style={{ color: "var(--text-dim)", marginTop: "0.4rem" }}
        >
          {ipVersion} ADDRESS
        </p>
      </div>

      <Divider />

      {/* ── Network section ── */}
      <section aria-label="Network information" style={{ marginBottom: "2rem" }}>
        <SectionHeader label="NETWORK" icon={<IconNetwork size={13} />} />

        {/* ASN — prominent */}
        {(data.asn || data.as_name) && (
          <div style={{ marginBottom: "1.5rem" }}>
            {data.asn && (
              <p
                className="t-mono"
                style={{
                  fontSize:      "var(--text-xl)",
                  color:         "var(--text)",
                  letterSpacing: "0.04em",
                  lineHeight:    1.1,
                  marginBottom:  "0.2rem",
                }}
              >
                {data.asn}
              </p>
            )}
            {data.as_name && (
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "var(--text-sm)",
                  color:      "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                {data.as_name}
              </p>
            )}
          </div>
        )}

        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap:                 "1.25rem 2.5rem",
          }}
        >
          <InvestigationField label="ISP" value={data.isp} mono />
          <InvestigationField label="Organisation" value={data.organization} mono />
        </div>
      </section>

      <Divider />

      {/* ── Location section ── */}
      <section aria-label="Location information" style={{ marginBottom: "2rem" }}>
        <SectionHeader label="LOCATION" icon={<IconLocation size={13} />} />

        {location ? (
          <div style={{ marginBottom: "1.5rem" }}>
            <p
              style={{
                fontFamily:   "var(--font-display)",
                fontSize:     "var(--text-lg)",
                fontWeight:   500,
                color:        "var(--text)",
                marginBottom: "0.2rem",
                letterSpacing: "-0.01em",
              }}
            >
              {[data.city, data.region].filter(Boolean).join(", ")}
            </p>
            {data.country && (
              <p
                className="t-mono"
                style={{
                  fontSize: "var(--text-sm)",
                  color:    "var(--text-muted)",
                }}
              >
                {data.country}
                {data.country_code && (
                  <span style={{ color: "var(--text-dim)", marginLeft: "0.5rem" }}>
                    {data.country_code}
                  </span>
                )}
              </p>
            )}
          </div>
        ) : (
          <p className="t-mono" style={{ fontSize: "var(--text-sm)", color: "var(--text-dim)", marginBottom: "1.5rem" }}>
            —
          </p>
        )}

        {data.coordinates && (
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap:                 "1rem 2.5rem",
            }}
          >
            <InvestigationField
              label="Latitude"
              value={data.coordinates.lat.toFixed(6)}
              mono
            />
            <InvestigationField
              label="Longitude"
              value={data.coordinates.lon.toFixed(6)}
              mono
            />
            <div>
              <p className="t-label" style={{ marginBottom: "0.3rem" }}>Maps</p>
              <a
                href={`https://www.google.com/maps?q=${data.coordinates.lat},${data.coordinates.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="t-mono"
                style={{
                  fontSize:   "var(--text-xs)",
                  color:      "var(--accent)",
                  transition: "opacity var(--t-base)",
                  display:    "inline-flex",
                  alignItems: "center",
                  gap:        "0.3rem",
                }}
              >
                Open location ↗
              </a>
            </div>
          </div>
        )}
      </section>

      <Divider />

      {/* ── Signals section ── */}
      <section aria-label="Network signals">
        <SectionHeader label="SIGNALS" icon={<IconSecurity size={13} />} />
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap:                 "1.25rem 2rem",
          }}
        >
          <SignalField label="Proxy"   value={data.proxy} />
          <SignalField label="Hosting" value={data.hosting} />
          <SignalField label="Mobile"  value={data.mobile} />
        </div>
      </section>
    </div>
  );
}

// ─── InvestigationField ───────────────────────────────────────────────────────

function InvestigationField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="t-label" style={{ marginBottom: "0.3rem" }}>
        {label}
      </p>
      <p
        className={mono ? "t-mono" : undefined}
        style={{
          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
          fontSize:   mono ? "var(--text-sm)" : "var(--text-base)",
          color:      value ? "var(--text)" : "var(--text-dim)",
          lineHeight: 1.45,
          wordBreak:  "break-word",
        }}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

// ─── SignalField ──────────────────────────────────────────────────────────────

function SignalField({ label, value }: { label: string; value?: boolean | null }) {
  return (
    <div>
      <p className="t-label" style={{ marginBottom: "0.4rem" }}>
        {label}
      </p>
      <StatusIndicator value={value} />
    </div>
  );
}
