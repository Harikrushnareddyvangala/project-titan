"use client";

import { useCallback, useState } from "react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

import type {
  IntelligenceArtifact,
  IntelligenceSnapshot,
} from "@/types/intelligence";

import { createIntelligenceSnapshot } from "@/lib/intelligence/snapshot";

import { createIntelligenceArtifact } from "@/lib/intelligence/artifact";

import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

export function useIntelligenceSnapshot() {
  const [
    snapshotCreated,
    setSnapshotCreated,
  ] = useState(false);

  const [snapshotError, setSnapshotError] = useState<string | null>(null);

  const authenticatedFetch = useAuthenticatedFetch();

  

  const createSnapshot = useCallback(
    async (
      repository: string,
      analytics: RepositoryAnalytics,
    ): Promise<IntelligenceSnapshot> => {
      setSnapshotError(null);

      try {
        const snapshot =
          createIntelligenceSnapshot(
            repository,
            analytics,
          );

        const response = await authenticatedFetch("/api/intelligence/snapshots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ snapshot }),
        });

        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof data.message === "string"
              ? data.message
              : "Failed to persist intelligence snapshot.";

          throw new Error(message);
        }

        if (
          typeof data !== "object" ||
          data === null ||
          !("snapshot" in data)
        ) {
          throw new Error("Invalid intelligence snapshot response.");
        }

        const persistedSnapshot = data.snapshot as IntelligenceSnapshot;

        setSnapshotCreated(true);

        window.setTimeout(() => {
          setSnapshotCreated(false);
        }, 2000);

        return persistedSnapshot;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to persist intelligence snapshot.";

        setSnapshotError(message);
        throw error instanceof Error
          ? error
          : new Error(message);
      }
    },
    [authenticatedFetch],
  );

  const createArtifact = useCallback(
    async (
      snapshot: IntelligenceSnapshot,
    ): Promise<IntelligenceArtifact> => {
      const artifact = createIntelligenceArtifact(snapshot);

      const response = await authenticatedFetch(
        "/api/intelligence/artifacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ artifact }),
        },
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Failed to persist intelligence artifact.";

        throw new Error(message);
      }

      if (
        typeof data !== "object" ||
        data === null ||
        !("artifactId" in data) ||
        typeof data.artifactId !== "string"
      ) {
        throw new Error("Invalid intelligence artifact response.");
      }

      return data as IntelligenceArtifact;
    },
    [authenticatedFetch],
  );

  return {
    createSnapshot,
    createArtifact,
    snapshotCreated,
    snapshotError,
  };
}
