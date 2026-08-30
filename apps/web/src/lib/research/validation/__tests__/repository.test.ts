import { describe, expect, it } from "vitest";

import type {
  ResearchFindingValidation,
  ResearchFindingValidationHistoryEvent,
} from "@/types/research";

import {
  getResearchFindingValidationHistory,
  getResearchFindingValidations,
  saveResearchFindingValidation,
  saveResearchFindingValidationHistoryEvent,
} from "../repository";

function createValidation(
  id: string,
): ResearchFindingValidation {
  return {
    id,
    findingId: "finding-001",
    status: "Pending",
    decision: "Accept",
    rationale: "Test validation",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    validatedAt: undefined,
    confidenceAtValidation: undefined,
    evidenceAssessmentCount: 1,
    supportingEvidenceCount: 1,
    contradictingEvidenceCount: 0,
  };
}

function createHistoryEvent(
  id: string,
): ResearchFindingValidationHistoryEvent {
  return {
    id,
    validationId: "validation-001",
    from: "Pending",
    to: "In Review",
    decision: "Accept",
    reason: "Begin review",
    timestamp: "2026-01-01T00:00:00.000Z",
  };
}

function createDependencies(
  validations: ResearchFindingValidation[] = [],
  history: ResearchFindingValidationHistoryEvent[] = [],
) {
  return {
    loadResearchFindingValidations: () => validations,
    saveResearchFindingValidations: (next: ResearchFindingValidation[]) => {
      validations.splice(0, validations.length, ...next);
    },
    loadResearchFindingValidationHistory: () => history,
    saveResearchFindingValidationHistory: (
      next: ResearchFindingValidationHistoryEvent[],
    ) => {
      history.splice(0, history.length, ...next);
    },
  };
}

describe("research finding validation repository", () => {
  it("loads validations", () => {
    const validation = createValidation("validation-001");
    const dependencies = createDependencies([validation]);

    expect(getResearchFindingValidations(dependencies)).toEqual([
      validation,
    ]);
  });

  it("updates an existing validation", () => {
    const existing = createValidation("validation-001");
    const updated = {
      ...existing,
      rationale: "Updated rationale",
    };

    const dependencies = createDependencies([existing]);

    saveResearchFindingValidation(updated, dependencies);

    expect(dependencies.loadResearchFindingValidations()).toEqual([updated]);
  });

  it("inserts a new validation at the beginning", () => {
    const existing = createValidation("validation-001");
    const created = createValidation("validation-002");

    const dependencies = createDependencies([existing]);

    saveResearchFindingValidation(created, dependencies);

    expect(dependencies.loadResearchFindingValidations()).toEqual([
      created,
      existing,
    ]);
  });

  it("loads validation history", () => {
    const event = createHistoryEvent("history-001");
    const dependencies = createDependencies([], [event]);

    expect(getResearchFindingValidationHistory(dependencies)).toEqual([
      event,
    ]);
  });

  it("inserts a new history event at the beginning", () => {
    const existing = createHistoryEvent("history-001");
    const created = createHistoryEvent("history-002");

    const dependencies = createDependencies([], [existing]);

    saveResearchFindingValidationHistoryEvent(created, dependencies);

    expect(
      dependencies.loadResearchFindingValidationHistory(),
    ).toEqual([created, existing]);
  });

  it("ignores duplicate history events", () => {
    const existing = createHistoryEvent("history-001");
    const duplicate = {
      ...existing,
      reason: "Different reason",
    };

    const dependencies = createDependencies([], [existing]);

    saveResearchFindingValidationHistoryEvent(duplicate, dependencies);

    expect(
      dependencies.loadResearchFindingValidationHistory(),
    ).toEqual([existing]);
  });

  it("does not persist duplicate history events", () => {
    const existing = createHistoryEvent("history-001");
    const duplicate = {
      ...existing,
      reason: "Different reason",
    };

    let saveCount = 0;

    const dependencies = {
      ...createDependencies([], [existing]),
      saveResearchFindingValidationHistory: () => {
        saveCount += 1;
      },
    };

    saveResearchFindingValidationHistoryEvent(duplicate, dependencies);

    expect(saveCount).toBe(0);
  });
});
