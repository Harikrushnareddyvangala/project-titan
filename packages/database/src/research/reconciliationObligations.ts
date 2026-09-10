import { asc, eq } from "drizzle-orm";

import { db } from "../client.js";
import { researchReconciliationObligations } from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface ResearchReconciliationObligationRecord {
  id: string;
  investigationId: string;
  issueCode: string;
  targetEntityType: string;
  targetEntityId: string;
  remediationAction: string;
  remediationExecutionId: string | null;
  provenanceEventId: string | null;
  status: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
}

export interface CreateResearchReconciliationObligationRecordInput {
  id: string;
  investigationId: string;
  issueCode: string;
  targetEntityType: string;
  targetEntityId: string;
  remediationAction: string;
  remediationExecutionId?: string;
  provenanceEventId?: string;
  status: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

function mapResearchReconciliationObligationRecord(
  obligation: typeof researchReconciliationObligations.$inferSelect,
): ResearchReconciliationObligationRecord {
  return {
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
    createdAt: obligation.createdAt,
    updatedAt: obligation.updatedAt,
    resolvedAt: obligation.resolvedAt,
  };
}

export async function getResearchReconciliationObligationRecord(
  id: string,
): Promise<ResearchReconciliationObligationRecord | null> {
  const [obligation] = await db
    .select()
    .from(researchReconciliationObligations)
    .where(eq(researchReconciliationObligations.id, id))
    .limit(1);

  if (!obligation) {
    return null;
  }

  return mapResearchReconciliationObligationRecord(obligation);
}

export async function getResearchReconciliationObligationRecords(): Promise<
  ResearchReconciliationObligationRecord[]
> {
  const obligations = await db
    .select()
    .from(researchReconciliationObligations)
    .orderBy(
      asc(researchReconciliationObligations.createdAt),
      asc(researchReconciliationObligations.id),
    );

  return obligations.map(mapResearchReconciliationObligationRecord);
}

export async function createResearchReconciliationObligationRecord(
  input: CreateResearchReconciliationObligationRecordInput,
): Promise<ResearchReconciliationObligationRecord> {
  const obligation = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchReconciliationObligations)
      .values({
        id: input.id,
        investigationId: input.investigationId,
        issueCode: input.issueCode,
        targetEntityType: input.targetEntityType,
        targetEntityId: input.targetEntityId,
        remediationAction: input.remediationAction,
        remediationExecutionId: input.remediationExecutionId ?? null,
        provenanceEventId: input.provenanceEventId ?? null,
        status: input.status,
        reason: input.reason,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
        resolvedAt: input.resolvedAt ?? null,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create research reconciliation obligation: ${input.id}`,
      );
    }

    return row;
  });

  return mapResearchReconciliationObligationRecord(obligation);
}
