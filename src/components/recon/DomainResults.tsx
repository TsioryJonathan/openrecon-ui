import type { ReconDomainData } from "@/types/api";
import { DataField, Divider } from "@/components/ui";
import { formatDate } from "@/lib/utils";

interface DomainResultsProps {
  query: string;
  data: ReconDomainData;
}

export function DomainResults({ query, data }: DomainResultsProps) {
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
          DOMAIN
        </p>
      </div>

      <Divider />

      {/* Registration info */}
      <Section label="REGISTRATION">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1.5rem 3rem",
          }}
        >
          <DataField label="Registrar" value={data.registrar} mono />
          <DataField
            label="Created"
            value={data.created ? formatDate(data.created) : null}
            mono
          />
          <DataField
            label="Expires"
            value={data.expires ? formatDate(data.expires) : null}
            mono
          />
          {data.status && data.status.length > 0 && (
            <DataField label="Status" mono>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text)" }}>
                {data.status.join(", ")}
              </span>
            </DataField>
          )}
        </div>
      </Section>

      <Divider />

      {/* Nameservers */}
      <Section label="NAMESERVERS">
        <RecordList records={data.nameservers ?? []} emptyText="No nameservers found." />
      </Section>

      <Divider />

      {/* DNS Records */}
      {data.dns && (
        <Section label="DNS RECORDS">
          {(["A", "MX", "NS", "TXT", "CNAME"] as const).map((type) => {
            const records = data.dns?.[type] ?? [];
            if (records.length === 0) return null;
            return (
              <div key={type} style={{ marginBottom: "1.25rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    color: "var(--text-dim)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {type}
                </p>
                <RecordList records={records} />
              </div>
            );
          })}
        </Section>
      )}

      {/* Subdomains */}
      {data.subdomains && data.subdomains.length > 0 && (
        <>
          <Divider />
          <Section label={`SUBDOMAINS — ${data.subdomains.length} found`}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "0.25rem 1rem",
              }}
            >
              {data.subdomains.map((sub) => (
                <p
                  key={sub}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    padding: "0.2rem 0",
                  }}
                >
                  {sub}
                </p>
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          color: "var(--text-dim)",
          marginBottom: "1rem",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function RecordList({
  records,
  emptyText,
}: {
  records: string[];
  emptyText?: string;
}) {
  if (records.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--text-dim)",
        }}
      >
        {emptyText ?? "—"}
      </p>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
      {records.map((r, i) => (
        <p
          key={`${r}-${i}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            wordBreak: "break-all",
          }}
        >
          {r}
        </p>
      ))}
    </div>
  );
}
