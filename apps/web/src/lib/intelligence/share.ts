import type { IntelligenceSnapshot } from "@/types/intelligence";

const SHARE_PARAMETER = "snapshot";

export function createSnapshotShareUrl(
  snapshot: IntelligenceSnapshot,
): string {
  if (typeof window === "undefined") {
    return "";
  }

  const encoded = encodeSnapshot(snapshot);

  const url = new URL(
    window.location.href,
  );

  url.hash = "";
  url.searchParams.set(
    SHARE_PARAMETER,
    encoded,
  );

  return url.toString();
}

function encodeSnapshot(
  snapshot: IntelligenceSnapshot,
): string {
  const json = JSON.stringify(snapshot);

  const bytes = new TextEncoder().encode(
    json,
  );

  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeSnapshot(
  encoded: string,
): IntelligenceSnapshot | null {
  try {
    const normalized = encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padding =
      normalized.length % 4;

    const padded =
      padding === 0
        ? normalized
        : normalized +
          "=".repeat(4 - padding);

    const binary =
      atob(padded);

    const bytes = Uint8Array.from(
      binary,
      (character) =>
        character.charCodeAt(0),
    );

    const json =
      new TextDecoder().decode(bytes);

    const parsed: unknown =
      JSON.parse(json);

    if (
      typeof parsed !== "object" ||
      parsed === null
    ) {
      return null;
    }

    if (
      !("id" in parsed) ||
      !("repository" in parsed) ||
      !("createdAt" in parsed) ||
      !("analytics" in parsed)
    ) {
      return null;
    }

    return parsed as IntelligenceSnapshot;
  } catch {
    return null;
  }
}