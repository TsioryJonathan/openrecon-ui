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

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
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
  useAdaptiveScan,
  useCorrelateInvestigation,
  useGetInvestigation,
  useInvestigationRelations,
  useScanInInvestigation,
  useTargetFindings,
} from "@/hooks/useApi";
import type {
  InvestigationTargetItem,
  RelationItem,
  ScanFindingItem,
} from "@/types/api";
import {
  dominantType,
  intraAggregation,
  neighboursOf,
  pairAggregation,
} from "./graph-aggregations";
import { NodeActionsMenu, type NodeAction } from "./NodeActionsMenu";

const COL_W = 200;
const ROW_H = 110;
const COLS = 6;
const MAX_FINDINGS = 6;
const MAX_NODES = 40;

type TargetNodeData = {
  target: InvestigationTargetItem;
  expanded: boolean;
  findings: ScanFindingItem[];
  onToggle: () => void;
  onActions: (e: React.MouseEvent) => void;
  linkCount: number;
  intraCount: number;
  focused: boolean;
  onFocus: () => void;
};

type FindingNodeData = { finding: ScanFindingItem };

function pos(index: number) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return { x: col * COL_W, y: row * ROW_H };
}

function TargetNode({ data }: { data: TargetNodeData }) {
  const { target, expanded, findings, onToggle } = data;
  const total = findings.length || target.finding_count || 0;
  const shown = findings.slice(0, MAX_FINDINGS);
  return (
    <div
      onContextMenu={data.onActions}
      style={{
        width: 180,
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
        <span title={target.value} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{target.value}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          <button
            type="button"
            aria-label={`Actions for ${target.value}`}
            aria-haspopup="menu"
            onClick={(e) => {
              e.stopPropagation();
              data.onActions(e);
            }}
            className="nodrag"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-dim)",
              cursor: "pointer",
              padding: "0 2px",
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            &#8942;
          </button>
          <span
            aria-hidden
            style={{ fontSize: 11, color: "var(--text-dim)", transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            &#9656;
          </span>
        </span>
      </div>
      <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2, display: "flex", justifyContent: "space-between", gap: 6 }}>
        <span>{target.type}</span>
        {total > 0 && <span>{total} finding{total > 1 ? "s" : ""}</span>}
      </div>
      {(data.linkCount > 0 || data.intraCount > 0) && (
        <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
          {data.linkCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onFocus();
              }}
              className="nodrag"
              style={{
                fontSize: 10,
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                background: data.focused ? "var(--accent-dim)" : "none",
                border: "1px solid " + (data.focused ? "var(--accent)" : "var(--border-subtle)"),
                color: data.focused ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {data.focused ? "isole" : data.linkCount + " liens"}
            </button>
          )}
          {data.intraCount > 0 && (
            <span
              title="Relations entre findings de cette meme cible"
              style={{ fontSize: 10, padding: "2px 6px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", color: "var(--text-dim)" }}
            >
              +{data.intraCount} int.
            </span>
          )}
        </div>
      )}
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
  const [scope, setScope] = useState<"linked" | "all">("linked");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    targetId: string;
    x: number;
    y: number;
  } | null>(null);

  const queryClient = useQueryClient();
  const scanMut = useScanInInvestigation();
  const adaptiveMut = useAdaptiveScan();
  const correlateMut = useCorrelateInvestigation();

  const busyAction: NodeAction | null = scanMut.isPending
    ? "scan"
    : adaptiveMut.isPending
    ? "adaptive"
    : correlateMut.isPending
    ? "correlate"
    : null;
  const actionError: unknown =
    scanMut.error ?? adaptiveMut.error ?? correlateMut.error ?? null;
  const actionErrorMsg = (() => {
    if (!actionError) return null;
    const e = actionError as { detail?: string; message?: string };
    return e.detail ?? e.message ?? "Action failed";
  })();

  const menuTarget = useMemo(
    () => (menu ? targets.find((t) => t.id === menu.targetId) ?? null : null),
    [menu, targets]
  );

  const openActions = useCallback(
    (targetId: string, e: { clientX: number; clientY: number; preventDefault: () => void }) => {
      e.preventDefault();
      const maxX = Math.max(8, window.innerWidth - 190);
      const maxY = Math.max(8, window.innerHeight - 170);
      setMenu({
        targetId,
        x: Math.min(Math.max(8, e.clientX), maxX),
        y: Math.min(Math.max(8, e.clientY), maxY),
      });
    },
    []
  );

  const runAction = useCallback(
    async (action: NodeAction) => {
      if (!menu || busyAction) return;
      const target = targets.find((t) => t.id === menu.targetId);
      try {
        if (action === "scan" && target) {
          await scanMut.mutateAsync({
            investigationId,
            targetType: target.type,
            targetValue: target.value,
          });
        } else if (action === "adaptive" && target) {
          await adaptiveMut.mutateAsync({
            investigationId,
            targetType: target.type,
            targetValue: target.value,
          });
        } else if (action === "correlate") {
          await correlateMut.mutateAsync({ investigationId });
        } else {
          setMenu(null);
          return;
        }
        await queryClient.invalidateQueries({ queryKey: ["investigations"] });
        setMenu(null);
      } catch {
        // surfaced through the mutation error state in the menu
      }
    },
    [menu, busyAction, targets, investigationId, scanMut, adaptiveMut, correlateMut, queryClient]
  );

  const pairs = useMemo(() => pairAggregation(relations), [relations]);
  const intra = useMemo(() => intraAggregation(relations), [relations]);

  const linkedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const key of pairs.keys()) {
      const parts = key.split("|");
      ids.add(parts[0]);
      ids.add(parts[1]);
    }
    return ids;
  }, [pairs]);

  const linkCountOf = useCallback(
    (id: string) => {
      let n = 0;
      pairs.forEach((_agg, key) => {
        const parts = key.split("|");
        if (parts[0] === id || parts[1] === id) n += 1;
      });
      return n;
    },
    [pairs]
  );

  const linkedCount = linkedIds.size;
  const focusSet = useMemo(
    () => (focusId ? neighboursOf(pairs, focusId) : null),
    [pairs, focusId]
  );
  const scopedTargets = useMemo(() => {
    const linked = targets.filter((t) => linkedIds.has(t.id));
    const base = scope === "linked" && linked.length > 0 ? linked : targets;
    return base;
  }, [targets, linkedIds, scope]);
  const visibleTargets = useMemo(() => {
    const base = focusSet ? scopedTargets.filter((t) => focusSet.has(t.id)) : scopedTargets;
    return base.slice(0, MAX_NODES);
  }, [scopedTargets, focusSet]);
  const visibleCount = visibleTargets.length;
  const isTruncated = visibleCount < (focusSet ? focusSet.size : scope === "linked" && linkedCount > 0 ? linkedCount : targets.length);
  const activeId =
    expandedId && visibleTargets.some((t) => t.id === expandedId) ? expandedId : null;
  const expandedFindings = useTargetFindings(investigationId, activeId);

  const gNodes: Node[] = useMemo(
    () =>
      visibleTargets.map((t, i) => {
        const p = pos(i);
        return {
          id: "t-" + t.id,
          type: "target",
          position: p,
          data: {
            target: t,
            expanded: activeId === t.id,
            findings: activeId === t.id ? (expandedFindings.data?.findings ?? []) : [],
            onToggle: () => setExpandedId(expandedId === t.id ? null : t.id),
            onActions: (e: React.MouseEvent) => openActions(t.id, e),
            linkCount: linkCountOf(t.id),
            intraCount: intra.get(t.id)?.count ?? 0,
            focused: focusId === t.id,
            onFocus: () => setFocusId(focusId === t.id ? null : t.id),
          } as TargetNodeData,
        } as Node;
      }),
    [visibleTargets, activeId, expandedId, expandedFindings.data, linkCountOf, intra, focusId, openActions]
  );

  const pairCount = useMemo(() => pairs.size, [pairs]);

  const gEdges: Edge[] = useMemo(() => {
    const idx = new Map<string, number>();
    visibleTargets.forEach((t, i) => idx.set(t.id, i));
    return Array.from(pairs.entries())
      .map(([key, agg]) => {
        const [x, y] = key.split("|");
        if (!idx.has(x) || !idx.has(y)) return null;
        const dom = dominantType(agg.types);
        const label =
          (dom ? dom + " " : "") +
          agg.count +
          (agg.count > 1 ? " relations" : " relation");
        return {
          id: "e-" + key,
          source: "t-" + x,
          target: "t-" + y,
          label,
        } as Edge;
      })
      .filter((e): e is Edge => e !== null);
  }, [visibleTargets, pairs]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  /* gNodes/gEdges sont derives des data : on synchronise l'etat en preservant la
     position et les mesures posees par l'utilisateur, sinon le deplacement est
     perdu a chaque rechargement. On ne rejoue pas un journal de changes, qui
     garderait un `measured` perime sur un noeud deploie. */
  useEffect(() => {
    setNodes((prev) => {
      const byId = new Map<string, Node>(prev.map((n) => [n.id, n] as const));
      return gNodes.map((g) => {
        const old = byId.get(g.id);
        if (!old) return g;
        return { ...g, position: old.position, measured: old.measured, selected: old.selected };
      });
    });
  }, [gNodes]);

  useEffect(() => {
    setEdges((prev) => {
      const byId = new Map<string, Edge>(prev.map((e) => [e.id, e] as const));
      return gEdges.map((g) => {
        const old = byId.get(g.id);
        return old ? { ...g, selected: old.selected } : g;
      });
    });
  }, [gEdges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 50);
    return () => clearTimeout(t);
  }, [focusId, scope, fitView]);

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
      ) : visibleCount === 0 ? (
        <p style={{ color: "var(--text-dim)", fontSize: 13 }}>Aucune cible pour le moment.</p>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              {focusId
                ? "Focus : " + visibleCount + " noeud" + (visibleCount > 1 ? "s" : "")
                : visibleCount + " cible" + (visibleCount > 1 ? "s" : "") + " affichee" + (visibleCount > 1 ? "s" : "")}
              {scope === "linked" && !focusId && linkedCount > 0 ? " (liees uniquement)" : ""}
              {isTruncated ? " - plafonne a " + MAX_NODES : ""} · {pairCount} lien{pairCount > 1 ? "s" : ""}
            </span>
            <span style={{ display: "flex", gap: 6 }}>
              {focusId && (
                <button
                  onClick={() => setFocusId(null)}
                  style={{ fontSize: 11, color: "var(--accent)", background: "none", border: "1px solid var(--accent)", borderRadius: "var(--radius-sm)", padding: "4px 8px", cursor: "pointer" }}
                >
                  Tout afficher
                </button>
              )}
              <button
                onClick={() => setScope(scope === "linked" ? "all" : "linked")}
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  background: "none",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                {scope === "linked" ? "Afficher toutes" : "Liees seulement"}
              </button>
            </span>
          </div>
          <div
            className="graph-canvas"
            style={{ height: 480, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}
          >
          <ReactFlow
            className="dark"
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
            <Background gap={16} color="#27272A" />
            <Controls />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) => (n.id === "t-" + focusId ? "#E7A83E" : "#3F3F46")}
            />
          </ReactFlow>
          </div>
        </div>
      )}
      {menu && menuTarget && (
        <NodeActionsMenu
          targetLabel={menuTarget.value}
          position={{ x: menu.x, y: menu.y }}
          busy={busyAction}
          error={actionErrorMsg}
          onAction={runAction}
          onClose={() => setMenu(null)}
        />
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
