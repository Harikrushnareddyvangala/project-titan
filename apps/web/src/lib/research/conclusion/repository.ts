import type {
  ResearchInvestigation,
  ResearchInvestigationConclusion,
} from "@/types/research";

export interface ResearchConclusionRepositoryDependencies {
  loadResearchInvestigationConclusions(): ResearchInvestigationConclusion[];
  saveResearchInvestigationConclusions(
    conclusions: ResearchInvestigationConclusion[],
  ): void;

  getResearchInvestigations(): ResearchInvestigation[];
  saveResearchInvestigation(
    investigation: ResearchInvestigation,
  ): void;

  createId(prefix: string): string;
  now(): string;
}

export function getResearchInvestigationConclusions(
  dependencies: ResearchConclusionRepositoryDependencies,
): ResearchInvestigationConclusion[] {
  const stored = dependencies.loadResearchInvestigationConclusions();

  return stored.map((conclusion) => ({
    ...conclusion,
    supportingFindingIds: Array.isArray(conclusion.supportingFindingIds)
      ? conclusion.supportingFindingIds
      : [],
    contradictingFindingIds: Array.isArray(
      conclusion.contradictingFindingIds,
    )
      ? conclusion.contradictingFindingIds
      : [],
  }));
}

export function saveResearchInvestigationConclusion(
  conclusion: ResearchInvestigationConclusion,
  dependencies: ResearchConclusionRepositoryDependencies,
): void {
  const conclusions =
    getResearchInvestigationConclusions(dependencies);

  const existingIndex = conclusions.findIndex(
    (item) => item.id === conclusion.id,
  );

  const nextConclusions = [...conclusions];

  if (existingIndex >= 0) {
    nextConclusions[existingIndex] = conclusion;
  } else {
    nextConclusions.unshift(conclusion);
  }

  dependencies.saveResearchInvestigationConclusions(nextConclusions);
}

export function createResearchInvestigationConclusion(
  input: Omit<
    ResearchInvestigationConclusion,
    "id" | "createdAt" | "updatedAt"
  >,
  dependencies: ResearchConclusionRepositoryDependencies,
): ResearchInvestigationConclusion {
  const now = dependencies.now();

  const conclusion: ResearchInvestigationConclusion = {
    ...input,
    id: dependencies.createId("investigation-conclusion"),
    createdAt: now,
    updatedAt: now,
  };

  saveResearchInvestigationConclusion(conclusion, dependencies);

  return conclusion;
}

export function attachResearchInvestigationConclusion(
  investigationId: string,
  conclusionId: string,
  dependencies: ResearchConclusionRepositoryDependencies,
): ResearchInvestigation | null {
  const investigations = dependencies.getResearchInvestigations();

  const investigationIndex = investigations.findIndex(
    (item) => item.id === investigationId,
  );

  if (investigationIndex < 0) {
    return null;
  }

  const conclusion = getResearchInvestigationConclusions(
    dependencies,
  ).find((item) => item.id === conclusionId);

  if (!conclusion) {
    return null;
  }

  if (conclusion.investigationId !== investigationId) {
    return null;
  }

  const investigation = investigations[investigationIndex];

  if (investigation.conclusionIds.includes(conclusionId)) {
    return investigation;
  }

  const updatedInvestigation: ResearchInvestigation = {
    ...investigation,
    conclusionIds: [
      ...investigation.conclusionIds,
      conclusionId,
    ],
    updatedAt: dependencies.now(),
  };

  dependencies.saveResearchInvestigation(updatedInvestigation);

  return updatedInvestigation;
}

export function detachResearchInvestigationConclusion(
  investigationId: string,
  conclusionId: string,
  dependencies: ResearchConclusionRepositoryDependencies,
): ResearchInvestigation | null {
  const investigations = dependencies.getResearchInvestigations();

  const investigationIndex = investigations.findIndex(
    (item) => item.id === investigationId,
  );

  if (investigationIndex < 0) {
    return null;
  }

  const investigation = investigations[investigationIndex];

  if (!investigation.conclusionIds.includes(conclusionId)) {
    return investigation;
  }

  const updatedInvestigation: ResearchInvestigation = {
    ...investigation,
    conclusionIds: investigation.conclusionIds.filter(
      (id) => id !== conclusionId,
    ),
    updatedAt: dependencies.now(),
  };

  dependencies.saveResearchInvestigation(updatedInvestigation);

  return updatedInvestigation;
}

export function createResearchConclusionRepository(
  dependencies: ResearchConclusionRepositoryDependencies,
) {
  return {
    getResearchInvestigationConclusions: () =>
      getResearchInvestigationConclusions(dependencies),

    saveResearchInvestigationConclusion: (
      conclusion: ResearchInvestigationConclusion,
    ): void =>
      saveResearchInvestigationConclusion(
        conclusion,
        dependencies,
      ),

    createResearchInvestigationConclusion: (
      input: Omit<
        ResearchInvestigationConclusion,
        "id" | "createdAt" | "updatedAt"
      >,
    ): ResearchInvestigationConclusion =>
      createResearchInvestigationConclusion(
        input,
        dependencies,
      ),

    attachResearchInvestigationConclusion: (
      investigationId: string,
      conclusionId: string,
    ): ResearchInvestigation | null =>
      attachResearchInvestigationConclusion(
        investigationId,
        conclusionId,
        dependencies,
      ),

    detachResearchInvestigationConclusion: (
      investigationId: string,
      conclusionId: string,
    ): ResearchInvestigation | null =>
      detachResearchInvestigationConclusion(
        investigationId,
        conclusionId,
        dependencies,
      ),
  };
}
