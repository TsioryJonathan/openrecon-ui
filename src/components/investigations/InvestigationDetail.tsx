"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ToolPage,
  TextInput,
  ActionButton,
  SectionHeader,
  SkeletonLine,
} from "@/components/ui";
import {
  IconInvestigation,
  IconPlay,
  IconLoading,
} from "@/lib/icons";
import {
  useGetInvestigation,
  useAddTarget,
  useScanInInvestigation,
  useAdaptiveScan,
  useCorrelateInvestigation,
  useCloseInvestigation,
} from "@/hooks/useApi";

const TARGET_TYPES = ["username", "domain", "ip"];

export function InvestigationDetail({
  investigationId,
}: {
  investigationId: string;
}) {
  const { data: inv, isLoading, refetch } = useGetInvestigation(investigationId);

  const [targetType, setTargetType] = useState("username");
  const [targetValue, setTargetValue] = useState("");
  const [maxDepth, setMaxDepth] = useState(2);

  const { mutate: addTarget, isPending: adding } = useAddTarget();
  const {
    mutate: scan,
    isPending: scanning,
    data: scanResult,
  } = useScanInInvestigation();
  const {
    mutate: adaptiveScan,
    isPending: adaptiveScanning,
    data: adaptiveResult,
  } = useAdaptiveScan();
  const {
    mutate: correlate,
    isPending: correlating,
    data: corrResult,
  } = useCorrelateInvestigation();
  const { mutate: closeInv, isPending: closing } = useCloseInvestigation();

  function handleAddTarget(e: React.FormEvent) {
    e.preventDefault();
    if (!targetValue.trim()) return;
    addTarget(
      {
        investigationId,
        targetType,
        targetValue: targetValue.trim(),
      },
      {
        onSuccess: () => {
          setTargetValue("");
          refetch();
        },
      }
    );
  }

  function handleScan() {
    if (!targetValue.trim()) return;
    scan(
      {
        investigationId,
        targetType,
        targetValue: targetValue.trim(),
      },
      { onSuccess: () => refetch() }
    );
  }

  function handleAdaptiveScan() {
    if (!targetValue.trim()) return;
    adaptiveScan(
      {
        investigationId,
        targetType,
        targetValue: targetValue.trim(),
        maxDepth,
      },
      { onSuccess: () => refetch() }
    );
  }

  function handleCorrelate() {
    correlate(investigationId, { onSuccess: () => refetch() });
  }

  function handleClose() {
    closeInv(investigationId, { onSuccess: () => refetch() });
  }

  if (isLoading) {
    return (
      <ToolPage
        eyebrow="INVESTIGATIONS"
        title="Loading..."
        description=""
        icon={<IconInvestigation size={20} />}
      >
        <SkeletonLine width="60%" height="1.25rem" />
        <SkeletonLine
          width="100%"
          height="0.875rem"
          style={{ marginTop: "1rem" }}
        />
        <SkeletonLine
          width="80%"
          height="0.875rem"
          style={{ marginTop: "0.5rem" }}
        />
      </ToolPage>
    );
  }

  if (!inv) {
    return (
      <ToolPage
        eyebrow="INVESTIGATIONS"
        title="Not found"
        description="This investigation does not exist."
        icon={<IconInvestigation size={20} />}
      >
        <Link
          href="/investigations"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
          }}
        >
          Back to investigations
        </Link>
      </ToolPage>
    );
  }

  const isOpen = inv.status === "open";

  return (
    <ToolPage
      eyebrow="INVESTIGATIONS / DETAIL"
      title={inv.name}
      description={inv.description ?? "No description"}
      icon={<IconInvestigation size={20} />}
      actions={
        isOpen ? (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <ActionButton
              onClick={handleCorrelate}
              disabled={correlating}
              variant="secondary"
              icon={correlating ? <IconLoading size={14} /> : undefined}
            >
              {correlating ? "Correlating..." : "Correlate"}
            </ActionButton>
            <ActionButton
              onClick={handleClose}
              disabled={closing}
              variant="secondary"
              icon={closing ? <IconLoading size={14} /> : undefined}
            >
              {closing ? "Closing..." : "Close"}
            </ActionButton>
          </div>
        ) : undefined
      }
    >
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Status", value: inv.status },
          { label: "Targets", value: String(inv.target_count) },
          { label: "Findings", value: String(inv.finding_count) },
          { label: "Evidence", value: String(inv.evidence_count) },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "0.875rem 1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginTop: "0.25rem",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Add target + scan form */}
      {isOpen && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <SectionHeader
            title="Add target & scan"
            subtitle="Add a target to this investigation or run a scan directly"
          />

          <form
            onSubmit={handleAddTarget}
            style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {TARGET_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTargetType(t)}
                  style={{
                    padding: "0.375rem 0.875rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid",
                    borderColor:
                      targetType === t ? "var(--accent)" : "var(--border-subtle)",
                    background:
                      targetType === t ? "var(--accent-dim)" : "transparent",
                    color: targetType === t ? "var(--accent)" : "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <TextInput
              placeholder={`Enter ${targetType}...`}
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />

            {targetType === "username" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    color: "var(--text-dim)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Max depth
                </label>
                <input
                  type="number"
                  min={0}
                  max={4}
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(Number(e.target.value))}
                  style={{
                    width: "3.5rem",
                    padding: "0.375rem 0.5rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    textAlign: "center",
                  }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <ActionButton
                type="submit"
                disabled={!targetValue.trim() || adding}
                icon={adding ? <IconLoading size={14} /> : undefined}
              >
                {adding ? "Adding..." : "Add target"}
              </ActionButton>
              <ActionButton
                type="button"
                disabled={!targetValue.trim() || scanning}
                variant="secondary"
                icon={
                  scanning ? (
                    <IconLoading size={14} />
                  ) : (
                    <IconPlay size={14} />
                  )
                }
                onClick={handleScan}
              >
                {scanning ? "Scanning..." : "Scan"}
              </ActionButton>
              <ActionButton
                type="button"
                disabled={!targetValue.trim() || adaptiveScanning}
                variant="secondary"
                icon={
                  adaptiveScanning ? (
                    <IconLoading size={14} />
                  ) : (
                    <IconPlay size={14} />
                  )
                }
                onClick={handleAdaptiveScan}
              >
                {adaptiveScanning
                  ? "Adaptive scanning..."
                  : "Adaptive scan"}
              </ActionButton>
            </div>
          </form>
        </div>
      )}

      {/* Scan result */}
      {scanResult && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <SectionHeader
            title="Scan result"
            subtitle={`${scanResult.scan.finding_count} findings, ${scanResult.scan.evidence_count} evidence, modules: ${scanResult.scan.modules_run.join(", ")}`}
          />
          {scanResult.scan.errors.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              {scanResult.scan.errors.map((err, i) => (
                <p
                  key={i}
                  style={{
                    color: "var(--error)",
                    fontSize: "var(--text-xs)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {err}
                </p>
              ))}
            </div>
          )}
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {scanResult.scan.findings.map((f) => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>
        </div>
      )}

      {/* Adaptive scan result */}
      {adaptiveResult && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <SectionHeader
            title="Adaptive scan result"
            subtitle={`${adaptiveResult.hop_count} hops, ${adaptiveResult.total_finding_count} findings, ${adaptiveResult.targets_scanned.length} targets scanned`}
          />
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {adaptiveResult.hops.map((hop) => (
              <HopRow key={hop.depth} hop={hop} />
            ))}
          </div>
        </div>
      )}

      {/* Correlation result */}
      {corrResult && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <SectionHeader
            title="Correlation result"
            subtitle={`${corrResult.relations_created} relations created, ${corrResult.relations_skipped} skipped`}
          />
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {corrResult.relations.map((r) => (
              <RelationRow key={r.id} relation={r} />
            ))}
          </div>
        </div>
      )}

      {/* Targets list */}
      {inv.targets.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
          }}
        >
          <SectionHeader
            title="Targets"
            subtitle={`${inv.targets.length} target(s) in this investigation`}
          />
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {inv.targets.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "999px",
                      border: "1px solid rgba(231,168,62,0.2)",
                      background: "var(--accent-dim)",
                    }}
                  >
                    {t.type}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text)",
                    }}
                  >
                    {t.value}
                  </span>
                  {t.role && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.625rem",
                        color: "var(--text-dim)",
                      }}
                    >
                      {t.role}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.625rem",
                    color: "var(--text-dim)",
                  }}
                >
                  {t.finding_count} findings
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolPage>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FindingRow({ finding }: { finding: ScanFindingItem }) {
  return (
    <div
      style={{
        padding: "0.625rem 0.875rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "0.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          {finding.type}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: "var(--text)",
          }}
        >
          {finding.value}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5625rem",
            color:
              finding.confidence === "high"
                ? "var(--accent)"
                : finding.confidence === "medium"
                  ? "var(--text-muted)"
                  : "var(--text-dim)",
          }}
        >
          {finding.confidence}
        </span>
      </div>
      {finding.confidence_reason && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            color: "var(--text-dim)",
          }}
        >
          {finding.confidence_reason}
        </p>
      )}
    </div>
  );
}

function HopRow({ hop }: { hop: AdaptiveHopItem }) {
  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "0.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
          }}
        >
          depth {hop.depth}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            color: "var(--accent)",
          }}
        >
          {hop.target_type}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: "var(--text)",
          }}
        >
          {hop.target_value}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.5625rem",
          color: "var(--text-dim)",
        }}
      >
        <span>{hop.finding_count} findings</span>
        <span>{hop.evidence_count} evidence</span>
        <span>{hop.new_leads} new leads</span>
      </div>
    </div>
  );
}

function RelationRow({ relation }: { relation: RelationItem }) {
  return (
    <div
      style={{
        padding: "0.625rem 0.875rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          {relation.relation_type}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
          }}
        >
          {relation.reason}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5625rem",
            color: "var(--text-dim)",
            marginLeft: "auto",
          }}
        >
          {relation.confidence}
        </span>
      </div>
    </div>
  );
}
