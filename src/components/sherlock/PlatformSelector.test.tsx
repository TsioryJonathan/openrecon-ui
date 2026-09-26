import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlatformSelector } from "./PlatformSelector";

vi.mock("@/hooks/useApi", () => ({
  useSites: () => ({
    data: {
      total: 3,
      categories: [
        { name: "Social", sites: ["GitHub", "Twitter"] },
        { name: "Dev", sites: ["GitLab"] },
      ],
    },
    isLoading: false,
  }),
}));

// Avoid pulling next/link through @/components/ui in a jsdom test.
vi.mock("@/components/ui", () => ({
  SkeletonLine: () => null,
}));

describe("PlatformSelector", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockReset();
  });

  function openDialog() {
    render(
      <PlatformSelector
        value={{ selectedSites: null }}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Configure platform selection" }));
  }

  it("shows the full catalog count when nothing is explicitly selected", () => {
    openDialog();
    expect(screen.getByRole("button", { name: "Configure platform selection" }))
      .toHaveTextContent("All 3 platforms");
  });

  it("shows the selection count when a subset is selected", () => {
    render(
      <PlatformSelector
        value={{ selectedSites: new Set(["GitHub"]) }}
        onChange={onChange}
      />
    );
    expect(screen.getByRole("button", { name: "Configure platform selection" }))
      .toHaveTextContent("1 selected");
  });

  it("lists every site grouped by category once opened", () => {
    openDialog();
    expect(screen.getByRole("option", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Twitter" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "GitLab" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /SOCIAL/i })).toBeInTheDocument();
  });

  it("excludes a clicked site when everything was selected", () => {
    openDialog();
    fireEvent.click(screen.getByRole("option", { name: "GitHub" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0].selectedSites as Set<string>;
    expect(next).toEqual(new Set(["Twitter", "GitLab"]));
  });

  it("reverts to null (all) when re-selecting the last missing site", () => {
    render(
      <PlatformSelector
        value={{ selectedSites: new Set(["Twitter", "GitLab"]) }}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Configure platform selection" }));
    fireEvent.click(screen.getByRole("option", { name: "GitHub" }));
    expect(onChange).toHaveBeenCalledWith({ selectedSites: null });
  });

  it("selects none via the NONE button", () => {
    openDialog();
    fireEvent.click(screen.getByRole("button", { name: "Select no platforms" }));
    const last = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(last.selectedSites).toEqual(new Set());
  });

  it("restores all via the ALL button", () => {
    render(
      <PlatformSelector
        value={{ selectedSites: new Set(["GitHub"]) }}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Configure platform selection" }));
    fireEvent.click(screen.getByRole("button", { name: "Select all platforms" }));
    expect(onChange).toHaveBeenCalledWith({ selectedSites: null });
  });

  it("filters the list with the search box", () => {
    openDialog();
    fireEvent.change(screen.getByRole("textbox", { name: "Search platforms" }), {
      target: { value: "git" },
    });
    expect(screen.getByRole("option", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "GitLab" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Twitter" })).not.toBeInTheDocument();
  });
});
