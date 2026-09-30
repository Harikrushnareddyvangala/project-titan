"use client";

import { useCallback, useEffect, useState } from "react";

import type { IntelligenceSnapshot } from "@/types/intelligence";

import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

interface IntelligenceSnapshotsResult {
  snapshots: IntelligenceSnapshot[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  deleteSnapshot: (snapshotId: string) => Promise<void>;
}

export function useIntelligenceSnapshots(): IntelligenceSnapshotsResult {
  const [snapshots, setSnapshots] = useState<IntelligenceSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const authenticatedFetch = useAuthenticatedFetch();

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const deleteSnapshot = useCallback(
    async (snapshotId: string) => {
      const id = snapshotId.trim();

      if (!id) {
        throw new Error("Invalid intelligence snapshot.");
      }

      const response = await authenticatedFetch(
        `/api/intelligence/snapshots/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        let message = "Intelligence snapshot deletion failed.";

        try {
          const data: unknown = await response.json();

          if (
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
          ) {
            message = data.error;
          }
        } catch {
          // Preserve the default deletion error when the response has no JSON body.
        }

        throw new Error(message);
      }

      setSnapshots((current) =>
        current.filter((snapshot) => snapshot.id !== id),
      );

      refresh();
    },
    [authenticatedFetch, refresh],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response = await authenticatedFetch(
          "/api/intelligence/snapshots",
        );

        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Intelligence snapshot retrieval failed.";

          throw new Error(message);
        }

        if (
          typeof data !== "object" ||
          data === null ||
          !("snapshots" in data) ||
          !Array.isArray(data.snapshots)
        ) {
          throw new Error("Invalid intelligence snapshot response.");
        }

        if (cancelled) {
          return;
        }

        setSnapshots(data.snapshots as IntelligenceSnapshot[]);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setSnapshots([]);
        setError(
          err instanceof Error
            ? err.message
            : "Intelligence snapshot retrieval failed.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [authenticatedFetch, refreshKey]);

  return {
    snapshots,
    loading,
    error,
    refresh,
    deleteSnapshot,
  };
}
