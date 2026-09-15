"use client";

import { useState } from "react";
import type { ReconDomainData } from "@/types/api";
import {
  Divider,
  SectionHeader,
  CopyButton,
  ExternalLinkButton,
} from "@/components/ui";
import {
  IconDns,
  IconNetwork,
  IconChevronDown,
  IconChevronRight,
} from "@/lib/icons";
import { formatDate } from "@/lib/utils";

interface DomainResultsProps {
  query: string;
  data: ReconDomainData;
}

const DNS_TYPES = ["A", "MX", "NS", "TXT", "CNAME"] as const;

export function DomainResults({ query, data }: DomainResultsProps) {
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
              fontSize:      "clamp(1.4rem, 4vw, 2.1rem)",
              color:         "var(--text)",
              letterSpacing: "0.02em",
              lineHeight:    1,
            }}
          >
            {query}
          </p>
          <CopyButton text={query} label="Copy domain" size={14} />
        </div>
        <p
          className="t-label"
          style={{ color: "var(--text-dim)", marginTop: "0.4rem" }}
        >
          DOMAIN
        </p>
      </div>

      <Divider />

      {/* ── Registration ── */}
      {(data.registrar || data.created || data.expires || (data.status?.length ?? 0) > 0) && (
        <>
          <section aria-label="Registration information" style={{ marginBottom: "2rem" }}>
            <SectionHeader label="REGISTRATION" />
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                gap:                 "1.25rem 2.5rem",
              }}
            >
              <RegField label="Registrar" value={data.registrar} />
              <RegField label="Created"   value={data.created ? formatDate(data.created) : null} />
              <RegField label="Expires"   value={data.expires ? formatDate(data.expires) : null} />
              {data.status && data.status.length > 0 && (
                <div>
                  <p className="t-label" style={{ marginBottom: "0.3rem" }}>Status</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    {data.status.map((s) => (
                      <p
                        key={s}
                        className="t-mono"
                        style={{
                          fontSize:  "var(--text-xs)",
                          color:     "var(--text-muted)",
                          wordBreak: "break-word",
                        }}
                      >
                        {s}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* ── Nameservers ── */}
      {data.nameservers && data.nameservers.length > 0 && (
        <>
          <section aria-label="Nameservers" style={{ marginBottom: "2rem" }}>
            <SectionHeader
              label="NAMESERVERS"
              count={data.nameservers.length}
              icon={<IconNetwork size={13} />}
            />
            <CopyableRecordList records={data.nameservers} />
          </section>
          <Divider />
        </>
      )}

      {/* ── DNS Records ── */}
      {data.dns && DNS_TYPES.some((t) => (data.dns?.[t]?.length ?? 0) > 0) && (
        <>
          <section aria-label="DNS records" style={{ marginBottom: "2rem" }}>
            <SectionHeader
              label="DNS RECORDS"
              icon={<IconDns size={13} />}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {DNS_TYPES.map((type) => {
                const records = data.dns?.[type] ?? [];
                if (records.length === 0) return null;
                return (
                  <DnsTypeBlock key={type} type={type} records={records} />
                );
              })}
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* ── Subdomains ── */}
      {data.subdomains && data.subdomains.length > 0 && (
        <section aria-label="Subdomains">
          <SectionHeader
            label="SUBDOMAINS"
            count={data.subdomains.length}
          />
          <SubdomainList subdomains={data.subdomains} />
        </section>
      )}
    </div>
  );
}

// ─── RegField ─────────────────────────────────────────────────────────────────

function RegField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="t-label" style={{ marginBottom: "0.3rem" }}>{label}</p>
      <p
        className="t-mono"
        style={{
          fontSize: "var(--text-sm)",
          color:    value ? "var(--text)" : "var(--text-dim)",
        }}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

// ─── DnsTypeBlock ─────────────────────────────────────────────────────────────
// Collapsible DNS record group with copy buttons per value.

function DnsTypeBlock({ type, records }: { type: string; records: string[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            "0.5rem",
          width:          "100%",
          background:     "transparent",
          border:         "none",
          cursor:         "pointer",
          padding:        "0.7rem 0",
          textAlign:      "left",
        }}
      >
        <span style={{ color: "var(--text-dim)", display: "flex", flexShrink: 0 }}>
          {open
            ? <IconChevronDown size={12} />
            : <IconChevronRight size={12} />}
        </span>
        <span
          className="t-mono"
          style={{
            fontSize:      "var(--text-xs)",
            letterSpacing: "0.1em",
            color:         "var(--accent)",
            fontWeight:    600,
          }}
        >
          {type}
        </span>
        <span
          className="t-label"
          style={{ color: "var(--text-dim)", marginLeft: "0.25rem" }}
        >
          {records.length}
        </span>
      </button>

      {/* Records */}
      {open && (
        <div style={{ paddingBottom: "0.75rem" }}>
          {records.map((record, i) => (
            <div
              key={`${record}-${i}`}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "0.5rem",
                padding:      "0.3rem 0 0.3rem 1.25rem",
                transition:   "background var(--t-fast)",
              }}
              className="group hover:bg-[var(--surface)]"
            >
              <p
                className="t-mono"
                style={{
                  fontSize:  "var(--text-xs)",
                  color:     "var(--text-muted)",
                  flex:      1,
                  wordBreak: "break-all",
                  lineHeight: 1.5,
                }}
              >
                {record}
              </p>
              <span
                style={{
                  opacity:    0,
                  transition: "opacity var(--t-fast)",
                  flexShrink: 0,
                }}
                className="group-hover:opacity-100"
              >
                <CopyButton text={record} label={`Copy ${type} record`} size={12} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CopyableRecordList ───────────────────────────────────────────────────────
// Simple list with per-row copy buttons — used for nameservers.

function CopyableRecordList({ records }: { records: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {records.map((record, i) => (
        <div
          key={`${record}-${i}`}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "0.5rem",
            padding:    "0.3rem 0",
            borderBottom: "1px solid var(--border-subtle)",
            transition: "background var(--t-fast)",
          }}
          className="group hover:bg-[var(--surface)]"
        >
          <p
            className="t-mono"
            style={{
              fontSize:  "var(--text-xs)",
              color:     "var(--text-muted)",
              flex:      1,
              wordBreak: "break-all",
            }}
          >
            {record}
          </p>
          <span
            style={{ opacity: 0, transition: "opacity var(--t-fast)", flexShrink: 0 }}
            className="group-hover:opacity-100"
          >
            <CopyButton text={record} label="Copy record" size={12} />
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── SubdomainList ────────────────────────────────────────────────────────────
// Clickable subdomain rows with external link.

function SubdomainList({ subdomains }: { subdomains: string[] }) {
  // Show first 50, expand on demand
  const [expanded, setExpanded] = useState(false);
  const INITIAL = 50;
  const visible = expanded ? subdomains : subdomains.slice(0, INITIAL);
  const overflow = subdomains.length - INITIAL;

  return (
    <div>
      <div
        style={{
          border:   "1px solid var(--border-subtle)",
          overflow: "hidden",
        }}
      >
        {visible.map((sub, i) => (
          <div
            key={sub}
            style={{
              display:     "flex",
              alignItems:  "center",
              gap:         "0.5rem",
              padding:     "0.5rem 0.75rem",
              borderBottom: i < visible.length - 1
                ? "1px solid var(--border-subtle)"
                : "none",
              transition:  "background var(--t-fast)",
            }}
            className="group hover:bg-[var(--surface-raised)]"
          >
            <p
              className="t-mono"
              style={{
                fontSize:  "var(--text-xs)",
                color:     "var(--text-muted)",
                flex:      1,
                overflow:  "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                transition: "color var(--t-fast)",
              }}
            >
              {sub}
            </p>
            <div
              style={{
                display:    "flex",
                gap:        "0.125rem",
                opacity:    0,
                transition: "opacity var(--t-fast)",
                flexShrink: 0,
              }}
              className="group-hover:opacity-100"
            >
              <CopyButton text={sub} label={`Copy ${sub}`} size={12} />
              <ExternalLinkButton
                href={`https://${sub}`}
                label={`Open ${sub}`}
                size={12}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Expand button */}
      {!expanded && overflow > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="t-label hover:text-[var(--text)]"
          style={{
            background:  "transparent",
            border:      "none",
            cursor:      "pointer",
            color:       "var(--text-dim)",
            padding:     "0.75rem 0",
            transition:  "color var(--t-base)",
            display:     "block",
            width:       "100%",
            textAlign:   "left",
          }}
        >
          + {overflow} more subdomains — show all
        </button>
      )}
    </div>
  );
}
