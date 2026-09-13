import {
  ensureActiveResearchReconciliationObligationRecord,
  createResearchReconciliationObligationRecord,
  getResearchReconciliationObligationRecord,
  getResearchReconciliationObligationRecords,
  getResearchReconciliationObligationRecordsByInvestigation,
  getResearchReconciliationObligationRecordsByTarget,
  getUnresolvedResearchReconciliationObligationRecords,
  getUnresolvedResearchReconciliationObligationRecordsByInvestigation,
  updateResearchReconciliationObligationStatus as updateResearchReconciliationObligationStatusRecord,
} from "@titan/database";

import type { ResearchReconciliationObligation } from "@/types/research";

import {
  createResearchReconciliationObligationRepository,
  type ResearchReconciliationObligationCreateInput,
  type ResearchReconciliationObligationStatusUpdateInput,
} from "./repository";

function toDate(value: string, field: string): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid reconciliation obligation ${field}: ${value}`);
  }

  return date;
}

function mapResearchReconciliationObligationRecord(
  record: Awaited<
    ReturnType<typeof getResearchReconciliationObligationRecord>
  >,
): ResearchReconciliationObligation | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    investigationId: record.investigationId,
    issueCode: record.issueCode,
    targetEntityType: record.targetEntityType,
    targetEntityId: record.targetEntityId,
    remediationAction: record.remediationAction,
    remediationExecutionId: record.remediationExecutionId ?? undefined,
    provenanceEventId: record.provenanceEventId ?? undefined,
    status: record.status as ResearchReconciliationObligation["status"],
    reason: record.reason,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    resolvedAt: record.resolvedAt?.toISOString(),
  };
}

function mapResearchReconciliationObligationRecords(
  records: Awaited<
    ReturnType<typeof getResearchReconciliationObligationRecords>
  >,
): ResearchReconciliationObligation[] {
  return records.map((record) => ({
    id: record.id,
    investigationId: record.investigationId,
    issueCode: record.issueCode,
    targetEntityType: record.targetEntityType,
    targetEntityId: record.targetEntityId,
    remediationAction: record.remediationAction,
    remediationExecutionId: record.remediationExecutionId ?? undefined,
    provenanceEventId: record.provenanceEventId ?? undefined,
    status: record.status as ResearchReconciliationObligation["status"],
    reason: record.reason,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    resolvedAt: record.resolvedAt?.toISOString(),
  }));
}

const repository = createResearchReconciliationObligationRepository({
  async getResearchReconciliationObligation(id) {
    return mapResearchReconciliationObligationRecord(
      await getResearchReconciliationObligationRecord(id),
    );
  },

  async getResearchReconciliationObligations() {
    return mapResearchReconciliationObligationRecords(
      await getResearchReconciliationObligationRecords(),
    );
  },

  async getResearchReconciliationObligationsByInvestigation(investigationId) {
    return mapResearchReconciliationObligationRecords(
      await getResearchReconciliationObligationRecordsByInvestigation(
        investigationId,
      ),
    );
  },

  async getUnresolvedResearchReconciliationObligations() {
    return mapResearchReconciliationObligationRecords(
      await getUnresolvedResearchReconciliationObligationRecords(),
    );
  },

  async getUnresolvedResearchReconciliationObligationsByInvestigation(
    investigationId,
  ) {
    return mapResearchReconciliationObligationRecords(
      await getUnresolvedResearchReconciliationObligationRecordsByInvestigation(
        investigationId,
      ),
    );
  },

  async getResearchReconciliationObligationsByTarget(
    targetEntityType,
    targetEntityId,
  ) {
    return mapResearchReconciliationObligationRecords(
      await getResearchReconciliationObligationRecordsByTarget(
        targetEntityType,
        targetEntityId,
      ),
    );
  },

  async ensureActiveResearchReconciliationObligation(
    input: ResearchReconciliationObligationCreateInput,
  ) {
    const record = await ensureActiveResearchReconciliationObligationRecord({
      id: input.id,
      investigationId: input.investigationId,
      issueCode: input.issueCode,
      targetEntityType: input.targetEntityType,
      targetEntityId: input.targetEntityId,
      remediationAction: input.remediationAction,
      remediationExecutionId: input.remediationExecutionId,
      provenanceEventId: input.provenanceEventId,
      status: input.status,
      reason: input.reason,
      createdAt: toDate(input.createdAt, "createdAt"),
      updatedAt: toDate(input.updatedAt, "updatedAt"),
      resolvedAt: input.resolvedAt
        ? toDate(input.resolvedAt, "resolvedAt")
        : undefined,
    });

    return mapResearchReconciliationObligationRecord(record)!;
  },

  async createResearchReconciliationObligation(
    input: ResearchReconciliationObligationCreateInput,
  ) {
    const record = await createResearchReconciliationObligationRecord({
      id: input.id,
      investigationId: input.investigationId,
      issueCode: input.issueCode,
      targetEntityType: input.targetEntityType,
      targetEntityId: input.targetEntityId,
      remediationAction: input.remediationAction,
      remediationExecutionId: input.remediationExecutionId,
      provenanceEventId: input.provenanceEventId,
      status: input.status,
      reason: input.reason,
      createdAt: toDate(input.createdAt, "createdAt"),
      updatedAt: toDate(input.updatedAt, "updatedAt"),
      resolvedAt: input.resolvedAt
        ? toDate(input.resolvedAt, "resolvedAt")
        : undefined,
    });

    return mapResearchReconciliationObligationRecord(record)!;
  },

  async updateResearchReconciliationObligationStatus(
    id: string,
    input: ResearchReconciliationObligationStatusUpdateInput,
  ) {
    const record = await updateResearchReconciliationObligationStatusRecord(
      id,
      {
        expectedUpdatedAt: toDate(
          input.expectedUpdatedAt,
          "expectedUpdatedAt",
        ),
        toStatus: input.toStatus,
        updatedAt: toDate(input.updatedAt, "updatedAt"),
      },
    );

    return mapResearchReconciliationObligationRecord(record)!;
  },
});

export const {
  getResearchReconciliationObligation,
  getResearchReconciliationObligations,
  getResearchReconciliationObligationsByInvestigation,
  getUnresolvedResearchReconciliationObligations,
  getUnresolvedResearchReconciliationObligationsByInvestigation,
  getResearchReconciliationObligationsByTarget,
  createResearchReconciliationObligation,
  ensureActiveResearchReconciliationObligation,
  updateResearchReconciliationObligationStatus,
} = repository;
