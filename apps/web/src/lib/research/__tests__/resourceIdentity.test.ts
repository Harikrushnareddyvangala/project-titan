import { describe, expect, it } from "vitest";

import type {
  ResearchEvidence,
  ResearchExperiment,
  ResearchFinding,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
} from "@/types/research";

import {
  toResearchConclusionResourceIdentity,
  toResearchEvidenceResourceIdentity,
  toResearchExperimentResourceIdentity,
  toResearchFindingResourceIdentity,
  toResearchInvestigationResourceIdentity,
} from "@/lib/research/resourceIdentity";

describe("research resource identity mapping contracts", () => {
  it("maps an investigation without changing its identity", () => {
    const investigation = {
      id: "investigation-resource-001",
    } as ResearchInvestigation;

    expect(toResearchInvestigationResourceIdentity(investigation)).toEqual({
      id: "investigation-resource-001",
      type: "investigation",
      namespace: "research",
    });
  });

  it("maps an experiment without changing its identity", () => {
    const experiment = {
      id: "experiment-resource-001",
    } as ResearchExperiment;

    expect(toResearchExperimentResourceIdentity(experiment)).toEqual({
      id: "experiment-resource-001",
      type: "experiment",
      namespace: "research",
    });
  });

  it("maps evidence without changing its identity", () => {
    const evidence = {
      id: "evidence-resource-001",
    } as ResearchEvidence;

    expect(toResearchEvidenceResourceIdentity(evidence)).toEqual({
      id: "evidence-resource-001",
      type: "evidence",
      namespace: "research",
    });
  });

  it("maps a finding without changing its identity", () => {
    const finding = {
      id: "finding-resource-001",
    } as ResearchFinding;

    expect(toResearchFindingResourceIdentity(finding)).toEqual({
      id: "finding-resource-001",
      type: "finding",
      namespace: "research",
    });
  });

  it("maps a conclusion without changing its identity", () => {
    const conclusion = {
      id: "conclusion-resource-001",
    } as ResearchInvestigationConclusion;

    expect(toResearchConclusionResourceIdentity(conclusion)).toEqual({
      id: "conclusion-resource-001",
      type: "conclusion",
      namespace: "research",
    });
  });
});
