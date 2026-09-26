import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { copyText, downloadTextFile, reportFilename } from "./report";

describe("copyText", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
      writable: true,
    });
  });

  it("writes the text to the clipboard", async () => {
    await copyText("# hello");
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("# hello");
  });

  it("propagates clipboard failures so callers can surface them", async () => {
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("denied")
    );
    await expect(copyText("# nope")).rejects.toThrow("denied");
  });
});

describe("downloadTextFile", () => {
  const createObjectURL = vi.fn<(blob: Blob) => string>(() => "blob:test-url");
  const revokeObjectURL = vi.fn();
  let clickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeObjectURL as unknown as typeof URL.revokeObjectURL;
    clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        /* jsdom navigation not implemented */
      });
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it("creates a blob URL, clicks a download anchor and revokes the URL", () => {
    downloadTextFile("# report", "case-report.md");

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0];
    expect(blob.type).toBe("text/markdown;charset=utf-8");
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test-url");
  });

  it("names the anchor after the requested filename", () => {
    let seen: string | null = null;
    clickSpy.mockImplementation(function (this: HTMLAnchorElement) {
      seen = this.download;
    });
    downloadTextFile("x", "case-report.md");
    expect(seen).toBe("case-report.md");
  });
});

describe("reportFilename", () => {
  it("slugifies the investigation name", () => {
    expect(reportFilename("Acme Probe #7")).toBe("acme-probe-7-report.md");
  });

  it("falls back to 'investigation' for empty or symbol-only names", () => {
    expect(reportFilename("")).toBe("investigation-report.md");
    expect(reportFilename("   ")).toBe("investigation-report.md");
    expect(reportFilename("###")).toBe("investigation-report.md");
  });

  it("caps very long names", () => {
    const name = reportFilename("a".repeat(200));
    expect(name.length).toBeLessThanOrEqual(64 + "-report.md".length);
  });
});
