import type {
  ResearchEvidenceAssessment,
  ResearchFinding,
} from "@/types/research";

export interface ResearchFindingRepositoryDependencies {
  loadResearchFindings(): ResearchFinding[];
  saveResearchFindings(findings: ResearchFinding[]): void;
  createId(prefix: string): string;
  now(): string;
}

function normalizeResearchFinding(
  raw: ResearchFinding & {
    evidenceIds?: string[];
    validationIds?: string[];
  },
  dependencies: Pick<
    ResearchFindingRepositoryDependencies,
    "createId" | "now"
  >,
): ResearchFinding {
  const now = raw.updatedAt ?? raw.createdAt ?? dependencies.now();

  if (Array.isArray(raw.evidenceAssessments)) {
    return {
      ...raw,
      validationIds: raw.validationIds ?? [],
      createdAt: raw.createdAt ?? now,
      updatedAt: raw.updatedAt ?? now,
    };
  }

  const evidenceAssessments: ResearchEvidenceAssessment[] = (
    raw.evidenceIds ?? []
  ).map((evidenceId) => ({
    id: dependencies.createId("evidence-assessment"),
    evidenceId,
    type: "Supporting" as const,
    relevance: 0.5,
    supportStrength: 0.5,
    reliability: 0.5,
    independence: 0.5,
    rationale: "Migrated from the previous evidence relationship model.",
    assessedAt: now,
    updatedAt: now,
  }));

  return {
    id: raw.id,
    statement: raw.statement,
    evidenceAssessments,
    confidence: raw.confidence,
    validationIds: raw.validationIds ?? [],
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? now,
  };
}

export function getResearchFindings(
  dependencies: ResearchFindingRepositoryDependencies,
): ResearchFinding[] {
  return dependencies
    .loadResearchFindings()
    .map((finding) => normalizeResearchFinding(finding, dependencies));
}

export function saveResearchFinding(
  finding: ResearchFinding,
  dependencies: ResearchFindingRepositoryDependencies,
): void {
  const findings = getResearchFindings(dependencies);

  const existingIndex = findings.findIndex(
    (item) => item.id === finding.id,
  );

  if (existingIndex >= 0) {
    findings[existingIndex] = finding;
  } else {
    findings.unshift(finding);
  }

  dependencies.saveResearchFindings(findings);
}
