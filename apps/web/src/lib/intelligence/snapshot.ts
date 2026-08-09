import type { IntelligenceSnapshot } from "@/types/intelligence";

const SNAPSHOT_STORAGE_KEY =
  "titan:intelligence-snapshots";

const MAX_SNAPSHOTS = 10;

const SNAPSHOT_CHANGE_EVENT =
  "titan:intelligence-snapshots-change";

export function getIntelligenceSnapshots(): IntelligenceSnapshot[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = localStorage.getItem(
    SNAPSHOT_STORAGE_KEY,
  );

  if (!value) {
    return [];
  }

  try {
    const parsed: unknown =
      JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is IntelligenceSnapshot =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "repository" in item &&
        "createdAt" in item &&
        "analytics" in item,
    );
  } catch {
    return [];
  }
}

export function saveIntelligenceSnapshot(
  snapshot: IntelligenceSnapshot,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const snapshots =
    getIntelligenceSnapshots();

  snapshots.unshift(snapshot);

  localStorage.setItem(
    SNAPSHOT_STORAGE_KEY,
    JSON.stringify(
      snapshots.slice(
        0,
        MAX_SNAPSHOTS,
      ),
    ),
  );

  window.dispatchEvent(
    new Event(
      SNAPSHOT_CHANGE_EVENT,
    ),
  );
}

export function deleteIntelligenceSnapshot(
  snapshotId: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const snapshots =
    getIntelligenceSnapshots();

  const filtered =
    snapshots.filter(
      (snapshot) =>
        snapshot.id !== snapshotId,
    );

  localStorage.setItem(
    SNAPSHOT_STORAGE_KEY,
    JSON.stringify(filtered),
  );

  window.dispatchEvent(
    new Event(
      SNAPSHOT_CHANGE_EVENT,
    ),
  );
}

export function clearIntelligenceSnapshots(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    SNAPSHOT_STORAGE_KEY,
  );

  window.dispatchEvent(
    new Event(
      SNAPSHOT_CHANGE_EVENT,
    ),
  );
}

export function createIntelligenceSnapshot(
  repository: string,
  analytics: IntelligenceSnapshot["analytics"],
): IntelligenceSnapshot {
  return {
    id: `snapshot-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    repository,
    createdAt:
      new Date().toISOString(),
    analytics,
  };
}

export function subscribeToIntelligenceSnapshots(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener(
    "storage",
    handleChange,
  );

  window.addEventListener(
    SNAPSHOT_CHANGE_EVENT,
    handleChange,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleChange,
    );

    window.removeEventListener(
      SNAPSHOT_CHANGE_EVENT,
      handleChange,
    );
  };
}