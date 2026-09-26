import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ReportModal } from "./InvestigationModals";

type ReportState = {
  data?: string;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
};

const mocks = vi.hoisted(() => ({
  copyText: vi.fn(),
  downloadTextFile: vi.fn(),
  report: null as ReportState | null,
}));

vi.mock("@/lib/report", async (importOriginal: () => Promise<unknown>) => {
  const actual = (await importOriginal()) as typeof import("@/lib/report");
  return {
    ...actual,
    copyText: mocks.copyText,
    downloadTextFile: mocks.downloadTextFile,
  };
});

vi.mock("@/hooks/useApi", () => ({
  useInvestigationReport: () => ({
    data: mocks.report?.data ?? null,
    isLoading: mocks.report?.isLoading ?? false,
    isError: mocks.report?.isError ?? false,
    error: mocks.report?.error ?? null,
    refetch: vi.fn(),
  }),
  useInvestigationRelations: () => ({
    data: { relations: [], relation_count: 0 },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

// Avoid pulling next/link through @/components/ui in a jsdom test.
vi.mock("@/components/ui", async () => {
  const react = await import("react");
  return {
    GhostButton: ({
      children,
      onClick,
    }: {
      children?: ReactNode;
      onClick?: () => void;
    }) => react.createElement("button", { onClick }, children),
    SectionHeader: ({ label }: { label: string }) =>
      react.createElement("h3", null, label),
    SkeletonLine: () => null,
    RequestError: ({ message }: { message: string }) =>
      react.createElement("p", null, message),
  };
});

describe("ReportModal", () => {
  beforeEach(() => {
    mocks.copyText.mockReset().mockResolvedValue(undefined);
    mocks.downloadTextFile.mockReset();
    mocks.report = { data: "# Investigation: Acme\n\nHello report", isLoading: false, isError: false };
  });

  it("renders the markdown preview", () => {
    render(<ReportModal investigationId="inv1" onClose={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: "Investigation: Acme" })
    ).toBeInTheDocument();
    expect(screen.getByText("Hello report")).toBeInTheDocument();
  });

  it("copies the raw markdown", async () => {
    render(<ReportModal investigationId="inv1" onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy markdown" }));
    expect(mocks.copyText).toHaveBeenCalledWith(
      "# Investigation: Acme\n\nHello report"
    );
    // aria-live feedback
    expect(await screen.findByText("Copied to clipboard")).toBeInTheDocument();
  });

  it("surfaces copy failures", async () => {
    mocks.copyText.mockRejectedValue(new Error("denied"));
    render(<ReportModal investigationId="inv1" onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy markdown" }));
    expect(await screen.findByText("Copy failed")).toBeInTheDocument();
  });

  it("downloads a .md named after the investigation", () => {
    render(
      <ReportModal
        investigationId="inv1"
        investigationName="Acme Probe"
        onClose={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Download .md" }));
    expect(mocks.downloadTextFile).toHaveBeenCalledWith(
      "# Investigation: Acme\n\nHello report",
      "acme-probe-report.md"
    );
  });

  it("falls back to the investigation id for the filename", () => {
    render(<ReportModal investigationId="inv-42" onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Download .md" }));
    expect(mocks.downloadTextFile).toHaveBeenCalledWith(
      expect.any(String),
      "inv-42-report.md"
    );
  });

  it("hides the toolbar while loading", () => {
    mocks.report = { isLoading: true };
    render(<ReportModal investigationId="inv1" onClose={vi.fn()} />);
    expect(
      screen.queryByRole("button", { name: "Copy markdown" })
    ).not.toBeInTheDocument();
  });
});
