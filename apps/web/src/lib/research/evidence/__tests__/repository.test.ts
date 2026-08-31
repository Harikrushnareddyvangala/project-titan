import { describe, expect, it } from "vitest";

import type { ResearchEvidence } from "@/types/research";

import {
  createResearchEvidenceRepository,
  getResearchEvidence,
  saveResearchEvidence,
} from "../repository";

function createEvidence(
  overrides: Partial<ResearchEvidence> = {},
): ResearchEvidence {
  return {
    id: "evidence-1",
    type: "Analysis",
    title: "Research source",
    description: "A research evidence item.",
    reference: "https://example.com/source",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function createDependencies(
  evidence: ResearchEvidence[] = [],
) {
  return {
    storedEvidence: [...evidence],
    savedEvidence: undefined as ResearchEvidence[] | undefined,

    loadResearchEvidence() {
      return this.storedEvidence;
    },

    saveResearchEvidence(nextEvidence: ResearchEvidence[]) {
      this.savedEvidence = nextEvidence;
    },
  };
}

describe("research evidence repository", () => {
  it("loads persisted evidence", () => {
    const evidence = [
      createEvidence(),
      createEvidence({
        id: "evidence-2",
        title: "Second source",
      }),
    ];

    const dependencies = createDependencies(evidence);

    expect(getResearchEvidence(dependencies)).toEqual(evidence);
  });

  it("updates an existing evidence item", () => {
    const evidence = createEvidence();
    const dependencies = createDependencies([evidence]);

    const updated = {
      ...evidence,
      title: "Updated source",
    };

    saveResearchEvidence(updated, dependencies);

    expect(dependencies.savedEvidence).toEqual([
      updated,
    ]);
  });

  it("inserts new evidence at the beginning", () => {
    const existing = createEvidence();

    const dependencies = createDependencies([existing]);

    const created = createEvidence({
      id: "evidence-2",
      title: "New source",
    });

    saveResearchEvidence(created, dependencies);

    expect(dependencies.savedEvidence).toEqual([
      created,
      existing,
    ]);
  });

  it("does not mutate the loaded collection while saving", () => {
    const existing = createEvidence();
    const loadedEvidence = [existing];

    const dependencies = createDependencies(loadedEvidence);

    const created = createEvidence({
      id: "evidence-2",
    });

    saveResearchEvidence(created, dependencies);

    expect(loadedEvidence).toEqual([
      existing,
    ]);

    expect(dependencies.savedEvidence).toEqual([
      created,
      existing,
    ]);
  });

  it("exposes repository operations through the factory", () => {
    const evidence = createEvidence();
    const dependencies = createDependencies([evidence]);

    const repository = createResearchEvidenceRepository(
      dependencies,
    );

    expect(repository.getResearchEvidence()).toEqual([
      evidence,
    ]);

    const updated = {
      ...evidence,
      title: "Updated through repository",
    };

    repository.saveResearchEvidence(updated);

    expect(dependencies.savedEvidence).toEqual([
      updated,
    ]);
  });
});
