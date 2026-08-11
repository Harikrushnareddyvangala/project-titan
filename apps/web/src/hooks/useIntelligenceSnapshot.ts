"use client";

import { useCallback, useState } from "react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

import type {
  IntelligenceArtifact,
  IntelligenceSnapshot,
} from "@/types/intelligence";

import {
  createIntelligenceSnapshot,
  saveIntelligenceSnapshot,
} from "@/lib/intelligence/snapshot";

import {
  createAndSaveIntelligenceArtifact,
} from "@/lib/intelligence/artifactService";

export function useIntelligenceSnapshot() {
  const [
    snapshotCreated,
    setSnapshotCreated,
  ] = useState(false);

  

  const createSnapshot = useCallback(
    (
      repository: string,
      analytics: RepositoryAnalytics,
    ): IntelligenceSnapshot => {
      const snapshot =
        createIntelligenceSnapshot(
          repository,
          analytics,
        );

      saveIntelligenceSnapshot(
        snapshot,
      );

      setSnapshotCreated(true);

      

      window.setTimeout(() => {
        setSnapshotCreated(false);
      }, 2000);

      return snapshot;
    },
    [],
  );

  const createArtifact = useCallback(
    (
      snapshot: IntelligenceSnapshot,
    ): IntelligenceArtifact => {
      return createAndSaveIntelligenceArtifact(
        snapshot,
      );
    },
    [],
  );

  return {
    createSnapshot,
    createArtifact,
    snapshotCreated,
    
  };
}