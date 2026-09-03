import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ResearchInvestigation } from "@/types/research";

import {
  createResearchInvestigationRecord,
  getResearchInvestigationRecord,
} from "@titan/database";

import {
  createResearchInvestigation,
  getResearchInvestigation,
} from "../serverRepository";

vi.mock("@titan/database", () => ({
  createResearchInvestigationRecord: vi.fn(),
  getResearchInvestigationRecord: vi.fn(),
}));

const mockedCreateResearchInvestigationRecord =
  vi.mocked(createResearchInvestigationRecord);

const mockedGetResearchInvestigationRecord =
  vi.mocked(getResearchInvestigationRecord);

const createdAt = "2026-09-03T02:00:00.000Z";
const updatedAt = "2026-09-03T02:05:00.000Z";

function createDatabaseRecord() {
  return {
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
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

describe("research investigation server repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and maps a database investigation to the domain model", async () => {
    const record = createDatabaseRecord();

    mockedGetResearchInvestigationRecord.mockResolvedValue(record);

    const result = await getResearchInvestigation(record.id);

    expect(mockedGetResearchInvestigationRecord).toHaveBeenCalledWith(
      record.id,
    );

    expect(result).toEqual<ResearchInvestigation>({
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
      createdAt,
      updatedAt,
    });
  });

  it("returns null when the database investigation does not exist", async () => {
    mockedGetResearchInvestigationRecord.mockResolvedValue(null);

    const result = await getResearchInvestigation("missing-investigation");

    expect(result).toBeNull();
    expect(mockedGetResearchInvestigationRecord).toHaveBeenCalledWith(
      "missing-investigation",
    );
  });

  it("maps nullable database fields to optional domain fields", async () => {
    const record = {
      ...createDatabaseRecord(),
      description: null,
      repository: null,
    };

    mockedGetResearchInvestigationRecord.mockResolvedValue(record);

    const result = await getResearchInvestigation(record.id);

    expect(result).toMatchObject({
      description: undefined,
      repository: undefined,
    });
  });

  it("converts domain timestamps to database dates when creating", async () => {
    const record = createDatabaseRecord();

    mockedCreateResearchInvestigationRecord.mockResolvedValue(record);

    const investigation: ResearchInvestigation = {
      id: record.id,
      title: record.title,
      objective: record.objective,
      question: record.question,
      status: "Draft",
      description: record.description ?? undefined,
      repository: record.repository ?? undefined,
      experimentIds: [],
      evidenceIds: [],
      findingIds: [],
      artifactIds: [],
      conclusionIds: [],
      createdAt,
      updatedAt,
    };

    const result = await createResearchInvestigation(investigation);

    expect(mockedCreateResearchInvestigationRecord).toHaveBeenCalledWith({
      id: investigation.id,
      title: investigation.title,
      objective: investigation.objective,
      question: investigation.question,
      status: investigation.status,
      description: investigation.description,
      repository: investigation.repository,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    });

    expect(result.createdAt).toBe(createdAt);
    expect(result.updatedAt).toBe(updatedAt);
  });

  it("rejects an invalid creation timestamp before database persistence", async () => {
    const investigation: ResearchInvestigation = {
      id: "investigation-invalid-timestamp",
      title: "Investigation",
      objective: "Objective",
      question: "Question",
      status: "Draft",
      experimentIds: [],
      evidenceIds: [],
      findingIds: [],
      artifactIds: [],
      conclusionIds: [],
      createdAt: "not-a-timestamp",
      updatedAt,
    };

    await expect(createResearchInvestigation(investigation)).rejects.toThrow(
      "Invalid investigation timestamp: not-a-timestamp",
    );

    expect(mockedCreateResearchInvestigationRecord).not.toHaveBeenCalled();
  });

  it("rejects an invalid update timestamp before database persistence", async () => {
    const investigation: ResearchInvestigation = {
      id: "investigation-invalid-timestamp",
      title: "Investigation",
      objective: "Objective",
      question: "Question",
      status: "Draft",
      experimentIds: [],
      evidenceIds: [],
      findingIds: [],
      artifactIds: [],
      conclusionIds: [],
      createdAt,
      updatedAt: "not-a-timestamp",
    };

    await expect(createResearchInvestigation(investigation)).rejects.toThrow(
      "Invalid investigation timestamp: not-a-timestamp",
    );

    expect(mockedCreateResearchInvestigationRecord).not.toHaveBeenCalled();
  });
});