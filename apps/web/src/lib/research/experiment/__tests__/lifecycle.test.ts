import { describe, expect, it, vi } from "vitest";

import type {
  ResearchExperiment,
  ResearchStatus,
} from "@/types/research";

import {
  canTransitionResearchExperiment,
  createResearchExperimentLifecycleService,
  transitionResearchExperiment,
} from "../lifecycle";

describe("research experiment lifecycle", () => {
  const now = "2026-01-10T00:00:00.000Z";

  const baseExperiment: ResearchExperiment = {
    id: "experiment-001",
    investigationId: "investigation-001",
    title: "Test experiment",
    objective: "Test objective",
    status: "Draft",
    evidenceIds: [],
    findingIds: [],
    lifecycle: [],
    createdAt: now,
    updatedAt: now,
  };

  function createDependencies() {
    return {
      saveResearchExperiment: vi.fn(),
      createResearchProvenanceEvent: vi.fn(),
      createId: vi.fn((prefix: string) => `${prefix}-001`),
      now: vi.fn(() => now),
    };
  }

  it("allows the canonical Draft to Investigating transition", () => {
    expect(
      canTransitionResearchExperiment(
        "Draft",
        "Investigating",
      ),
    ).toBe(true);
  });

  it("allows the canonical lifecycle sequence", () => {
    const transitions: Array<
      [ResearchStatus, ResearchStatus]
    > = [
      ["Draft", "Investigating"],
      ["Investigating", "Evidence Collected"],
      ["Evidence Collected", "Finding Produced"],
      ["Finding Produced", "Validated"],
      ["Validated", "Published"],
    ];

    for (const [from, to] of transitions) {
      expect(
        canTransitionResearchExperiment(from, to),
      ).toBe(true);
    }
  });

  it("rejects invalid transitions", () => {
    expect(
      canTransitionResearchExperiment("Draft", "Published"),
    ).toBe(false);

    expect(
      canTransitionResearchExperiment(
        "Published",
        "Draft",
      ),
    ).toBe(false);
  });

  it("rejects transitions out of Published", () => {
    expect(
      canTransitionResearchExperiment(
        "Published",
        "Draft",
      ),
    ).toBe(false);
  });

  it("returns the existing experiment for a same-status transition", () => {
    const dependencies = createDependencies();

    const result = transitionResearchExperiment(
      baseExperiment,
      "Draft",
      undefined,
      dependencies,
    );

    expect(result).toBe(baseExperiment);
    expect(
      dependencies.saveResearchExperiment,
    ).not.toHaveBeenCalled();
    expect(
      dependencies.createResearchProvenanceEvent,
    ).not.toHaveBeenCalled();
  });

  it("returns null for an invalid transition", () => {
    const dependencies = createDependencies();

    const result = transitionResearchExperiment(
      baseExperiment,
      "Published",
      "Invalid jump",
      dependencies,
    );

    expect(result).toBeNull();
    expect(
      dependencies.saveResearchExperiment,
    ).not.toHaveBeenCalled();
    expect(
      dependencies.createResearchProvenanceEvent,
    ).not.toHaveBeenCalled();
  });

  it("updates status and lifecycle metadata", () => {
    const dependencies = createDependencies();

    const result = transitionResearchExperiment(
      baseExperiment,
      "Investigating",
      " Begin investigation ",
      dependencies,
    );

    expect(result).toEqual({
      ...baseExperiment,
      status: "Investigating",
      lifecycle: [
        {
          id: "experiment-lifecycle-001",
          from: "Draft",
          to: "Investigating",
          reason: "Begin investigation",
          timestamp: now,
        },
      ],
      updatedAt: now,
    });
  });

  it("normalizes an empty reason to undefined", () => {
    const dependencies = createDependencies();

    const result = transitionResearchExperiment(
      baseExperiment,
      "Investigating",
      "   ",
      dependencies,
    );

    expect(result?.lifecycle[0]?.reason).toBeUndefined();
  });

  it("persists the updated experiment", () => {
    const dependencies = createDependencies();

    const result = transitionResearchExperiment(
      baseExperiment,
      "Investigating",
      "Start",
      dependencies,
    );

    expect(
      dependencies.saveResearchExperiment,
    ).toHaveBeenCalledWith(result);
  });

  it("records provenance for the transition", () => {
    const dependencies = createDependencies();

    transitionResearchExperiment(
      baseExperiment,
      "Investigating",
      "Start",
      dependencies,
    );

    expect(
      dependencies.createResearchProvenanceEvent,
    ).toHaveBeenCalledWith({
      investigationId: "investigation-001",
      entityType: "Experiment",
      entityId: "experiment-001",
      eventType: "StatusChanged",
      fromStatus: "Draft",
      toStatus: "Investigating",
      reason: "Start",
    });
  });

  it("exposes lifecycle operations through the service factory", () => {
    const dependencies = createDependencies();

    const service =
      createResearchExperimentLifecycleService(
        dependencies,
      );

    expect(
      service.canTransitionResearchExperiment(
        "Draft",
        "Investigating",
      ),
    ).toBe(true);

    const result =
      service.transitionResearchExperiment(
        baseExperiment,
        "Investigating",
        "Factory test",
      );

    expect(result).toMatchObject({
      status: "Investigating",
    });

    expect(
      dependencies.saveResearchExperiment,
    ).toHaveBeenCalledWith(result);
  });
});
