"use client";

import type { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  GhostButton,
  SectionHeader,
  SkeletonLine,
  RequestError,
} from "@/components/ui";
import { IconClose } from "@/lib/icons";
import {
  useInvestigationRelations,
  useInvestigationReport,
} from "@/hooks/useApi";
import type { RelationItem } from "@/types/api";

function Modal({
  title,
  count,
  onClose,
  children,
}: {
  title: string;
  count?: number;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      onClick={onClose}
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
          <SectionHeader label={title} count={count} />
          <GhostButton
            type="button"
            onClick={onClose}
            icon={<IconClose size={14} />}
          >
            Close
          </GhostButton>
        </div>
        {children}
      </div>
    </div>
  );
}

function LoadingRows() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <SkeletonLine width="100%" height="0.875rem" />
      <SkeletonLine width="80%" height="0.875rem" />
      <SkeletonLine width="60%" height="0.875rem" />
    </div>
  );
}

export function RelationsModal({
  investigationId,
  onClose,
}: {
  investigationId: string;
  onClose: () => void;
}) {
  const { data, isLoading, isError, error, refetch } =
    useInvestigationRelations(investigationId);

  let body: ReactNode;
  if (isLoading) {
    body = <LoadingRows />;
  } else if (isError) {
    body = (
      <RequestError
        message={
          (error as { detail?: string } | null)?.detail ??
          "Failed to load relations."
        }
        onRetry={refetch}
      />
    );
  } else if (data && data.relations.length > 0) {
    body = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {data.relations.map((r) => (
          <RelationRow key={r.id} relation={r} />
        ))}
      </div>
    );
  } else {
    body = (
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          color: "var(--text-dim)",
        }}
      >
        No relations yet. Run correlation first.
      </p>
    );
  }

  return (
    <Modal
      title="Relations"
      count={data?.relation_count}
      onClose={onClose}
    >
      {body}
    </Modal>
  );
}

export function ReportModal({
  investigationId,
  onClose,
}: {
  investigationId: string;
  onClose: () => void;
}) {
  const { data, isLoading, isError, error, refetch } =
    useInvestigationReport(investigationId);

  let body: ReactNode;
  if (isLoading) {
    body = <LoadingRows />;
  } else if (isError) {
    body = (
      <RequestError
        message={
          (error as { detail?: string } | null)?.detail ??
          "Failed to load the report."
        }
        onRetry={refetch}
      />
    );
  } else {
    body = (
      <div className="md-report animate-fade-in">
        {data ? <Markdown remarkPlugins={[remarkGfm]}>{data}</Markdown> : null}
      </div>
    );
  }

  return <Modal title="Report" onClose={onClose}>{body}</Modal>;
}

export function RelationRow({ relation }: { relation: RelationItem }) {
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