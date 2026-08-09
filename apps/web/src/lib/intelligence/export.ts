import type { IntelligenceSnapshot } from "@/types/intelligence";

export function exportIntelligenceSnapshot(
  snapshot: IntelligenceSnapshot,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify(
    snapshot,
    null,
    2,
  );

  const blob = new Blob(
    [payload],
    {
      type: "application/json",
    },
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;

  anchor.download =
    `titan-intelligence-${sanitizeFileName(
      snapshot.repository,
    )}-${formatDateForFileName(
      snapshot.createdAt,
    )}.json`;

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}

function sanitizeFileName(
  value: string,
): string {
  return value
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDateForFileName(
  value: string,
): string {
  return value
    .replace(/:/g, "-")
    .replace(/\.\d{3}Z$/, "")
    .replace("T", "-");
}