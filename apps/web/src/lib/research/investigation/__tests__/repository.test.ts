import { describe, expect, it, vi } from "vitest";

import type { ResearchInvestigation } from "@/types/research";

import {
  createResearchInvestigation,
  getResearchInvestigations,
  saveResearchInvestigation,
  type ResearchInvestigationRepositoryDependencies,
  type ResearchInvestigationRepositoryState,
} from "../repository";

function createState(): ResearchInvestigationRepositoryState {
  return {
    investigationsSnapshot: [],
    investigationsSnapshotRaw: null,
  };
}

function createDependencies(
  investigations: ResearchInvestigation[] = [],
): ResearchInvestigationRepositoryDependencies {
  let persistedInvestigations = [...investigations];

  const saveResearchInvestigations = vi.fn(
    (nextInvestigations: ResearchInvestigation[]) => {
      persistedInvestigations = [...nextInvestigations];
    },
  );

  return {
    loadResearchInvestigations: () => persistedInvestigations,

    saveResearchInvestigations,

    getCollectionSnapshotKey: () =>
      JSON.stringify(persistedInvestigations),

    isServer: () => false,

    createId: (prefix) => `${prefix}-001`,

    now: () => "2026-08-30T00:00:00.000Z",
  };
}

describe("research investigation repository", () => {
  it("creates a Draft investigation with initialized collections", () => {
    const investigation = createResearchInvestigation(
      {
        title: "Investigation",
        objective: "Understand the system",
        question: "Why?",
      },
      createDependencies(),
    );

    expect(investigation).toEqual({
      id: "investigation-001",
      title: "Investigation",
      objective: "Understand the system",
      question: "Why?",
      status: "Draft",
      description: undefined,
      repository: undefined,
      experimentIds: [],
      evidenceIds: [],
      findingIds: [],
      artifactIds: [],
      conclusionIds: [],
      createdAt: "2026-08-30T00:00:00.000Z",
      updatedAt: "2026-08-30T00:00:00.000Z",
    });
  });

  it("loads investigations from the persistence snapshot", () => {
    const existing = {
      ...createResearchInvestigation(
        {
          title: "Existing",
          objective: "Objective",
          question: "Question",
        },
        createDependencies(),
      ),
      conclusionIds: [],
    };

    const dependencies = createDependencies([existing]);

    expect(getResearchInvestigations(dependencies, createState())).toEqual([
      existing,
    ]);
  });

  it("normalizes missing conclusion ids", () => {
    const legacy = {
      ...createResearchInvestigation(
        {
          title: "Legacy",
          objective: "Objective",
          question: "Question",
        },
        createDependencies(),
      ),
      conclusionIds: undefined,
    } as unknown as ResearchInvestigation;

    const dependencies = createDependencies([legacy]);

    expect(getResearchInvestigations(dependencies, createState())[0])
      .toMatchObject({
        id: legacy.id,
        conclusionIds: [],
      });
  });

  it("returns an empty collection when there is no snapshot", () => {
    const dependencies = createDependencies();
    dependencies.getCollectionSnapshotKey = () => null;

    expect(getResearchInvestigations(dependencies, createState()))
      .toEqual([]);
  });

  it("returns an empty collection for invalid JSON", () => {
    const dependencies = createDependencies();
    dependencies.getCollectionSnapshotKey = () => "invalid-json";

    expect(getResearchInvestigations(dependencies, createState()))
      .toEqual([]);
  });

  it("returns the existing investigation for an update", () => {
    const existing = createResearchInvestigation(
      {
        title: "Existing",
        objective: "Objective",
        question: "Question",
      },
      createDependencies(),
    );

    const dependencies = createDependencies([existing]);
    const state = createState();

    getResearchInvestigations(dependencies, state);

    const updated = {
      ...existing,
      title: "Updated",
    };

    saveResearchInvestigation(updated, dependencies, state);

    expect(dependencies.saveResearchInvestigations).toHaveBeenCalledWith([
      updated,
    ]);
  });

  it("inserts new investigations at the beginning", () => {
    const existing = createResearchInvestigation(
      {
        title: "Existing",
        objective: "Objective",
        question: "Question",
      },
      createDependencies(),
    );

      const created = {
          ...createResearchInvestigation(
              {
                  title: "New",
                  objective: "Objective",
                  question: "Question",
              },
              createDependencies(),
          ),
          id: "investigation-002",
      };
    const dependencies = createDependencies([existing]);
    const state = createState();

    getResearchInvestigations(dependencies, state);
    saveResearchInvestigation(created, dependencies, state);

    expect(dependencies.saveResearchInvestigations).toHaveBeenCalledWith([
      created,
      existing,
    ]);
  });
});