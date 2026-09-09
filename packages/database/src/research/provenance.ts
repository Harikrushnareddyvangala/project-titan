import { asc, eq } from "drizzle-orm";

import { db } from "../client.js";
import { researchProvenanceEvents } from "../schema/index.js";
import { type TitanDatabaseTransaction, withDatabaseTransaction } from "../transaction.js";

export interface ResearchProvenanceEventRecord {
  id: string;
  investigationId: string;
  entityType: string;
  entityId: string;
  eventType: string;
  fromStatus: string | null;
  toStatus: string | null;
  reason: string | null;
  actor: string | null;
  timestamp: Date;
  metadata: Record<string, unknown> | null;
}

export interface CreateResearchProvenanceEventRecordInput {
  id: string;
  investigationId: string;
  entityType: string;
  entityId: string;
  eventType: string;
  fromStatus?: string;
  toStatus?: string;
  reason?: string;
  actor?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

function mapResearchProvenanceEventRecord(
  event: typeof researchProvenanceEvents.$inferSelect,
): ResearchProvenanceEventRecord {
  return {
    id: event.id,
    investigationId: event.investigationId,
    entityType: event.entityType,
    entityId: event.entityId,
    eventType: event.eventType,
    fromStatus: event.fromStatus,
    toStatus: event.toStatus,
    reason: event.reason,
    actor: event.actor,
    timestamp: event.timestamp,
    metadata: event.metadata as Record<string, unknown> | null,
  };
}

export async function getResearchProvenanceEventRecord(
  id: string,
): Promise<ResearchProvenanceEventRecord | null> {
  const [event] = await db
    .select()
    .from(researchProvenanceEvents)
    .where(eq(researchProvenanceEvents.id, id))
    .limit(1);

  if (!event) {
    return null;
  }

  return mapResearchProvenanceEventRecord(event);
}

export async function getResearchProvenanceEventRecords(): Promise<
  ResearchProvenanceEventRecord[]
> {
  const events = await db
    .select()
    .from(researchProvenanceEvents)
    .orderBy(asc(researchProvenanceEvents.timestamp), asc(researchProvenanceEvents.id));

  return events.map(mapResearchProvenanceEventRecord);
}

export async function createResearchProvenanceEventRecordInTransaction(
  tx: TitanDatabaseTransaction,
  input: CreateResearchProvenanceEventRecordInput,
): Promise<typeof researchProvenanceEvents.$inferSelect> {
  const [row] = await tx
    .insert(researchProvenanceEvents)
    .values({
      id: input.id,
      investigationId: input.investigationId,
      entityType: input.entityType,
      entityId: input.entityId,
      eventType: input.eventType,
      fromStatus: input.fromStatus ?? null,
      toStatus: input.toStatus ?? null,
      reason: input.reason ?? null,
      actor: input.actor ?? null,
      timestamp: input.timestamp,
      metadata: input.metadata ?? null,
    })
    .returning();

  if (!row) {
    throw new Error(`Failed to create research provenance event: ${input.id}`);
  }

  return row;
}

export async function createResearchProvenanceEventRecord(
  input: CreateResearchProvenanceEventRecordInput,
): Promise<ResearchProvenanceEventRecord> {
  const event = await withDatabaseTransaction((tx) =>
    createResearchProvenanceEventRecordInTransaction(tx, input),
  );

  return mapResearchProvenanceEventRecord(event);
}
