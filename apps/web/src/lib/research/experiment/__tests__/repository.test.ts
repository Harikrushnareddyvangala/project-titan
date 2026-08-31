import { describe, expect, it, vi } from "vitest";

import type { ResearchExperiment } from "@/types/research";

import {
  createResearchExperimentRepository,
  getResearchExperiments,
  saveResearchExperiment,
  type ResearchExperimentRepositoryDependencies,
} from "../repository";

const timestamp = "2026-08-31T00:00:00.000Z";

function createExperiment(
  overrides: Partial<ResearchExperiment> = {},
): ResearchExperiment {
  return {
    id: "experiment-001",
    investigationId: "investigation-001",
    title: "Experiment",
    objective: "Understand the behavior",
    status: "Draft",
    evidenceIds: [],
    findingIds: [],
    lifecycle: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

function createDependencies(
  experiments: ResearchExperiment[] = [],
): ResearchExperimentRepositoryDependencies & {
  savedExperiments: ResearchExperiment[];
} {
  let persistedExperiments = [...experiments];

  const saveResearchExperiments = vi.fn(
    (nextExperiments: ResearchExperiment[]) => {
      persistedExperiments = [...nextExperiments];
    },
  );

  return {
    loadResearchExperiments: () =>
      persistedExperiments,

    saveResearchExperiments,

    get savedExperiments() {
      return persistedExperiments;
    },
  };
}

describe("research experiment repository", () => {
  it("loads persisted experiments", () => {
    const experiment = createExperiment();
    const dependencies = createDependencies([experiment]);

    expect(getResearchExperiments(dependencies)).toEqual([
      experiment,
    ]);
  });

  it("normalizes a missing lifecycle collection", () => {
    const legacy = {
      ...createExperiment(),
      lifecycle: undefined,
    } as unknown as ResearchExperiment;

    const dependencies = createDependencies([legacy]);

    expect(getResearchExperiments(dependencies)[0]).toEqual({
      ...legacy,
      lifecycle: [],
    });
  });

  it("updates an existing experiment", () => {
    const existing = createExperiment();
    const dependencies = createDependencies([existing]);

    const updated = {
      ...existing,
      title: "Updated experiment",
    };

    saveResearchExperiment(updated, dependencies);

    expect(dependencies.savedExperiments).toEqual([
      updated,
    ]);

    expect(
      dependencies.saveResearchExperiments,
    ).toHaveBeenCalledWith([updated]);
  });

  it("inserts new experiments at the beginning", () => {
    const existing = createExperiment();
    const created = createExperiment({
      id: "experiment-002",
      title: "New experiment",
    });

    const dependencies = createDependencies([existing]);

    saveResearchExperiment(created, dependencies);

    expect(dependencies.savedExperiments).toEqual([
      created,
      existing,
    ]);

    expect(
      dependencies.saveResearchExperiments,
    ).toHaveBeenCalledWith([
      created,
      existing,
    ]);
  });

  it("does not mutate the loaded collection while saving", () => {
    const existing = createExperiment();
    const source = [existing];

    const saveResearchExperiments = vi.fn();

    const dependencies: ResearchExperimentRepositoryDependencies = {
      loadResearchExperiments: () => source,
      saveResearchExperiments,
    };

    const created = createExperiment({
      id: "experiment-002",
    });

    saveResearchExperiment(
      created,
      dependencies,
    );

    expect(source).toEqual([existing]);

    expect(saveResearchExperiments).toHaveBeenCalledWith([
      created,
      existing,
    ]);
  });

  it("exposes repository operations through the factory", () => {
    const experiment = createExperiment();
    const dependencies = createDependencies([experiment]);

    const repository =
      createResearchExperimentRepository(
        dependencies,
      );

    expect(repository.getResearchExperiments()).toEqual([
      experiment,
    ]);

    const updated = {
      ...experiment,
      objective: "Updated objective",
    };

    repository.saveResearchExperiment(updated);

    expect(dependencies.savedExperiments).toEqual([
      updated,
    ]);
  });
});
