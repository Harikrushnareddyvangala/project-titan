import type { ResearchEvidence } from "@/types/research";

export interface ResearchEvidenceRepositoryDependencies {
  loadResearchEvidence(): ResearchEvidence[];
  saveResearchEvidence(evidence: ResearchEvidence[]): void;
}

export function getResearchEvidence(
  dependencies: ResearchEvidenceRepositoryDependencies,
): ResearchEvidence[] {
  return dependencies.loadResearchEvidence();
}

export function saveResearchEvidence(
  evidence: ResearchEvidence,
  dependencies: ResearchEvidenceRepositoryDependencies,
): void {
  const evidenceCollection = getResearchEvidence(dependencies);
  const nextEvidence = [...evidenceCollection];

  const existingIndex = nextEvidence.findIndex(
    (item) => item.id === evidence.id,
  );

  if (existingIndex >= 0) {
    nextEvidence[existingIndex] = evidence;
  } else {
    nextEvidence.unshift(evidence);
  }

  dependencies.saveResearchEvidence(nextEvidence);
}

export function createResearchEvidenceRepository(
  dependencies: ResearchEvidenceRepositoryDependencies,
) {
  return {
    getResearchEvidence: (): ResearchEvidence[] =>
      getResearchEvidence(dependencies),

    saveResearchEvidence: (
      evidence: ResearchEvidence,
    ): void =>
      saveResearchEvidence(
        evidence,
        dependencies,
      ),
  };
}
