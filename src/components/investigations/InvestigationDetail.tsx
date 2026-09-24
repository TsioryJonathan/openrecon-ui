"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ToolPage,
  TextInput,
  ActionButton,
  GhostButton,
  SectionHeader,
  SkeletonLine,
} from "@/components/ui";
import {
  IconInvestigation,
  IconPlay,
  IconLoading,
  IconPlus,
  IconClose,
  IconFile,
} from "@/lib/icons";
import {
  useGetInvestigation,
  useAddTarget,
  useScanInInvestigation,
  useAdaptiveScan,
  useCorrelateInvestigation,
  useCloseInvestigation,
  useTargetFindings,
} from "@/hooks/useApi";
import {
  RelationsModal,
  ReportModal,
  RelationRow,
} from "./InvestigationModals";
import { InvestigationGraphProvider } from "./InvestmentGraph";
import type {
  InvestigationTargetItem,
  ScanFindingItem,
  AdaptiveHopItem,
} from "@/types/api";

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
  const [scanningTargetId, setScanningTargetId] = useState<string | null>(null);
  const [findingsTargetId, setFindingsTargetId] = useState<string | null>(null);
  const [relationsOpen, setRelationsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

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

  const { data: findingsData, isLoading: findingsLoading } = useTargetFindings(
    investigationId,
    findingsTargetId
  );

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

  function handleScanTarget(t: InvestigationTargetItem) {
    setScanningTargetId(t.id);
    scan(
      {
        investigationId,
        targetType: t.type,
        targetValue: t.value,
      },
      {
        onSuccess: () => {
          setScanningTargetId(null);
          refetch();
        },
        onError: () => setScanningTargetId(null),
      }
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
    correlate({ investigationId }, { onSuccess: () => refetch() });
  }

  function handleClose() {
    closeInv({ id: investigationId }, { onSuccess: () => refetch() });
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
        <SkeletonLine width="100%" height="0.875rem" />
        <SkeletonLine width="80%" height="0.875rem" />
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
            <GhostButton
              onClick={() => setRelationsOpen(true)}
              icon={<IconInvestigation size={14} />}
            >
              Relations
            </GhostButton>
            <GhostButton
              onClick={() => setReportOpen(true)}
              icon={<IconFile size={14} />}
            >
              Report
            </GhostButton>
            <GhostButton
              onClick={handleCorrelate}
              disabled={correlating}
              icon={correlating ? <IconLoading size={14} /> : <IconPlus size={14} />}
            >
              {correlating ? "Correlating..." : "Correlate"}
            </GhostButton>
            <GhostButton
              onClick={handleClose}
              disabled={closing}
              icon={closing ? <IconLoading size={14} /> : undefined}
            >
              {closing ? "Closing..." : "Close"}
            </GhostButton>
          </div>
        ) : undefined
      }
    >
      {/* Activity indicator */}
      {(scanning || adaptiveScanning || correlating) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
            padding: "0.625rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            background: "var(--surface)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          <IconLoading size={12} />
          {scanning
            ? "Scanning target..."
            : adaptiveScanning
              ? "Adaptive scan in progress..."
              : "Correlating findings across targets..."}
        </div>
      )}

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
            label="Add target & scan"
            action={
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-dim)",
                }}
              >
                Add a target to this investigation or run a scan directly
              </span>
            }
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
                icon={adding ? <IconLoading size={14} /> : <IconPlus size={14} />}
              >
                {adding ? "Adding..." : "Add target"}
              </ActionButton>
              <GhostButton
                type="button"
                disabled={!targetValue.trim() || scanning}
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
              </GhostButton>
              <GhostButton
                type="button"
                disabled={!targetValue.trim() || adaptiveScanning}
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
              </GhostButton>
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
            label="Scan result"
            action={
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-dim)",
                }}
              >
                {scanResult.scan.finding_count} findings, {scanResult.scan.evidence_count} evidence, modules: {scanResult.scan.modules_run.join(", ")}
              </span>
            }
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
            label="Adaptive scan result"
            action={
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-dim)",
                }}
              >
                {adaptiveResult.hop_count} hops, {adaptiveResult.total_finding_count} findings, {adaptiveResult.targets_scanned.length} targets scanned
              </span>
            }
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
            label="Correlation result"
            action={
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-dim)",
                }}
              >
                {corrResult.relations_created} relations created, {corrResult.relations_skipped} skipped
              </span>
            }
          />
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {corrResult.relations.map((r) => (
              <RelationRow key={r.id} relation={r} />
            ))}
          </div>
        </div>
      )}

      <InvestigationGraphProvider investigationId={investigationId} />

      {/* Targets list with per-target Scan + Findings */}
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
            label="Targets"
            count={inv.targets.length}
            action={
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-dim)",
                }}
              >
                Click a target to scan it or view its findings
              </span>
            }
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
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
                      flexShrink: 0,
                    }}
                  >
                    {t.type}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
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
                        flexShrink: 0,
                      }}
                    >
                      {t.role}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.625rem",
                      color: "var(--text-dim)",
                      flexShrink: 0,
                    }}
                  >
                    {t.finding_count} findings
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, marginLeft: "0.75rem" }}>
                  <GhostButton
                    type="button"
                    onClick={() => setFindingsTargetId(t.id)}
                    disabled={t.finding_count === 0}
                    icon={<IconInvestigation size={12} />}
                  >
                    Findings
                  </GhostButton>
                  {isOpen && (
                    <GhostButton
                      type="button"
                      onClick={() => handleScanTarget(t)}
                      disabled={scanning || scanningTargetId === t.id}
                      icon={
                        scanningTargetId === t.id ? (
                          <IconLoading size={12} />
                        ) : (
                          <IconPlay size={12} />
                        )
                      }
                    >
                      {scanningTargetId === t.id ? "Scanning..." : "Scan"}
                    </GhostButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Findings modal */}
      {findingsTargetId && (
        <div
          onClick={() => setFindingsTargetId(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "42rem",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <SectionHeader
                label="Findings"
                count={findingsData?.finding_count ?? 0}
              />
              <GhostButton
                type="button"
                onClick={() => setFindingsTargetId(null)}
                icon={<IconClose size={14} />}
              >
                Close
              </GhostButton>
            </div>

            {findingsLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <SkeletonLine width="100%" height="0.875rem" />
                <SkeletonLine width="80%" height="0.875rem" />
                <SkeletonLine width="60%" height="0.875rem" />
              </div>
            ) : findingsData && findingsData.findings.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {findingsData.findings.map((f) => (
                  <FindingRow key={f.id} finding={f} />
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-dim)",
                }}
              >
                No findings for this target yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Relations modal */}
      {relationsOpen && (
        <RelationsModal
          investigationId={investigationId}
          onClose={() => setRelationsOpen(false)}
        />
      )}

      {/* Report modal */}
      {reportOpen && (
        <ReportModal
          investigationId={investigationId}
          onClose={() => setReportOpen(false)}
        />
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
      {finding.evidence.length > 0 && (
        <div
          style={{
            marginTop: "0.375rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.375rem",
          }}
        >
          {finding.evidence.map((e) => (
            <span
              key={e.id}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5625rem",
                color: "var(--text-dim)",
                border: "1px solid var(--border-subtle)",
                padding: "0.125rem 0.375rem",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface)",
              }}
            >
              {e.evidence_type}: {e.value}
            </span>
          ))}
        </div>
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
