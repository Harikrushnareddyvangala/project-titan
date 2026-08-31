import { describe, expect, it, vi } from "vitest";

import type {
  ResearchInvestigation,
  ResearchInvestigationConclusion,
} from "@/types/research";

import {
  attachResearchInvestigationConclusion,
  createResearchConclusionRepository,
  createResearchInvestigationConclusion,
  detachResearchInvestigationConclusion,
  getResearchInvestigationConclusions,
  saveResearchInvestigationConclusion,
  type ResearchConclusionRepositoryDependencies,
} from "../repository";

const investigationId = "investigation-001";
const conclusionId = "conclusion-001";

function createInvestigation(
  conclusionIds: string[] = [],
): ResearchInvestigation {
  return {
    id: investigationId,
    title: "Investigation",
    objective: "Understand the system",
    question: "Why?",
    status: "Draft",
    experimentIds: [],
    evidenceIds: [],
    findingIds: [],
    artifactIds: [],
    conclusionIds,
    createdAt: "2026-08-31T00:00:00.000Z",
    updatedAt: "2026-08-31T00:00:00.000Z",
  };
}

function createConclusion(
  overrides: Partial<ResearchInvestigationConclusion> = {},
): ResearchInvestigationConclusion {
  return {
    id: conclusionId,
    investigationId,
    statement: "The evidence supports the conclusion.",
    status: "Draft",
    supportingFindingIds: [],
    contradictingFindingIds: [],
    createdAt: "2026-08-31T00:00:00.000Z",
    updatedAt: "2026-08-31T00:00:00.000Z",
    ...overrides,
  };
}

function createDependencies(
  conclusions: ResearchInvestigationConclusion[] = [],
  investigations: ResearchInvestigation[] = [createInvestigation()],
): ResearchConclusionRepositoryDependencies & {
  savedConclusions: ResearchInvestigationConclusion[];
  savedInvestigations: ResearchInvestigation[];
} {
  let persistedConclusions = [...conclusions];
  let persistedInvestigations = [...investigations];

  const saveConclusions = vi.fn(
    (next: ResearchInvestigationConclusion[]) => {
      persistedConclusions = [...next];
    },
  );

  const saveInvestigation = vi.fn(
    (investigation: ResearchInvestigation) => {
      persistedInvestigations = persistedInvestigations.map(
        (item) =>
          item.id === investigation.id ? investigation : item,
      );
    },
  );

  return {
    loadResearchInvestigationConclusions: () =>
      persistedConclusions,

    saveResearchInvestigationConclusions: saveConclusions,

    getResearchInvestigations: () =>
      persistedInvestigations,

    saveResearchInvestigation: saveInvestigation,

    createId: (prefix) => `${prefix}-001`,

    now: () => "2026-08-31T01:00:00.000Z",

    get savedConclusions() {
      return persistedConclusions;
    },

    get savedInvestigations() {
      return persistedInvestigations;
    },
  };
}

describe("research conclusion repository", () => {
  it("loads conclusions and normalizes missing finding collections", () => {
    const legacy = {
      ...createConclusion(),
      supportingFindingIds: undefined,
      contradictingFindingIds: undefined,
    } as unknown as ResearchInvestigationConclusion;

    const dependencies = createDependencies([legacy]);

    expect(getResearchInvestigationConclusions(dependencies)).toEqual([
      expect.objectContaining({
        id: conclusionId,
        supportingFindingIds: [],
        contradictingFindingIds: [],
      }),
    ]);
  });

  it("updates an existing conclusion", () => {
    const existing = createConclusion();
    const dependencies = createDependencies([existing]);

    const updated = {
      ...existing,
      statement: "Updated conclusion.",
    };

    saveResearchInvestigationConclusion(updated, dependencies);

    expect(dependencies.savedConclusions).toEqual([updated]);
  });

  it("inserts new conclusions at the beginning", () => {
    const existing = createConclusion();
    const dependencies = createDependencies([existing]);

    const created = createConclusion({
      id: "conclusion-002",
      statement: "New conclusion.",
    });

    saveResearchInvestigationConclusion(created, dependencies);

    expect(dependencies.savedConclusions).toEqual([
      created,
      existing,
    ]);
  });

  it("creates a Draft conclusion with generated identity and timestamps", () => {
    const dependencies = createDependencies();

    const conclusion = createResearchInvestigationConclusion(
      {
        investigationId,
        statement: "A new conclusion.",
        status: "Draft",
        supportingFindingIds: [],
        contradictingFindingIds: [],
      },
      dependencies,
    );

    expect(conclusion).toEqual({
      id: "investigation-conclusion-001",
      investigationId,
      statement: "A new conclusion.",
      status: "Draft",
      supportingFindingIds: [],
      contradictingFindingIds: [],
      createdAt: "2026-08-31T01:00:00.000Z",
      updatedAt: "2026-08-31T01:00:00.000Z",
    });

    expect(dependencies.savedConclusions).toEqual([conclusion]);
  });

  it("attaches a conclusion to its investigation", () => {
    const conclusion = createConclusion();
    const investigation = createInvestigation();

    const dependencies = createDependencies(
      [conclusion],
      [investigation],
    );

    const updated = attachResearchInvestigationConclusion(
      investigationId,
      conclusionId,
      dependencies,
    );

    expect(updated?.conclusionIds).toEqual([conclusionId]);
    expect(dependencies.savedInvestigations[0].conclusionIds).toEqual([
      conclusionId,
    ]);
  });

  it("does not duplicate an already attached conclusion", () => {
    const conclusion = createConclusion();
    const investigation = createInvestigation([conclusionId]);

    const dependencies = createDependencies(
      [conclusion],
      [investigation],
    );

    const updated = attachResearchInvestigationConclusion(
      investigationId,
      conclusionId,
      dependencies,
    );

    expect(updated).toBe(investigation);
    expect(dependencies.savedInvestigations[0].conclusionIds).toEqual([
      conclusionId,
    ]);
  });

  it("rejects attaching a missing conclusion", () => {
    const dependencies = createDependencies();

    expect(
      attachResearchInvestigationConclusion(
        investigationId,
        conclusionId,
        dependencies,
      ),
    ).toBeNull();
  });

  it("rejects attaching a conclusion from another investigation", () => {
    const conclusion = createConclusion({
      investigationId: "other-investigation",
    });

    const dependencies = createDependencies([conclusion]);

    expect(
      attachResearchInvestigationConclusion(
        investigationId,
        conclusionId,
        dependencies,
      ),
    ).toBeNull();
  });

  it("detaches a conclusion from an investigation", () => {
    const conclusion = createConclusion();
    const investigation = createInvestigation([conclusionId]);

    const dependencies = createDependencies(
      [conclusion],
      [investigation],
    );

    const updated = detachResearchInvestigationConclusion(
      investigationId,
      conclusionId,
      dependencies,
    );

    expect(updated?.conclusionIds).toEqual([]);
    expect(dependencies.savedInvestigations[0].conclusionIds).toEqual([]);
  });

  it("leaves an investigation unchanged when the conclusion is not attached", () => {
    const investigation = createInvestigation();
    const dependencies = createDependencies([], [investigation]);

    const updated = detachResearchInvestigationConclusion(
      investigationId,
      conclusionId,
      dependencies,
    );

    expect(updated).toBe(investigation);
  });

  it("exposes the repository facade", () => {
    const dependencies = createDependencies();
    const repository = createResearchConclusionRepository(
      dependencies,
    );

    expect(
      repository.getResearchInvestigationConclusions(),
    ).toEqual([]);
  });
});
