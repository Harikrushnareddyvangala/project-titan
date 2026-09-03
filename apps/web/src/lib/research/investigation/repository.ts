import type { ResearchInvestigation } from "@/types/research";
import { createResearchInvestigation } from "./create";

export interface ResearchInvestigationRepositoryDependencies {
  loadResearchInvestigations(): ResearchInvestigation[];
  saveResearchInvestigations(
    investigations: ResearchInvestigation[],
  ): void;
  getCollectionSnapshotKey(): string | null;
  isServer(): boolean;
  createId(prefix: string): string;
  now(): string;
}

export interface ResearchInvestigationRepositoryState {
  investigationsSnapshot: ResearchInvestigation[];
  investigationsSnapshotRaw: string | null;
}

function normalizeResearchInvestigation(
  investigation: ResearchInvestigation,
): ResearchInvestigation {
  return {
    ...investigation,
    conclusionIds: Array.isArray(investigation.conclusionIds)
      ? investigation.conclusionIds
      : [],
  };
}

export function getResearchInvestigations(
  dependencies: ResearchInvestigationRepositoryDependencies,
  state: ResearchInvestigationRepositoryState,
): ResearchInvestigation[] {
  if (dependencies.isServer()) {
    return state.investigationsSnapshot;
  }

  const raw = dependencies.getCollectionSnapshotKey();

  if (raw === state.investigationsSnapshotRaw) {
    return state.investigationsSnapshot;
  }

  const investigations = dependencies.loadResearchInvestigations();

  state.investigationsSnapshot = investigations.map(
    normalizeResearchInvestigation,
  );
  state.investigationsSnapshotRaw = raw;

  return state.investigationsSnapshot;
}

export function saveResearchInvestigation(
  investigation: ResearchInvestigation,
  dependencies: ResearchInvestigationRepositoryDependencies,
  state: ResearchInvestigationRepositoryState,
): void {
  const investigations = getResearchInvestigations(dependencies, state);
  const nextInvestigations = [...investigations];

  const existingIndex = nextInvestigations.findIndex(
    (item) => item.id === investigation.id,
  );

  if (existingIndex >= 0) {
    nextInvestigations[existingIndex] = investigation;
  } else {
    nextInvestigations.unshift(investigation);
  }

  const serialized = JSON.stringify(nextInvestigations);

  state.investigationsSnapshot = nextInvestigations;
  state.investigationsSnapshotRaw = serialized;

  if (dependencies.isServer()) {
    return;
  }

  dependencies.saveResearchInvestigations(nextInvestigations);
}

export function createResearchInvestigationRepository(
  dependencies: ResearchInvestigationRepositoryDependencies,
) {
  const state: ResearchInvestigationRepositoryState = {
    investigationsSnapshot: [],
    investigationsSnapshotRaw: null,
  };

  return {
    getResearchInvestigations: () =>
      getResearchInvestigations(dependencies, state),

    saveResearchInvestigation: (
      investigation: ResearchInvestigation,
    ): void =>
      saveResearchInvestigation(
        investigation,
        dependencies,
        state,
      ),

    createResearchInvestigation: (
      input: Pick<
        ResearchInvestigation,
        "title" | "objective" | "question"
      > &
        Partial<
          Pick<ResearchInvestigation, "description" | "repository">
        >,
    ): ResearchInvestigation =>
      createResearchInvestigation(input, dependencies),
  };
}