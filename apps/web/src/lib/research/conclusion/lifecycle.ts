import type {
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigationConclusion,
  ResearchConclusionStatus,
} from "@/types/research";

export interface ResearchConclusionAcceptanceResult {
  eligible: boolean;
  reasons: string[];
  supportingFindingCount: number;
  validatedFindingCount: number;
}

export interface ResearchConclusionLifecycleDependencies {
  getResearchFindings: () => ResearchFinding[];
  getResearchFindingValidations: () => ResearchFindingValidation[];
  saveResearchInvestigationConclusion: (
    conclusion: ResearchInvestigationConclusion,
  ) => void;
  createResearchProvenanceEvent: (input: {
    investigationId: string;
    entityType: "Conclusion";
    entityId: string;
    eventType:
      | "Accepted"
      | "Superseded"
      | "StatusChanged";
    fromStatus?: ResearchConclusionStatus;
    toStatus?: ResearchConclusionStatus;
  }) => void;
  now: () => string;
}

const RESEARCH_CONCLUSION_TRANSITIONS: Record<
  ResearchConclusionStatus,
  ResearchConclusionStatus[]
> = {
  Draft: ["Proposed"],
  Proposed: ["Accepted", "Draft"],
  Accepted: ["Superseded"],
  Superseded: [],
};

export function canTransitionResearchInvestigationConclusion(
  from: ResearchConclusionStatus,
  to: ResearchConclusionStatus,
): boolean {
  if (from === to) {
    return true;
  }

  return RESEARCH_CONCLUSION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function evaluateResearchInvestigationConclusionAcceptance(
  conclusion: ResearchInvestigationConclusion,
  dependencies: Pick<
    ResearchConclusionLifecycleDependencies,
    "getResearchFindings" | "getResearchFindingValidations"
  >,
): ResearchConclusionAcceptanceResult {
  const reasons: string[] = [];

  const findings = dependencies.getResearchFindings();
  const validations = dependencies.getResearchFindingValidations();

  const supportingFindingCount = conclusion.supportingFindingIds.length;

  if (supportingFindingCount === 0) {
    reasons.push("At least one supporting finding is required.");

    return {
      eligible: false,
      reasons,
      supportingFindingCount: 0,
      validatedFindingCount: 0,
    };
  }

  let validatedFindingCount = 0;

  for (const findingId of conclusion.supportingFindingIds) {
    const finding = findings.find((item) => item.id === findingId);

    if (!finding) {
      reasons.push(`Supporting finding ${findingId} was not found.`);
      continue;
    }

    const validated = finding.validationIds.some((validationId) => {
      const validation = validations.find(
        (item) => item.id === validationId,
      );

      return validation?.status === "Validated";
    });

    if (validated) {
      validatedFindingCount += 1;
    } else {
      reasons.push(
        `Supporting finding "${finding.statement}" has not been validated.`,
      );
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    supportingFindingCount,
    validatedFindingCount,
  };
}

export function transitionResearchInvestigationConclusion(
  conclusion: ResearchInvestigationConclusion,
  to: ResearchConclusionStatus,
  dependencies: ResearchConclusionLifecycleDependencies,
): ResearchInvestigationConclusion | null {
  if (conclusion.status === to) {
    return conclusion;
  }

  if (!canTransitionResearchInvestigationConclusion(conclusion.status, to)) {
    return null;
  }

  if (to === "Accepted") {
    const acceptance = evaluateResearchInvestigationConclusionAcceptance(
      conclusion,
      dependencies,
    );

    if (!acceptance.eligible) {
      return null;
    }
  }

  const updatedConclusion: ResearchInvestigationConclusion = {
    ...conclusion,
    status: to,
    updatedAt: dependencies.now(),
  };

  dependencies.saveResearchInvestigationConclusion(updatedConclusion);

  dependencies.createResearchProvenanceEvent({
    investigationId: conclusion.investigationId,
    entityType: "Conclusion",
    entityId: conclusion.id,
    eventType:
      to === "Accepted"
        ? "Accepted"
        : to === "Superseded"
          ? "Superseded"
          : "StatusChanged",
    fromStatus: conclusion.status,
    toStatus: to,
  });

  return updatedConclusion;
}
