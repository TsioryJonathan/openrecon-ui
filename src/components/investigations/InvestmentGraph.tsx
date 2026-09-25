"use client";

/**
 * InvestigationGraph - board de cibles reliees par les relations trouvees.
 * Grille CSS stable (pas de layout externe ni elkjs) : position calculee
 * depuis l'index de la cible. Les relations sont agregees par paire de
 * cibles (1 arete + badge "n") pour eviter le bruit. Le chevron d'une
 * cible deplie ses findings (fetch au clic, pas de modal).
 *
 * Contrat cote : @/components/ui (SectionHeader/SkeletonLine/RequestError),
 * @/hooks/useApi (useGetInvestigation/useInvestigationRelations/useTargetFindings),
 * @/types/api (InvestigationTargetItem/RelationItem/ScanFindingItem),
 * @xyflow/react (installe dans package.json).
 */

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { SectionHeader, SkeletonLine, RequestError } from "@/components/ui";
import {
  useGetInvestigation,
  useInvestigationRelations,
  useTargetFindings,
} from "@/hooks/useApi";
import type {
  InvestigationTargetItem,
  RelationItem,
  ScanFindingItem,
} from "@/types/api";

const COL_W = 230;
const ROW_H = 120;
const COLS = 5;
const MAX_FINDINGS = 8;

type TargetNodeData = {
  target: InvestigationTargetItem;
  expanded: boolean;
  findings: ScanFindingItem[];
  onToggle: () => void;
};

type FindingNodeData = { finding: ScanFindingItem };

function pos(index: number) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return { x: col * COL_W, y: row * ROW_H };
}

/* Agregation pure par paire de cibles (testable sans UI). */
export function pairAggregation(relations: RelationItem[]) {
  const pair = new Map<string, { count: number; types: Set<string> }>();
  for (const r of relations) {
    const a = r.source_finding_target_id;
    const b = r.target_finding_target_id;
    if (!a || !b || a === b) continue;
    const key = a < b ? a + "|" + b : b + "|" + a;
    const agg = pair.get(key) ?? { count: 0, types: new Set<string>() };
    agg.count += 1;
    if (r.relation_type) agg.types.add(r.relation_type);
    pair.set(key, agg);
  }
  return pair;
}

function TargetNode({ data }: { data: TargetNodeData }) {
  const { target, expanded, findings, onToggle } = data;
  const total = findings.length || target.finding_count || 0;
  const shown = findings.slice(0, MAX_FINDINGS);
  return (
    <div
      style={{
        width: 210,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-raised)",
        padding: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="nodrag"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{target.value}</span>
        <span
          aria-hidden
          style={{ fontSize: 11, color: "var(--text-dim)", transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          &#9656;
        </span>
      </div>
      <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2, display: "flex", justifyContent: "space-between", gap: 6 }}>
        <span>{target.type}</span>
        {total > 0 && <span>{total} finding{total > 1 ? "s" : ""}</span>}
      </div>
      {expanded && (
        <div style={{ marginTop: 6, maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {shown.map((f) => (
            <div key={f.id} style={{ padding: 4, fontSize: 11, background: "var(--surface)", borderRadius: 4 }}>
              <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.value}</div>
              <div style={{ color: "var(--text-dim)", fontSize: 10 }}>
                {f.type}
                {f.confidence ? " " + f.confidence : ""}
              </div>
            </div>
          ))}
          {findings.length > MAX_FINDINGS && (
            <div style={{ fontSize: 10, color: "var(--text-dim)" }}>+{findings.length - MAX_FINDINGS} autres</div>
          )}
        </div>
      )}
    </div>
  );
}

function FindingNode({ data }: { data: FindingNodeData }) {
  const f = data.finding;
  return (
    <div style={{ width: 150, padding: 8, fontSize: 11, borderRadius: 8, border: "1px dashed var(--border)", background: "var(--surface)" }}>
      <div style={{ fontWeight: 500 }}>{f.value}</div>
      <div style={{ color: "var(--text-dim)" }}>{f.type}</div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  target: TargetNode,
  finding: FindingNode,
};

export function InvestigationGraph({ investigationId }: { investigationId: string }) {
  const {
    data: inv,
    isLoading: invLoading,
    isError: invError,
    error: invErrData,
    refetch: refetchInv,
  } = useGetInvestigation(investigationId);
  const {
    data: relData,
    isLoading: relLoading,
    isError: relError,
    error: relErrData,
    refetch: refetchRel,
  } = useInvestigationRelations(investigationId);

  const targets: InvestigationTargetItem[] = inv?.targets ?? [];
  const relations: RelationItem[] = relData?.relations ?? [];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedFindings = useTargetFindings(investigationId, expandedId);

  const gNodes: Node[] = useMemo(
    () =>
      targets.map((t, i) => {
        const p = pos(i);
        return {
          id: "t-" + t.id,
          type: "target",
          position: p,
          data: {
            target: t,
            expanded: expandedId === t.id,
            findings: expandedId === t.id ? (expandedFindings.data?.findings ?? []) : [],
            onToggle: () => setExpandedId(expandedId === t.id ? null : t.id),
          } as TargetNodeData,
        } as Node;
      }),
    [targets, expandedId, expandedFindings.data]
  );

  const gEdges: Edge[] = useMemo(() => {
    const idx = new Map<string, number>();
    targets.forEach((t, i) => idx.set(t.id, i));
    const agg = pairAggregation(relations);
    return Array.from(agg.entries())
      .map(([key, a]) => {
        const [x, y] = key.split("|");
        const si = idx.get(x);
        const ti = idx.get(y);
        if (si === undefined || ti === undefined) return null;
        return {
          id: "e-" + key,
          source: "t-" + x,
          target: "t-" + y,
          label: a.count + (a.count > 1 ? " relations" : " relation"),
        } as Edge;
      })
      .filter((e): e is Edge => e !== null);
  }, [targets, relations]);

  const [nodeChanges, setNodeChanges] = useState<NodeChange[]>([]);
  const [edgeChanges, setEdgeChanges] = useState<EdgeChange[]>([]);
  const nodes = useMemo(() => applyNodeChanges(nodeChanges, gNodes), [nodeChanges, gNodes]);
  const edges = useMemo(() => applyEdgeChanges(edgeChanges, gEdges), [edgeChanges, gEdges]);
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodeChanges((c) => applyNodeChanges(c, changes));
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdgeChanges((c) => applyEdgeChanges(c, changes));
  }, []);

  const loading = invLoading || relLoading;
  const isError = invError || relError;
  const errData = invErrData ?? relErrData;
  const retry = () => {
    refetchInv();
    refetchRel();
  };

  return (
    <section style={{ marginTop: 24 }}>
      <SectionHeader label="Investigation graph" />
      {loading ? (
        <>
          <SkeletonLine />
          <SkeletonLine />
        </>
      ) : isError ? (
        <RequestError message={errData?.message ?? "Chargement impossible"} onRetry={retry} />
      ) : targets.length === 0 ? (
        <p style={{ color: "var(--text-dim)", fontSize: 13 }}>Aucune cible pour le moment.</p>
      ) : (
        <div style={{ height: 480, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange as OnNodesChange<Node>}
            onEdgesChange={onEdgesChange as OnEdgesChange<Edge>}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.4}
            maxZoom={1.6}
          >
            <Background gap={16} />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>
      )}
    </section>
  );
}

export function InvestigationGraphProvider({ investigationId }: { investigationId: string }) {
  return (
    <ReactFlowProvider>
      <InvestigationGraph investigationId={investigationId} />
    </ReactFlowProvider>
  );
}
