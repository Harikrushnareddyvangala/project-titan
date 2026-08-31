import { describe, expect, it } from "vitest";

import type {
  ResearchFinding,
  ResearchFindingValidation,
  ResearchFindingValidationHistoryEvent,
  ResearchInvestigation,
  ResearchValidationStatus,
} from "@/types/research";

import {
  canTransitionResearchFindingValidation,
  createResearchFindingValidation,
  createResearchFindingValidationService,
  transitionResearchFindingValidation,
  type ResearchFindingValidationDependencies,
} from "../lifecycle";

function createFinding(
  overrides: Partial<ResearchFinding> = {},
): ResearchFinding {
  return {
    id: "finding-001",
    statement: "Observed research finding.",
    evidenceAssessments: [
      {
        id: "assessment-001",
        evidenceId: "evidence-001",
        type: "Supporting",
        relevance: 0.9,
        supportStrength: 0.8,
        reliability: 0.95,
        independence: 0.9,
        assessedAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    confidence: 0.85,
    validationIds: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function createValidation(
  overrides: Partial<ResearchFindingValidation> = {},
): ResearchFindingValidation {
  return {
    id: "validation-001",
    findingId: "finding-001",
    status: "Pending",
    decision: "Accept",
    rationale: "Initial validation.",
    confidenceAtValidation: 0.85,
    evidenceAssessmentCount: 1,
    supportingEvidenceCount: 1,
    contradictingEvidenceCount: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    validatedAt: undefined,
    ...overrides,
  };
}

function createDependencies(
  overrides: Partial<ResearchFindingValidationDependencies> = {},
) {
  const validations: ResearchFindingValidation[] = [
    createValidation(),
  ];

  const findings: ResearchFinding[] = [createFinding()];

  const investigations: ResearchInvestigation[] = [
    {
      id: "investigation-001",
      title: "Validation investigation",
      objective: "Test validation lifecycle.",
      question: "Does validation lifecycle remain deterministic?",
      status: "Draft",
      experimentIds: [],
      evidenceIds: ["evidence-001"],
      findingIds: ["finding-001"],
      artifactIds: [],
      conclusionIds: [],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  const history: ResearchFindingValidationHistoryEvent[] = [];
  const provenanceEvents: unknown[] = [];

  const dependencies: ResearchFindingValidationDependencies = {
    getResearchFindingValidations: () => validations,
    saveResearchFindingValidation: (validation) => {
      const index = validations.findIndex((item) => item.id === validation.id);

      if (index === -1) {
        validations.push(validation);
      } else {
        validations[index] = validation;
      }
    },
    getResearchFindingValidationHistory: () => history,
    saveResearchFindingValidationHistoryEvent: (event) => {
      history.push(event);
    },
    getResearchFindings: () => findings,
    saveResearchFinding: (finding) => {
      const index = findings.findIndex((item) => item.id === finding.id);

      if (index === -1) {
        findings.push(finding);
      } else {
        findings[index] = finding;
      }
    },
    getResearchInvestigations: () => investigations,
    createResearchProvenanceEvent: (input) => {
      provenanceEvents.push(input);
      return input;
    },
    evaluateFindingValidationEligibility: () => ({
      eligible: true,
      reasons: [],
    }),
    createId: (prefix) => `${prefix}-generated`,
    now: () => "2026-01-02T00:00:00.000Z",
    ...overrides,
  };

  return {
    dependencies,
    validations,
    findings,
    investigations,
    history,
    provenanceEvents,
  };
}

describe("research finding validation lifecycle", () => {
  it("allows the canonical Pending to In Review transition", () => {
    expect(
      canTransitionResearchFindingValidation(
        "Pending",
        "In Review",
      ),
    ).toBe(true);
  });

  it("allows terminal decisions from In Review", () => {
    expect(
      canTransitionResearchFindingValidation(
        "In Review",
        "Validated",
      ),
    ).toBe(true);

    expect(
      canTransitionResearchFindingValidation(
        "In Review",
        "Rejected",
      ),
    ).toBe(true);

    expect(
      canTransitionResearchFindingValidation(
        "In Review",
        "Needs Revision",
      ),
    ).toBe(true);
  });

  it("rejects transitions out of terminal states", () => {
    const terminalStates: ResearchValidationStatus[] = [
      "Validated",
      "Rejected",
      "Needs Revision",
    ];

    for (const status of terminalStates) {
      expect(
        canTransitionResearchFindingValidation(status, "Pending"),
      ).toBe(false);
    }
  });

  it("treats a same-status transition as valid", () => {
    expect(
      canTransitionResearchFindingValidation("Pending", "Pending"),
    ).toBe(true);
  });

  it("returns null when the validation does not exist", () => {
    const { dependencies } = createDependencies();

    expect(
      transitionResearchFindingValidation(
        "missing-validation",
        "In Review",
        undefined,
        dependencies,
      ),
    ).toBeNull();
  });

  it("returns the existing validation for a same-status transition", () => {
    const { dependencies, validations } = createDependencies();

    const result = transitionResearchFindingValidation(
      "validation-001",
      "Pending",
      undefined,
      dependencies,
    );

    expect(result).toBe(validations[0]);
  });

  it("requires a reason for terminal validation decisions", () => {
    const { dependencies } = createDependencies();

    const movedToReview = transitionResearchFindingValidation(
      "validation-001",
      "In Review",
      undefined,
      dependencies,
    );

    expect(movedToReview?.status).toBe("In Review");

    expect(
      transitionResearchFindingValidation(
        "validation-001",
        "Validated",
        "   ",
        dependencies,
      ),
    ).toBeNull();
  });

  it("updates the decision and timestamps when validating", () => {
    const { dependencies, validations } = createDependencies();

    transitionResearchFindingValidation(
      "validation-001",
      "In Review",
      "Begin review",
      dependencies,
    );

    const result = transitionResearchFindingValidation(
      "validation-001",
      "Validated",
      "Evidence is sufficient.",
      dependencies,
    );

    expect(result).not.toBeNull();
    expect(result?.status).toBe("Validated");
    expect(result?.decision).toBe("Accept");
    expect(result?.rationale).toBe("Evidence is sufficient.");
    expect(result?.validatedAt).toBe("2026-01-02T00:00:00.000Z");
    expect(result?.updatedAt).toBe("2026-01-02T00:00:00.000Z");
    expect(validations[0].status).toBe("Validated");
  });

  it("maps rejection to Reject", () => {
    const { dependencies } = createDependencies({
      getResearchFindingValidations: () => [
        createValidation({
          status: "In Review",
        }),
      ],
    });

    const result = transitionResearchFindingValidation(
      "validation-001",
      "Rejected",
      "Evidence contradicts the finding.",
      dependencies,
    );

    expect(result?.decision).toBe("Reject");
    expect(result?.status).toBe("Rejected");
  });

  it("maps revision requests to Revise", () => {
    const { dependencies } = createDependencies({
      getResearchFindingValidations: () => [
        createValidation({
          status: "In Review",
        }),
      ],
    });

    const result = transitionResearchFindingValidation(
      "validation-001",
      "Needs Revision",
      "Additional evidence is required.",
      dependencies,
    );

    expect(result?.decision).toBe("Revise");
    expect(result?.status).toBe("Needs Revision");
  });

  it("records validation history", () => {
    const { dependencies, history } = createDependencies();

    transitionResearchFindingValidation(
      "validation-001",
      "In Review",
      "Begin review",
      dependencies,
    );

    expect(history).toHaveLength(1);
    expect(history[0].validationId).toBe("validation-001");
    expect(history[0].from).toBe("Pending");
    expect(history[0].to).toBe("In Review");
    expect(history[0].reason).toBe("Begin review");
  });

  it("emits provenance for an investigation-scoped validation transition", () => {
    const { dependencies, provenanceEvents } = createDependencies();

    transitionResearchFindingValidation(
      "validation-001",
      "In Review",
      "Begin review",
      dependencies,
    );

    expect(provenanceEvents).toHaveLength(1);
    expect(provenanceEvents[0]).toMatchObject({
      investigationId: "investigation-001",
      entityType: "FindingValidation",
      entityId: "validation-001",
      eventType: "StatusChanged",
      fromStatus: "Pending",
      toStatus: "In Review",
      reason: "Begin review",
    });
  });

  it("creates an eligible finding validation with an evidence snapshot", () => {
    const { dependencies, findings, validations } = createDependencies();

    const result = createResearchFindingValidation(
      "finding-001",
      {
        status: "Validated",
        decision: "Accept",
        rationale: "The evidence sufficiently supports the finding.",
      },
      dependencies,
    );

    expect(result.success).toBe(true);
    expect(result.validation).not.toBeNull();
    expect(result.finding).not.toBeNull();
    expect(result.reasons).toEqual([]);

    expect(result.validation).toMatchObject({
      id: "finding-validation-generated",
      findingId: "finding-001",
      confidenceAtValidation: 0.85,
      evidenceAssessmentCount: 1,
      supportingEvidenceCount: 1,
      contradictingEvidenceCount: 0,
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
      validatedAt: "2026-01-02T00:00:00.000Z",
    });

    expect(validations).toHaveLength(2);
    expect(findings[0].validationIds).toContain(
      "finding-validation-generated",
    );
  });

  it("rejects validation creation for an unknown finding", () => {
    const { dependencies } = createDependencies();

    const result = createResearchFindingValidation(
      "missing-finding",
      {
        status: "Pending",
        decision: "Accept",
        rationale: "Cannot validate a missing finding.",
      },
      dependencies,
    );

    expect(result.success).toBe(false);
    expect(result.validation).toBeNull();
    expect(result.finding).toBeNull();
    expect(result.reasons).toEqual(["Finding was not found."]);
  });

  it("rejects validation creation when eligibility fails", () => {
    const { dependencies } = createDependencies({
      evaluateFindingValidationEligibility: () => ({
        eligible: false,
        reasons: ["Finding does not meet validation requirements."],
      }),
    });

    const result = createResearchFindingValidation(
      "finding-001",
      {
        status: "Pending",
        decision: "Accept",
        rationale: "Attempt validation.",
      },
      dependencies,
    );

    expect(result.success).toBe(false);
    expect(result.validation).toBeNull();
    expect(result.reasons).toEqual([
      "Finding does not meet validation requirements.",
    ]);
  });

  it("exposes lifecycle operations through the service factory", () => {
    const { dependencies } = createDependencies();

    const service = createResearchFindingValidationService(
      dependencies,
    );

    expect(
      service.canTransitionResearchFindingValidation(
        "Pending",
        "In Review",
      ),
    ).toBe(true);

    expect(
      service.transitionResearchFindingValidation(
        "validation-001",
        "In Review",
        "Begin review",
      )?.status,
    ).toBe("In Review");
  });
});
