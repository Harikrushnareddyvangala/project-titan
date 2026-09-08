import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ResearchEvidence,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchProvenanceEvent,
} from "@/types/research";

import {
  getResearchEvidenceAssessmentRecords,
  getResearchEvidenceRecords,
  getResearchExperimentRecords,
  getResearchFindingRecords,
  getResearchFindingValidationRecords,
  getResearchInvestigationConclusionRecords,
  getResearchInvestigationRecords,
  getResearchProvenanceEventRecords,
} from "@titan/database";

import {
  getResearchEvidence,
  getResearchExperiments,
  getResearchFindingValidations,
  getResearchFindings,
  getResearchInvestigationConclusions,
  getResearchInvestigations,
  getResearchProvenanceEventsByInvestigation,
} from "../serverRepository";

vi.mock("@titan/database", () => ({
  getResearchEvidenceAssessmentRecords: vi.fn(),
  getResearchEvidenceRecords: vi.fn(),
  getResearchExperimentRecords: vi.fn(),
  getResearchFindingRecords: vi.fn(),
  getResearchFindingValidationRecords: vi.fn(),
  getResearchInvestigationConclusionRecords: vi.fn(),
  getResearchInvestigationRecords: vi.fn(),
  getResearchProvenanceEventRecords: vi.fn(),
}));

const mockedGetResearchEvidenceAssessmentRecords = vi.mocked(
  getResearchEvidenceAssessmentRecords,
);
const mockedGetResearchEvidenceRecords = vi.mocked(
  getResearchEvidenceRecords,
);
const mockedGetResearchExperimentRecords = vi.mocked(
  getResearchExperimentRecords,
);
const mockedGetResearchFindingRecords = vi.mocked(
  getResearchFindingRecords,
);
const mockedGetResearchFindingValidationRecords = vi.mocked(
  getResearchFindingValidationRecords,
);
const mockedGetResearchInvestigationConclusionRecords = vi.mocked(
  getResearchInvestigationConclusionRecords,
);
const mockedGetResearchInvestigationRecords = vi.mocked(
  getResearchInvestigationRecords,
);
const mockedGetResearchProvenanceEventRecords = vi.mocked(
  getResearchProvenanceEventRecords,
);

describe("research server repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedGetResearchEvidenceAssessmentRecords.mockResolvedValue([]);
    mockedGetResearchEvidenceRecords.mockResolvedValue([]);
    mockedGetResearchExperimentRecords.mockResolvedValue([]);
    mockedGetResearchFindingRecords.mockResolvedValue([]);
    mockedGetResearchFindingValidationRecords.mockResolvedValue([]);
    mockedGetResearchInvestigationConclusionRecords.mockResolvedValue([]);
    mockedGetResearchInvestigationRecords.mockResolvedValue([]);
    mockedGetResearchProvenanceEventRecords.mockResolvedValue([]);
  });

  it("hydrates investigations from database records", async () => {
    const record = {
      id: "investigation-001",
      title: "Investigation",
      objective: "Understand the system",
      question: "Why?",
      status: "Draft",
      description: "Description",
      repository: "project-titan",
      experimentIds: ["experiment-001"],
      evidenceIds: ["evidence-001"],
      findingIds: ["finding-001"],
      artifactIds: ["artifact-001"],
      conclusionIds: ["conclusion-001"],
      createdAt: new Date("2026-09-04T10:00:00.000Z"),
      updatedAt: new Date("2026-09-04T11:00:00.000Z"),
    };

    mockedGetResearchInvestigationRecords.mockResolvedValue([record]);

    const result = await getResearchInvestigations();

    expect(result).toEqual([
      {
        id: record.id,
        title: record.title,
        objective: record.objective,
        question: record.question,
        status: "Draft",
        description: record.description,
        repository: record.repository,
        experimentIds: record.experimentIds,
        evidenceIds: record.evidenceIds,
        findingIds: record.findingIds,
        artifactIds: record.artifactIds,
        conclusionIds: record.conclusionIds,
        createdAt: "2026-09-04T10:00:00.000Z",
        updatedAt: "2026-09-04T11:00:00.000Z",
      },
    ]);
  });

  it("hydrates findings with their evidence assessments", async () => {
    const findingRecord = {
      id: "finding-001",
      statement: "The finding is supported.",
      confidence: 0.84,
      validationIds: ["validation-001"],
      createdAt: new Date("2026-09-04T10:00:00.000Z"),
      updatedAt: new Date("2026-09-04T11:00:00.000Z"),
    };

    const assessmentRecord = {
      id: "assessment-001",
      findingId: "finding-001",
      evidenceId: "evidence-001",
      type: "Supporting",
      relevance: 0.9,
      supportStrength: 0.85,
      reliability: 0.95,
      independence: 0.8,
      rationale: "Directly supports the finding.",
      assessedAt: new Date("2026-09-04T10:30:00.000Z"),
      updatedAt: new Date("2026-09-04T10:45:00.000Z"),
    };

    mockedGetResearchFindingRecords.mockResolvedValue([findingRecord]);
    mockedGetResearchEvidenceAssessmentRecords.mockResolvedValue([
      assessmentRecord,
    ]);

    const result = await getResearchFindings();

    expect(result).toEqual([
      {
        id: "finding-001",
        statement: "The finding is supported.",
        evidenceAssessments: [
          {
            id: "assessment-001",
            evidenceId: "evidence-001",
            type: "Supporting",
            relevance: 0.9,
            supportStrength: 0.85,
            reliability: 0.95,
            independence: 0.8,
            rationale: "Directly supports the finding.",
            assessedAt: "2026-09-04T10:30:00.000Z",
            updatedAt: "2026-09-04T10:45:00.000Z",
          },
        ],
        confidence: 0.84,
        validationIds: ["validation-001"],
        createdAt: "2026-09-04T10:00:00.000Z",
        updatedAt: "2026-09-04T11:00:00.000Z",
      },
    ]);
  });

  it("groups assessments independently across findings", async () => {
    mockedGetResearchFindingRecords.mockResolvedValue([
      {
        id: "finding-001",
        statement: "First finding",
        confidence: null,
        validationIds: [],
        createdAt: new Date("2026-09-04T10:00:00.000Z"),
        updatedAt: new Date("2026-09-04T11:00:00.000Z"),
      },
      {
        id: "finding-002",
        statement: "Second finding",
        confidence: null,
        validationIds: [],
        createdAt: new Date("2026-09-04T10:00:00.000Z"),
        updatedAt: new Date("2026-09-04T11:00:00.000Z"),
      },
    ]);

    mockedGetResearchEvidenceAssessmentRecords.mockResolvedValue([
      {
        id: "assessment-001",
        findingId: "finding-002",
        evidenceId: "evidence-002",
        type: "Contradicting",
        relevance: 0.4,
        supportStrength: 0.3,
        reliability: 0.7,
        independence: 0.6,
        rationale: null,
        assessedAt: new Date("2026-09-04T10:30:00.000Z"),
        updatedAt: new Date("2026-09-04T10:45:00.000Z"),
      },
    ]);

    const result = await getResearchFindings();

    expect(result[0].evidenceAssessments).toEqual([]);
    expect(result[1].evidenceAssessments).toHaveLength(1);
    expect(result[1].evidenceAssessments[0]).toMatchObject({
      id: "assessment-001",
      evidenceId: "evidence-002",
      type: "Contradicting",
      rationale: undefined,
    });
  });

  it("hydrates validations and derives assessment count from persisted assessments", async () => {
    mockedGetResearchFindingValidationRecords.mockResolvedValue([
      {
        id: "validation-001",
        findingId: "finding-001",
        status: "Validated",
        decision: "Accept",
        rationale: "Accepted.",
        validator: "validator-001",
        confidenceAtValidation: 0.82,
        supportingEvidenceCount: 1,
        contradictingEvidenceCount: 0,
        createdAt: new Date("2026-09-04T10:00:00.000Z"),
        updatedAt: new Date("2026-09-04T11:00:00.000Z"),
        validatedAt: new Date("2026-09-04T11:00:00.000Z"),
      },
    ]);

    mockedGetResearchEvidenceAssessmentRecords.mockResolvedValue([
      {
        id: "assessment-001",
        findingId: "finding-001",
        evidenceId: "evidence-001",
        type: "Supporting",
        relevance: 0.9,
        supportStrength: 0.85,
        reliability: 0.95,
        independence: 0.8,
        rationale: null,
        assessedAt: new Date("2026-09-04T10:30:00.000Z"),
        updatedAt: new Date("2026-09-04T10:45:00.000Z"),
      },
      {
        id: "assessment-002",
        findingId: "finding-001",
        evidenceId: "evidence-002",
        type: "Neutral",
        relevance: 0.5,
        supportStrength: 0.5,
        reliability: 0.7,
        independence: 0.6,
        rationale: null,
        assessedAt: new Date("2026-09-04T10:31:00.000Z"),
        updatedAt: new Date("2026-09-04T10:46:00.000Z"),
      },
    ]);

    const result = await getResearchFindingValidations();

    expect(result).toEqual([
      {
        id: "validation-001",
        findingId: "finding-001",
        status: "Validated",
        decision: "Accept",
        rationale: "Accepted.",
        validator: "validator-001",
        confidenceAtValidation: 0.82,
        evidenceAssessmentCount: 2,
        supportingEvidenceCount: 1,
        contradictingEvidenceCount: 0,
        createdAt: "2026-09-04T10:00:00.000Z",
        updatedAt: "2026-09-04T11:00:00.000Z",
        validatedAt: "2026-09-04T11:00:00.000Z",
      },
    ]);
  });

  it("hydrates evidence, experiments, and conclusions", async () => {
    mockedGetResearchEvidenceRecords.mockResolvedValue([
      {
        id: "evidence-001",
        type: "Metric",
        title: "Metric",
        description: null,
        reference: null,
        createdAt: new Date("2026-09-04T10:00:00.000Z"),
      },
    ]);

    mockedGetResearchExperimentRecords.mockResolvedValue([
      {
        id: "experiment-001",
        investigationId: "investigation-001",
        title: "Experiment",
        objective: "Test objective",
        status: "Investigating",
        description: null,
        evidenceIds: ["evidence-001"],
        findingIds: ["finding-001"],
        lifecycle: [],
        createdAt: new Date("2026-09-04T10:00:00.000Z"),
        updatedAt: new Date("2026-09-04T11:00:00.000Z"),
      },
    ]);

    mockedGetResearchInvestigationConclusionRecords.mockResolvedValue([
      {
        id: "conclusion-001",
        investigationId: "investigation-001",
        statement: "Conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-001"],
        contradictingFindingIds: [],
        uncertainty: null,
        nextAction: null,
        createdAt: new Date("2026-09-04T10:00:00.000Z"),
        updatedAt: new Date("2026-09-04T11:00:00.000Z"),
      },
    ]);

    await expect(getResearchEvidence()).resolves.toEqual([
      {
        id: "evidence-001",
        type: "Metric",
        title: "Metric",
        description: undefined,
        reference: undefined,
        createdAt: "2026-09-04T10:00:00.000Z",
      },
    ]);

    expect(await getResearchExperiments()).toEqual([
      {
        id: "experiment-001",
        investigationId: "investigation-001",
        title: "Experiment",
        objective: "Test objective",
        status: "Investigating",
        description: undefined,
        evidenceIds: ["evidence-001"],
        findingIds: ["finding-001"],
        lifecycle: [],
        createdAt: "2026-09-04T10:00:00.000Z",
        updatedAt: "2026-09-04T11:00:00.000Z",
      },
    ]);

    expect(await getResearchInvestigationConclusions()).toEqual([
      {
        id: "conclusion-001",
        investigationId: "investigation-001",
        statement: "Conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-001"],
        contradictingFindingIds: [],
        uncertainty: undefined,
        nextAction: undefined,
        createdAt: "2026-09-04T10:00:00.000Z",
        updatedAt: "2026-09-04T11:00:00.000Z",
      },
    ]);
  });

  it("filters provenance events by investigation", async () => {
    mockedGetResearchProvenanceEventRecords.mockResolvedValue([
      {
        id: "provenance-001",
        investigationId: "investigation-001",
        entityType: "Finding",
        entityId: "finding-001",
        eventType: "Validated",
        fromStatus: "Investigating",
        toStatus: "Validated",
        reason: "Validation completed.",
        actor: "validator-001",
        timestamp: new Date("2026-09-04T11:00:00.000Z"),
        metadata: { source: "test" },
      },
      {
        id: "provenance-002",
        investigationId: "investigation-002",
        entityType: "Finding",
        entityId: "finding-002",
        eventType: "Created",
        fromStatus: null,
        toStatus: "Draft",
        reason: null,
        actor: null,
        timestamp: new Date("2026-09-04T12:00:00.000Z"),
        metadata: null,
      },
    ]);

    const result =
      await getResearchProvenanceEventsByInvestigation(
        "investigation-001",
      );

    expect(result).toEqual([
      {
        id: "provenance-001",
        investigationId: "investigation-001",
        entityType: "Finding",
        entityId: "finding-001",
        eventType: "Validated",
        fromStatus: "Investigating",
        toStatus: "Validated",
        reason: "Validation completed.",
        actor: "validator-001",
        timestamp: "2026-09-04T11:00:00.000Z",
        metadata: { source: "test" },
      },
    ]);
  });
});
