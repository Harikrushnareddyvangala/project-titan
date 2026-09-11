import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ResearchReconciliationObligation } from "@/types/research";

import {
  createResearchReconciliationObligationRecord,
  getResearchReconciliationObligationRecord,
  getResearchReconciliationObligationRecords,
  getResearchReconciliationObligationRecordsByInvestigation,
  getResearchReconciliationObligationRecordsByTarget,
  getUnresolvedResearchReconciliationObligationRecords,
  getUnresolvedResearchReconciliationObligationRecordsByInvestigation,
  updateResearchReconciliationObligationStatus,
} from "@titan/database";

import {
  createResearchReconciliationObligation,
  getResearchReconciliationObligation,
  getResearchReconciliationObligations,
  getResearchReconciliationObligationsByInvestigation,
  getResearchReconciliationObligationsByTarget,
  getUnresolvedResearchReconciliationObligations,
  getUnresolvedResearchReconciliationObligationsByInvestigation,
  updateResearchReconciliationObligationStatus as updateResearchReconciliationObligationStatusRepository,
} from "../serverRepository";

vi.mock("@titan/database", () => ({
  createResearchReconciliationObligationRecord: vi.fn(),
  getResearchReconciliationObligationRecord: vi.fn(),
  getResearchReconciliationObligationRecords: vi.fn(),
  getResearchReconciliationObligationRecordsByInvestigation: vi.fn(),
  getResearchReconciliationObligationRecordsByTarget: vi.fn(),
  getUnresolvedResearchReconciliationObligationRecords: vi.fn(),
  getUnresolvedResearchReconciliationObligationRecordsByInvestigation: vi.fn(),
  updateResearchReconciliationObligationStatus: vi.fn(),
}));

const mockedCreateResearchReconciliationObligationRecord = vi.mocked(
  createResearchReconciliationObligationRecord,
);

const mockedGetResearchReconciliationObligationRecord = vi.mocked(
  getResearchReconciliationObligationRecord,
);

const mockedGetResearchReconciliationObligationRecords = vi.mocked(
  getResearchReconciliationObligationRecords,
);

const mockedGetResearchReconciliationObligationRecordsByInvestigation =
  vi.mocked(getResearchReconciliationObligationRecordsByInvestigation);

const mockedGetResearchReconciliationObligationRecordsByTarget = vi.mocked(
  getResearchReconciliationObligationRecordsByTarget,
);

const mockedGetUnresolvedResearchReconciliationObligationRecords = vi.mocked(
  getUnresolvedResearchReconciliationObligationRecords,
);

const mockedGetUnresolvedResearchReconciliationObligationRecordsByInvestigation =
  vi.mocked(getUnresolvedResearchReconciliationObligationRecordsByInvestigation);

const mockedUpdateResearchReconciliationObligationStatus = vi.mocked(
  updateResearchReconciliationObligationStatus,
);

const createdAt = "2026-09-03T02:00:00.000Z";
const updatedAt = "2026-09-03T02:05:00.000Z";
const resolvedAt = "2026-09-03T02:10:00.000Z";

function createDatabaseRecord() {
  return {
    id: "reconciliation-001",
    investigationId: "investigation-001",
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    targetEntityType: "Conclusion",
    targetEntityId: "conclusion-001",
    remediationAction: "Repair conclusion finding reference",
    remediationExecutionId: "execution-001",
    provenanceEventId: "provenance-001",
    status: "Open",
    reason: "Postcondition validation remains invalid.",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    resolvedAt: new Date(resolvedAt),
  };
}

function createDomainObligation(): ResearchReconciliationObligation {
  return {
    id: "reconciliation-001",
    investigationId: "investigation-001",
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    targetEntityType: "Conclusion",
    targetEntityId: "conclusion-001",
    remediationAction: "Repair conclusion finding reference",
    remediationExecutionId: "execution-001",
    provenanceEventId: "provenance-001",
    status: "Open",
    reason: "Postcondition validation remains invalid.",
    createdAt,
    updatedAt,
    resolvedAt,
  };
}

describe("research reconciliation obligation server repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and maps a database reconciliation obligation to the domain model", async () => {
    const record = createDatabaseRecord();

    mockedGetResearchReconciliationObligationRecord.mockResolvedValue(record);

    const result = await getResearchReconciliationObligation(record.id);

    expect(mockedGetResearchReconciliationObligationRecord).toHaveBeenCalledWith(
      record.id,
    );

    expect(result).toEqual<ResearchReconciliationObligation>(
      createDomainObligation(),
    );
  });

  it("returns null when the database reconciliation obligation does not exist", async () => {
    mockedGetResearchReconciliationObligationRecord.mockResolvedValue(null);

    const result = await getResearchReconciliationObligation(
      "missing-reconciliation",
    );

    expect(result).toBeNull();

    expect(mockedGetResearchReconciliationObligationRecord).toHaveBeenCalledWith(
      "missing-reconciliation",
    );
  });

  it("maps nullable database fields to optional domain fields", async () => {
    const record = {
      ...createDatabaseRecord(),
      remediationExecutionId: null,
      provenanceEventId: null,
      resolvedAt: null,
    };

    mockedGetResearchReconciliationObligationRecord.mockResolvedValue(record);

    const result = await getResearchReconciliationObligation(record.id);

    expect(result).toMatchObject({
      remediationExecutionId: undefined,
      provenanceEventId: undefined,
      resolvedAt: undefined,
    });
  });

  it("loads all reconciliation obligations", async () => {
    const records = [createDatabaseRecord()];

    mockedGetResearchReconciliationObligationRecords.mockResolvedValue(records);

    const result = await getResearchReconciliationObligations();

    expect(
      mockedGetResearchReconciliationObligationRecords,
    ).toHaveBeenCalledWith();

    expect(result).toEqual([createDomainObligation()]);
  });

  it("loads reconciliation obligations by investigation", async () => {
    const records = [createDatabaseRecord()];

    mockedGetResearchReconciliationObligationRecordsByInvestigation.mockResolvedValue(
      records,
    );

    const result = await getResearchReconciliationObligationsByInvestigation(
      "investigation-001",
    );

    expect(
      mockedGetResearchReconciliationObligationRecordsByInvestigation,
    ).toHaveBeenCalledWith("investigation-001");

    expect(result).toEqual([createDomainObligation()]);
  });

  it("loads unresolved reconciliation obligations globally", async () => {
    const records = [createDatabaseRecord()];

    mockedGetUnresolvedResearchReconciliationObligationRecords.mockResolvedValue(
      records,
    );

    const result = await getUnresolvedResearchReconciliationObligations();

    expect(
      mockedGetUnresolvedResearchReconciliationObligationRecords,
    ).toHaveBeenCalledWith();

    expect(result).toEqual([createDomainObligation()]);
  });

  it("loads unresolved reconciliation obligations by investigation", async () => {
    const records = [createDatabaseRecord()];

    mockedGetUnresolvedResearchReconciliationObligationRecordsByInvestigation.mockResolvedValue(
      records,
    );

    const result =
      await getUnresolvedResearchReconciliationObligationsByInvestigation(
        "investigation-001",
      );

    expect(
      mockedGetUnresolvedResearchReconciliationObligationRecordsByInvestigation,
    ).toHaveBeenCalledWith("investigation-001");

    expect(result).toEqual([createDomainObligation()]);
  });

  it("loads reconciliation obligations by target", async () => {
    const records = [createDatabaseRecord()];

    mockedGetResearchReconciliationObligationRecordsByTarget.mockResolvedValue(
      records,
    );

    const result = await getResearchReconciliationObligationsByTarget(
      "Conclusion",
      "conclusion-001",
    );

    expect(
      mockedGetResearchReconciliationObligationRecordsByTarget,
    ).toHaveBeenCalledWith("Conclusion", "conclusion-001");

    expect(result).toEqual([createDomainObligation()]);
  });

  it("converts domain timestamps to database dates when creating", async () => {
    const record = createDatabaseRecord();
    const obligation = createDomainObligation();

    mockedCreateResearchReconciliationObligationRecord.mockResolvedValue(
      record,
    );

    const result = await createResearchReconciliationObligation(obligation);

    expect(
      mockedCreateResearchReconciliationObligationRecord,
    ).toHaveBeenCalledWith({
      id: obligation.id,
      investigationId: obligation.investigationId,
      issueCode: obligation.issueCode,
      targetEntityType: obligation.targetEntityType,
      targetEntityId: obligation.targetEntityId,
      remediationAction: obligation.remediationAction,
      remediationExecutionId: obligation.remediationExecutionId,
      provenanceEventId: obligation.provenanceEventId,
      status: obligation.status,
      reason: obligation.reason,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      resolvedAt: new Date(resolvedAt),
    });

    expect(result).toEqual(obligation);
  });

  it("rejects an invalid creation timestamp before database persistence", async () => {
    const obligation = {
      ...createDomainObligation(),
      createdAt: "not-a-timestamp",
    };

    await expect(
      createResearchReconciliationObligation(obligation),
    ).rejects.toThrow(
      "Invalid reconciliation obligation createdAt: not-a-timestamp",
    );

    expect(
      mockedCreateResearchReconciliationObligationRecord,
    ).not.toHaveBeenCalled();
  });

  it("rejects an invalid resolvedAt timestamp before database persistence", async () => {
    const obligation = {
      ...createDomainObligation(),
      resolvedAt: "not-a-timestamp",
    };

    await expect(
      createResearchReconciliationObligation(obligation),
    ).rejects.toThrow(
      "Invalid reconciliation obligation resolvedAt: not-a-timestamp",
    );

    expect(
      mockedCreateResearchReconciliationObligationRecord,
    ).not.toHaveBeenCalled();
  });

  it("converts status update timestamps to database dates", async () => {
    const record = {
      ...createDatabaseRecord(),
      status: "Resolved",
      updatedAt: new Date(resolvedAt),
      resolvedAt: new Date(resolvedAt),
    };

    mockedUpdateResearchReconciliationObligationStatus.mockResolvedValue(
      record,
    );

    const result =
      await updateResearchReconciliationObligationStatusRepository(
        "reconciliation-001",
        {
          expectedUpdatedAt: updatedAt,
          toStatus: "Resolved",
          updatedAt: resolvedAt,
        },
      );

    expect(
      mockedUpdateResearchReconciliationObligationStatus,
    ).toHaveBeenCalledWith("reconciliation-001", {
      expectedUpdatedAt: new Date(updatedAt),
      toStatus: "Resolved",
      updatedAt: new Date(resolvedAt),
    });

    expect(result).toMatchObject({
      id: "reconciliation-001",
      status: "Resolved",
      updatedAt: resolvedAt,
      resolvedAt,
    });
  });

  it("rejects an invalid expected update timestamp before database persistence", async () => {
    await expect(
      updateResearchReconciliationObligationStatusRepository(
        "reconciliation-001",
        {
          expectedUpdatedAt: "not-a-timestamp",
          toStatus: "Resolved",
          updatedAt: resolvedAt,
        },
      ),
    ).rejects.toThrow(
      "Invalid reconciliation obligation expectedUpdatedAt: not-a-timestamp",
    );

    expect(
      mockedUpdateResearchReconciliationObligationStatus,
    ).not.toHaveBeenCalled();
  });

  it("rejects an invalid update timestamp before database persistence", async () => {
    await expect(
      updateResearchReconciliationObligationStatusRepository(
        "reconciliation-001",
        {
          expectedUpdatedAt: updatedAt,
          toStatus: "Resolved",
          updatedAt: "not-a-timestamp",
        },
      ),
    ).rejects.toThrow(
      "Invalid reconciliation obligation updatedAt: not-a-timestamp",
    );

    expect(
      mockedUpdateResearchReconciliationObligationStatus,
    ).not.toHaveBeenCalled();
  });
});
