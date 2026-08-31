import type {
  ResearchEvidenceAssessment,
  ResearchFinding,
} from "@/types/research";

export interface ResearchEvidenceAssessmentDependencies {
  getResearchFindings: () => ResearchFinding[];
  saveResearchFinding: (finding: ResearchFinding) => void;
  createId: (prefix: string) => string;
  now: () => string;
}

export function createResearchEvidenceAssessment(
  input: Omit<ResearchEvidenceAssessment, "id" | "assessedAt" | "updatedAt">,
  dependencies: ResearchEvidenceAssessmentDependencies,
): ResearchEvidenceAssessment {
  const now = dependencies.now();

  return {
    ...input,
    id: dependencies.createId("evidence-assessment"),
    assessedAt: now,
    updatedAt: now,
  };
}

export function updateResearchFindingEvidenceAssessment(
  findingId: string,
  assessment: ResearchEvidenceAssessment,
  dependencies: ResearchEvidenceAssessmentDependencies,
): ResearchFinding | null {
  const findings = dependencies.getResearchFindings();

  const findingIndex = findings.findIndex(
    (finding) => finding.id === findingId,
  );

  if (findingIndex < 0) {
    return null;
  }

  const finding = findings[findingIndex];

  const existingAssessmentIndex =
    finding.evidenceAssessments.findIndex(
      (item) => item.id === assessment.id,
    );

  const evidenceAssessments = [...finding.evidenceAssessments];

  if (existingAssessmentIndex >= 0) {
    evidenceAssessments[existingAssessmentIndex] = assessment;
  } else {
    evidenceAssessments.push(assessment);
  }

  const updatedFinding: ResearchFinding = {
    ...finding,
    evidenceAssessments,
    updatedAt: dependencies.now(),
  };

  dependencies.saveResearchFinding(updatedFinding);

  return updatedFinding;
}

export function removeResearchFindingEvidenceAssessment(
  findingId: string,
  assessmentId: string,
  dependencies: ResearchEvidenceAssessmentDependencies,
): ResearchFinding | null {
  const findings = dependencies.getResearchFindings();

  const finding = findings.find(
    (item) => item.id === findingId,
  );

  if (!finding) {
    return null;
  }

  const updatedFinding: ResearchFinding = {
    ...finding,
    evidenceAssessments: finding.evidenceAssessments.filter(
      (assessment) => assessment.id !== assessmentId,
    ),
    updatedAt: dependencies.now(),
  };

  dependencies.saveResearchFinding(updatedFinding);

  return updatedFinding;
}

export function createResearchEvidenceAssessmentService(
  dependencies: ResearchEvidenceAssessmentDependencies,
) {
  return {
    createResearchEvidenceAssessment: (
      input: Omit<
        ResearchEvidenceAssessment,
        "id" | "assessedAt" | "updatedAt"
      >,
    ): ResearchEvidenceAssessment =>
      createResearchEvidenceAssessment(
        input,
        dependencies,
      ),

    updateResearchFindingEvidenceAssessment: (
      findingId: string,
      assessment: ResearchEvidenceAssessment,
    ): ResearchFinding | null =>
      updateResearchFindingEvidenceAssessment(
        findingId,
        assessment,
        dependencies,
      ),

    removeResearchFindingEvidenceAssessment: (
      findingId: string,
      assessmentId: string,
    ): ResearchFinding | null =>
      removeResearchFindingEvidenceAssessment(
        findingId,
        assessmentId,
        dependencies,
      ),
  };
}
