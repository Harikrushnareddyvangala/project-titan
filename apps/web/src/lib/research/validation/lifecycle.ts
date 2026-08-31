import type {
  ResearchFinding,
  ResearchFindingValidation,
  ResearchFindingValidationHistoryEvent,
  ResearchInvestigation,
  ResearchValidationDecisionResult,
  ResearchValidationStatus,
} from "@/types/research";

export interface ResearchFindingValidationDependencies {
  getResearchFindingValidations(): ResearchFindingValidation[];

  saveResearchFindingValidation(
    validation: ResearchFindingValidation,
  ): void;

  getResearchFindingValidationHistory(): ResearchFindingValidationHistoryEvent[];

  saveResearchFindingValidationHistoryEvent(
    event: ResearchFindingValidationHistoryEvent,
  ): void;

  getResearchFindings(): ResearchFinding[];

  saveResearchFinding(finding: ResearchFinding): void;

  getResearchInvestigations(): ResearchInvestigation[];

  createResearchProvenanceEvent(input: {
    investigationId: string;
    entityType: "FindingValidation";
    entityId: string;
    eventType:
      | "Validated"
      | "Rejected"
      | "RevisionRequested"
      | "StatusChanged";
    fromStatus?: string;
    toStatus?: string;
    reason?: string;
  }): unknown;

  evaluateFindingValidationEligibility(
    evidenceAssessments: ResearchFinding["evidenceAssessments"],
    confidence: ResearchFinding["confidence"],
  ): {
    eligible: boolean;
    reasons: string[];
  };

  createId(prefix: string): string;

  now(): string;
}

const RESEARCH_FINDING_VALIDATION_TRANSITIONS: Record<
  ResearchValidationStatus,
  ResearchValidationStatus[]
> = {
  Pending: ["In Review"],
  "In Review": ["Validated", "Rejected", "Needs Revision"],
  Validated: [],
  Rejected: [],
  "Needs Revision": [],
};

export function canTransitionResearchFindingValidation(
  from: ResearchValidationStatus,
  to: ResearchValidationStatus,
): boolean {
  if (from === to) {
    return true;
  }

  return (
    RESEARCH_FINDING_VALIDATION_TRANSITIONS[from]?.includes(to) ?? false
  );
}

export function transitionResearchFindingValidation(
  validationId: string,
  to: ResearchValidationStatus,
  reason: string | undefined,
  dependencies: ResearchFindingValidationDependencies,
): ResearchFindingValidation | null {
  const validations = dependencies.getResearchFindingValidations();

  const validation = validations.find(
    (item) => item.id === validationId,
  );

  if (!validation) {
    return null;
  }

  if (validation.status === to) {
    return validation;
  }

  if (
    !canTransitionResearchFindingValidation(
      validation.status,
      to,
    )
  ) {
    return null;
  }

  const normalizedReason = reason?.trim();

  if (
    (to === "Validated" ||
      to === "Rejected" ||
      to === "Needs Revision") &&
    !normalizedReason
  ) {
    return null;
  }

  const now = dependencies.now();

  const updatedValidation: ResearchFindingValidation = {
    ...validation,
    status: to,
    decision:
      to === "Validated"
        ? "Accept"
        : to === "Rejected"
          ? "Reject"
          : to === "Needs Revision"
            ? "Revise"
            : validation.decision,
    rationale: normalizedReason || validation.rationale,
    updatedAt: now,
    validatedAt:
      to === "Validated"
        ? now
        : validation.validatedAt,
  };

  dependencies.saveResearchFindingValidation(
    updatedValidation,
  );

  const historyEvent: ResearchFindingValidationHistoryEvent = {
    id: dependencies.createId(
      "finding-validation-history",
    ),
    validationId: updatedValidation.id,
    from: validation.status,
    to,
    decision: updatedValidation.decision,
    reason: normalizedReason,
    timestamp: now,
  };

  dependencies.saveResearchFindingValidationHistoryEvent(
    historyEvent,
  );

  const finding = dependencies
    .getResearchFindings()
    .find(
      (item) =>
        item.id === updatedValidation.findingId,
    );

  const investigation = finding
    ? dependencies
        .getResearchInvestigations()
        .find((item) =>
          item.findingIds.includes(finding.id),
        )
    : undefined;

  if (investigation) {
    dependencies.createResearchProvenanceEvent({
      investigationId: investigation.id,
      entityType: "FindingValidation",
      entityId: updatedValidation.id,
      eventType:
        to === "Validated"
          ? "Validated"
          : to === "Rejected"
            ? "Rejected"
            : to === "Needs Revision"
              ? "RevisionRequested"
              : "StatusChanged",
      fromStatus: validation.status,
      toStatus: to,
      reason: normalizedReason,
    });
  }

  return updatedValidation;
}

export function createResearchFindingValidation(
  findingId: string,
  input: Omit<
    ResearchFindingValidation,
    | "id"
    | "findingId"
    | "createdAt"
    | "updatedAt"
    | "validatedAt"
    | "confidenceAtValidation"
    | "evidenceAssessmentCount"
    | "supportingEvidenceCount"
    | "contradictingEvidenceCount"
  >,
  dependencies: ResearchFindingValidationDependencies,
): ResearchValidationDecisionResult {
  const findings = dependencies.getResearchFindings();

  const finding = findings.find(
    (item) => item.id === findingId,
  );

  if (!finding) {
    return {
      success: false,
      finding: null,
      validation: null,
      reasons: ["Finding was not found."],
    };
  }

  const eligibility =
    dependencies.evaluateFindingValidationEligibility(
      finding.evidenceAssessments,
      finding.confidence,
    );

  if (!eligibility.eligible) {
    return {
      success: false,
      finding,
      validation: null,
      reasons: eligibility.reasons,
    };
  }

  const now = dependencies.now();

  const supportingEvidenceCount =
    finding.evidenceAssessments.filter(
      (assessment) =>
        assessment.type === "Supporting",
    ).length;

  const contradictingEvidenceCount =
    finding.evidenceAssessments.filter(
      (assessment) =>
        assessment.type === "Contradicting",
    ).length;

  const validation: ResearchFindingValidation = {
    ...input,
    id: dependencies.createId(
      "finding-validation",
    ),
    findingId,
    confidenceAtValidation:
      finding.confidence,
    evidenceAssessmentCount:
      finding.evidenceAssessments.length,
    supportingEvidenceCount,
    contradictingEvidenceCount,
    createdAt: now,
    updatedAt: now,
    validatedAt:
      input.status === "Validated"
        ? now
        : undefined,
  };

  dependencies.saveResearchFindingValidation(
    validation,
  );

  const updatedFinding: ResearchFinding = {
    ...finding,
    validationIds: [
      ...finding.validationIds,
      validation.id,
    ],
    updatedAt: now,
  };

  dependencies.saveResearchFinding(
    updatedFinding,
  );

  return {
    success: true,
    finding: updatedFinding,
    validation,
    reasons: [],
  };
}

export function createResearchFindingValidationService(
  dependencies: ResearchFindingValidationDependencies,
) {
  return {
    canTransitionResearchFindingValidation: (
      from: ResearchValidationStatus,
      to: ResearchValidationStatus,
    ): boolean =>
      canTransitionResearchFindingValidation(
        from,
        to,
      ),

    transitionResearchFindingValidation: (
      validationId: string,
      to: ResearchValidationStatus,
      reason: string | undefined,
    ): ResearchFindingValidation | null =>
      transitionResearchFindingValidation(
        validationId,
        to,
        reason,
        dependencies,
      ),

    createResearchFindingValidation: (
      findingId: string,
      input: Omit<
        ResearchFindingValidation,
        | "id"
        | "findingId"
        | "createdAt"
        | "updatedAt"
        | "validatedAt"
        | "confidenceAtValidation"
        | "evidenceAssessmentCount"
        | "supportingEvidenceCount"
        | "contradictingEvidenceCount"
      >,
    ): ResearchValidationDecisionResult =>
      createResearchFindingValidation(
        findingId,
        input,
        dependencies,
      ),
  };
}
