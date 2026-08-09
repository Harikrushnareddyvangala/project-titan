"use client";

import { useState } from "react";

import type { RepositoryAnalytics } from "@/types/github";

import {
  createIntelligenceSnapshot,
  saveIntelligenceSnapshot,
} from "@/lib/intelligence/snapshot";

export function useIntelligenceSnapshot() {
  const [
    snapshotCreated,
    setSnapshotCreated,
  ] = useState(false);

  const createSnapshot = (
    repository: string,
    analytics: RepositoryAnalytics,
  ) => {
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
  };

  return {
    createSnapshot,
    snapshotCreated,
    
  };
}