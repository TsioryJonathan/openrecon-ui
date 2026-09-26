import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NodeActionsMenu } from "./NodeActionsMenu";

function renderMenu(overrides: Partial<Parameters<typeof NodeActionsMenu>[0]> = {}) {
  const onAction = vi.fn();
  const onClose = vi.fn();
  render(
    <NodeActionsMenu
      targetLabel="acme.example"
      position={{ x: 100, y: 100 }}
      busy={null}
      onAction={onAction}
      onClose={onClose}
      {...overrides}
    />
  );
  return { onAction, onClose };
}

describe("NodeActionsMenu", () => {
  it("offers the three node actions", () => {
    renderMenu();
    const menu = screen.getByRole("menu", { name: "Actions for acme.example" });
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Scan" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Adaptive scan" })
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Correlate" })).toBeInTheDocument();
  });

  it("dispatches the clicked action", () => {
    const { onAction } = renderMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "Adaptive scan" }));
    expect(onAction).toHaveBeenCalledWith("adaptive");
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("disables every item while an action is running", () => {
    const { onAction } = renderMenu({ busy: "scan" });
    const scan = screen.getByRole("menuitem", { name: "Scan…" });
    expect(scan).toBeDisabled();
    expect(screen.getByRole("menuitem", { name: "Adaptive scan" })).toBeDisabled();
    expect(screen.getByRole("menuitem", { name: "Correlate" })).toBeDisabled();
    fireEvent.click(scan);
    expect(onAction).not.toHaveBeenCalled();
  });

  it("surfaces action errors", () => {
    renderMenu({ error: "API unreachable" });
    expect(screen.getByRole("alert")).toHaveTextContent("API unreachable");
  });

  it("closes on Escape", () => {
    const { onClose } = renderMenu();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on outside mousedown", () => {
    const { onClose } = renderMenu();
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stays open on mousedown inside the menu", () => {
    const { onClose } = renderMenu();
    fireEvent.mouseDown(screen.getByRole("menuitem", { name: "Scan" }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
