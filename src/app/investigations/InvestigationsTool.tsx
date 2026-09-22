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
  IconPlus,
  IconFolderOpen,
  IconLoading,
} from "@/lib/icons";
import {
  useListInvestigations,
  useCreateInvestigation,
} from "@/hooks/useApi";
import type { InvestigationListItem } from "@/types/api";

// ─── InvestigationsTool ─────────────────────────────────────────────────────

export function InvestigationsTool() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<string | undefined>(undefined);

  const {
    data: listData,
    isLoading: listLoading,
    refetch,
  } = useListInvestigations(filter);

  const {
    mutate: createMutate,
    isPending: creating,
    isError: createError,
    error: createErr,
    reset: createReset,
  } = useCreateInvestigation();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    createReset();
    createMutate(
      { name: n, description: description.trim() || undefined },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          refetch();
        },
      }
    );
  }

  const investigations = listData?.investigations ?? [];

  return (
    <ToolPage
      eyebrow="INVESTIGATIONS / MULTI-TARGET"
      title="Investigations"
      description="Create and manage multi-target OSINT investigations with correlation and adaptive scanning."
      icon={<IconInvestigation size={20} />}
    >
      {/* ── Create form ── */}
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
          label="New investigation"
          icon={<IconPlus size={12} />}
          action={
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                color: "var(--text-dim)",
              }}
            >
              Create a container for correlated OSINT targets
            </span>
          }
        />

        <form onSubmit={handleCreate} style={{ marginTop: "1rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <TextInput
              placeholder="Investigation name (e.g. john123 OSINT)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <ActionButton
                type="submit"
                disabled={!name.trim() || creating}
                icon={creating ? <IconLoading size={14} /> : <IconPlus size={14} />}
              >
                {creating ? "Creating..." : "Create"}
              </ActionButton>
              {createError && (
                <span style={{ color: "var(--error)", fontSize: "var(--text-xs)" }}>
                  {(createErr as { detail: string })?.detail ?? "Error"}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ── Filter tabs ── */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "All", value: undefined },
          { label: "Open", value: "open" },
          { label: "Closed", value: "closed" },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setFilter(value)}
            style={{
              padding: "0.375rem 0.875rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid",
              borderColor:
                filter === value ? "var(--accent)" : "var(--border-subtle)",
              background:
                filter === value ? "var(--accent-dim)" : "transparent",
              color:
                filter === value ? "var(--accent)" : "var(--text-muted)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Investigation list ── */}
      {listLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem",
              }}
            >
              <SkeletonLine width="40%" height="1rem" />
              <SkeletonLine width="70%" height="0.75rem" />
            </div>
          ))}
        </div>
      ) : investigations.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            color: "var(--text-dim)",
          }}
        >
          <IconFolderOpen
            size={32}
            style={{ marginBottom: "0.75rem", opacity: 0.4 }}
          />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
            No investigations yet. Create one above to get started.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {investigations.map((inv) => (
            <InvestigationCard key={inv.id} investigation={inv} />
          ))}
        </div>
      )}
    </ToolPage>
  );
}

// ─── InvestigationCard ──────────────────────────────────────────────────────

function InvestigationCard({
  investigation,
}: {
  investigation: InvestigationListItem;
}) {
  const isOpen = investigation.status === "open";

  return (
    <Link
      href={`/investigations/${investigation.id}`}
      style={{
        display: "block",
        background: "var(--surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        textDecoration: "none",
        transition: "border-color 0.15s ease, background 0.15s ease",
        cursor: "pointer",
      }}
      className="hover:border-[var(--border)] hover:bg-[var(--surface-raised)]"
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              marginBottom: "0.375rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              {investigation.name}
            </span>
            <span
              style={{
                padding: "0.125rem 0.5rem",
                borderRadius: "999px",
                fontSize: "0.625rem",
                fontWeight: 600,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: isOpen ? "var(--accent-dim)" : "var(--surface-raised)",
                color: isOpen ? "var(--accent)" : "var(--text-dim)",
                border: `1px solid ${isOpen ? "rgba(231,168,62,0.2)" : "var(--border-subtle)"}`,
              }}
            >
              {investigation.status}
            </span>
          </div>

          {investigation.description && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                color: "var(--text-dim)",
                lineHeight: 1.5,
                marginBottom: "0.5rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {investigation.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--text-dim)",
            }}
          >
            <span>{investigation.created_at.split("T")[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
