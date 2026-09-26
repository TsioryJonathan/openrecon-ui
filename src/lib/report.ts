/** Clipboard + file-download helpers for the markdown report. */

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/**
 * Trigger a client-side file download. The URL is revoked synchronously
 * after the click so the blob stays alive just long enough for the browser
 * to start the download.
 */
export function downloadTextFile(
  text: string,
  filename: string,
  mime = "text/markdown;charset=utf-8"
): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Filesystem-safe slug for report filenames. */
export function reportFilename(nameOrId: string): string {
  const slug = nameOrId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return `${slug || "investigation"}-report.md`;
}
