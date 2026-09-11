import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "../client.js";
import { researchReconciliationObligations } from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";
import {
  canTransitionResearchReconciliationObligation,
  type ResearchReconciliationObligationStatus,
} from "./reconciliationObligationLifecycle.js";

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

export class ResearchReconciliationObligationStaleError extends Error {
  readonly code = "RESEARCH_RECONCILIATION_OBLIGATION_STALE";

  constructor(id: string) {
    super(
      `Research reconciliation obligation update rejected because the obligation changed after the mutation was planned: ${id}`,
    );
    this.name = "ResearchReconciliationObligationStaleError";
  }
}

export interface UpdateResearchReconciliationObligationStatusInput {
  expectedUpdatedAt: Date;
  toStatus: ResearchReconciliationObligationStatus;
  updatedAt: Date;
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

function isResearchReconciliationObligationStatus(
  status: string,
): status is ResearchReconciliationObligationStatus {
  return (
    status === "Open" ||
    status === "In Progress" ||
    status === "Resolved" ||
    status === "Abandoned" ||
    status === "Superseded"
  );
}

export async function updateResearchReconciliationObligationStatus(
  id: string,
  input: UpdateResearchReconciliationObligationStatusInput,
): Promise<ResearchReconciliationObligationRecord> {
  const obligation = await withDatabaseTransaction(async (tx) => {
    const [current] = await tx
      .select()
      .from(researchReconciliationObligations)
      .where(eq(researchReconciliationObligations.id, id))
      .limit(1);

    if (!current) {
      throw new Error(`Research reconciliation obligation not found: ${id}`);
    }

    if (!isResearchReconciliationObligationStatus(current.status)) {
      throw new Error(
        `Research reconciliation obligation has invalid status: ${current.status}`,
      );
    }

    if (
      !canTransitionResearchReconciliationObligation(
        current.status,
        input.toStatus,
      )
    ) {
      throw new Error(
        `Research reconciliation obligation cannot transition from ${current.status} to ${input.toStatus}: ${id}`,
      );
    }

    const [row] = await tx
      .update(researchReconciliationObligations)
      .set({
        status: input.toStatus,
        updatedAt: input.updatedAt,
        resolvedAt: input.toStatus === "Resolved" ? input.updatedAt : null,
      })
      .where(
        and(
          eq(researchReconciliationObligations.id, id),
          eq(
            researchReconciliationObligations.updatedAt,
            input.expectedUpdatedAt,
          ),
          eq(researchReconciliationObligations.status, current.status),
        ),
      )
      .returning();

    if (!row) {
      throw new ResearchReconciliationObligationStaleError(id);
    }

    return row;
  });

  return mapResearchReconciliationObligationRecord(obligation);
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

export async function getResearchReconciliationObligationRecordsByInvestigation(
  investigationId: string,
): Promise<ResearchReconciliationObligationRecord[]> {
  const obligations = await db
    .select()
    .from(researchReconciliationObligations)
    .where(eq(researchReconciliationObligations.investigationId, investigationId))
    .orderBy(
      asc(researchReconciliationObligations.createdAt),
      asc(researchReconciliationObligations.id),
    );

  return obligations.map(mapResearchReconciliationObligationRecord);
}

export async function getUnresolvedResearchReconciliationObligationRecordsByInvestigation(
  investigationId: string,
): Promise<ResearchReconciliationObligationRecord[]> {
  const obligations = await db
    .select()
    .from(researchReconciliationObligations)
    .where(
      and(
        eq(researchReconciliationObligations.investigationId, investigationId),
        inArray(researchReconciliationObligations.status, [
          "Open",
          "In Progress",
        ]),
      ),
    )
    .orderBy(
      asc(researchReconciliationObligations.createdAt),
      asc(researchReconciliationObligations.id),
    );

  return obligations.map(mapResearchReconciliationObligationRecord);
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

export async function getUnresolvedResearchReconciliationObligationRecords(): Promise<
  ResearchReconciliationObligationRecord[]
> {
  const obligations = await db
    .select()
    .from(researchReconciliationObligations)
    .where(
      inArray(researchReconciliationObligations.status, [
        "Open",
        "In Progress",
      ]),
    )
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
