import type { ReconIpData } from "@/types/api";
import { DataField, Divider } from "@/components/ui";

interface IpResultsProps {
  query: string;
  data: ReconIpData;
}

export function IpResults({ query, data }: IpResultsProps) {
  if (data.error) {
    return (
      <div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "var(--text-dim)",
            marginBottom: "0.5rem",
          }}
        >
          LOOKUP FAILED
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          {data.error}
        </p>
      </div>
    );
  }

  const location = [data.city, data.region, data.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      {/* Target */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            color: "var(--text-dim)",
            marginBottom: "0.5rem",
          }}
        >
          TARGET
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.75rem",
            color: "var(--text)",
            letterSpacing: "0.04em",
            lineHeight: 1,
            marginBottom: "0.25rem",
          }}
        >
          {query}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
            letterSpacing: "0.1em",
          }}
        >
          IPv4 ADDRESS
        </p>
      </div>

      <Divider />

      {/* Fields grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.5rem 3rem",
        }}
      >
        <DataField
          label="Location"
          value={location || null}
          mono
        />
        <DataField
          label="Country Code"
          value={data.country_code}
          mono
        />
        <DataField label="ISP" value={data.isp} mono />
        <DataField label="Organisation" value={data.organization} mono />
        <DataField label="ASN" value={data.asn} mono />
        <DataField label="AS Name" value={data.as_name} mono />
        <DataField
          label="Coordinates"
          value={
            data.coordinates
              ? `${data.coordinates.lat.toFixed(4)}° N, ${data.coordinates.lon.toFixed(4)}° W`
              : null
          }
          mono
        />
        <DataField
          label="Proxy"
          value={
            data.proxy === null || data.proxy === undefined
              ? null
              : data.proxy
              ? "YES"
              : "NO"
          }
          mono
        />
        <DataField
          label="Hosting"
          value={
            data.hosting === null || data.hosting === undefined
              ? null
              : data.hosting
              ? "YES"
              : "NO"
          }
          mono
        />
        <DataField
          label="Mobile"
          value={
            data.mobile === null || data.mobile === undefined
              ? null
              : data.mobile
              ? "YES"
              : "NO"
          }
          mono
        />
      </div>
    </div>
  );
}
