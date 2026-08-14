"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  getResearchInvestigations,
  saveResearchInvestigation,
  subscribeToResearch,
} from "@/lib/research";

import type {
  ResearchInvestigation,
  ResearchStatus,
} from "@/types/research";

const EMPTY_INVESTIGATIONS: ResearchInvestigation[] = [];

export function useResearchInvestigations() {
  const investigations =
    useSyncExternalStore(
      subscribeToResearch,
      getResearchInvestigations,
      () => EMPTY_INVESTIGATIONS,
    );

  const save = useCallback(
    (
      investigation: ResearchInvestigation,
    ) => {
      saveResearchInvestigation(
        investigation,
      );
    },
    [],
  );

  const updateStatus = useCallback(
    (
      investigation: ResearchInvestigation,
      status: ResearchStatus,
    ) => {
      saveResearchInvestigation({
        ...investigation,
        status,
        updatedAt:
          new Date().toISOString(),
      });
    },
    [],
  );

  return {
    investigations,
    save,
    updateStatus,
  };
}