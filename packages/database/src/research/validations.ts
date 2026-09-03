import { eq } from "drizzle-orm";

import { db } from "../client.js";
import {
  researchFindingValidationHistory,
  researchFindingValidations,
} from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface ResearchFindingValidationRecord {
  id: string;
  findingId: string;
  status: string;
  decision: string | null;
  rationale: string | null;
  validator: string | null;
  confidenceAtValidation: number | null;
  supportingEvidenceCount: number;
  contradictingEvidenceCount: number;
  createdAt: Date;
  updatedAt: Date;
  validatedAt: Date | null;
}

export interface CreateResearchFindingValidationRecordInput {
  id: string;
  findingId: string;
  status: string;
  decision?: string;
  rationale?: string;
  validator?: string;
  confidenceAtValidation?: number;
  supportingEvidenceCount: number;
  contradictingEvidenceCount: number;
  createdAt: Date;
  updatedAt: Date;
  validatedAt?: Date;
}

export interface ResearchFindingValidationHistoryRecord {
  id: string;
  validationId: string;
  fromStatus: string | null;
  toStatus: string;
  decision: string | null;
  reason: string | null;
  timestamp: Date;
}

export interface CreateResearchFindingValidationHistoryRecordInput {
  id: string;
  validationId: string;
  fromStatus?: string;
  toStatus: string;
  decision?: string;
  reason?: string;
  timestamp: Date;
}

export async function getResearchFindingValidationRecord(
  id: string,
): Promise<ResearchFindingValidationRecord | null> {
  const [validation] = await db
    .select()
    .from(researchFindingValidations)
    .where(eq(researchFindingValidations.id, id))
    .limit(1);

  if (!validation) {
    return null;
  }

  return {
    id: validation.id,
    findingId: validation.findingId,
    status: validation.status,
    decision: validation.decision,
    rationale: validation.rationale,
    validator: validation.validator,
    confidenceAtValidation: validation.confidenceAtValidation,
    supportingEvidenceCount: validation.supportingEvidenceCount,
    contradictingEvidenceCount: validation.contradictingEvidenceCount,
    createdAt: validation.createdAt,
    updatedAt: validation.updatedAt,
    validatedAt: validation.validatedAt,
  };
}

export async function createResearchFindingValidationRecord(
  input: CreateResearchFindingValidationRecordInput,
): Promise<ResearchFindingValidationRecord> {
  const validation = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchFindingValidations)
      .values({
        id: input.id,
        findingId: input.findingId,
        status: input.status,
        decision: input.decision ?? null,
        rationale: input.rationale ?? null,
        validator: input.validator ?? null,
        confidenceAtValidation: input.confidenceAtValidation ?? null,
        supportingEvidenceCount: input.supportingEvidenceCount,
        contradictingEvidenceCount: input.contradictingEvidenceCount,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
        validatedAt: input.validatedAt ?? null,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create research finding validation: ${input.id}`,
      );
    }

    return row;
  });

  return {
    id: validation.id,
    findingId: validation.findingId,
    status: validation.status,
    decision: validation.decision,
    rationale: validation.rationale,
    validator: validation.validator,
    confidenceAtValidation: validation.confidenceAtValidation,
    supportingEvidenceCount: validation.supportingEvidenceCount,
    contradictingEvidenceCount: validation.contradictingEvidenceCount,
    createdAt: validation.createdAt,
    updatedAt: validation.updatedAt,
    validatedAt: validation.validatedAt,
  };
}

export async function getResearchFindingValidationHistoryRecord(
  id: string,
): Promise<ResearchFindingValidationHistoryRecord | null> {
  const [event] = await db
    .select()
    .from(researchFindingValidationHistory)
    .where(eq(researchFindingValidationHistory.id, id))
    .limit(1);

  if (!event) {
    return null;
  }

  return {
    id: event.id,
    validationId: event.validationId,
    fromStatus: event.fromStatus,
    toStatus: event.toStatus,
    decision: event.decision,
    reason: event.reason,
    timestamp: event.timestamp,
  };
}

export async function createResearchFindingValidationHistoryRecord(
  input: CreateResearchFindingValidationHistoryRecordInput,
): Promise<ResearchFindingValidationHistoryRecord> {
  const history = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchFindingValidationHistory)
      .values({
        id: input.id,
        validationId: input.validationId,
        fromStatus: input.fromStatus ?? null,
        toStatus: input.toStatus,
        decision: input.decision ?? null,
        reason: input.reason ?? null,
        timestamp: input.timestamp,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create research finding validation history: ${input.id}`,
      );
    }

    return row;
  });

  return {
    id: history.id,
    validationId: history.validationId,
    fromStatus: history.fromStatus,
    toStatus: history.toStatus,
    decision: history.decision,
    reason: history.reason,
    timestamp: history.timestamp,
  };
}
