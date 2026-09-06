import { eq } from "drizzle-orm";

import { db } from "./client.js";
import { executionActorParticipations } from "./schema/index.js";
import { withDatabaseTransaction } from "./transaction.js";

export interface ExecutionActorParticipationRecord {
  id: string;
  executionId: string;
  actorId: string;
  roleNamespace: string;
  roleType: string;
  createdAt: Date;
}

export interface CreateExecutionActorParticipationRecordInput {
  id: string;
  executionId: string;
  actorId: string;
  roleNamespace: string;
  roleType: string;
  createdAt: Date;
}

export async function getExecutionActorParticipationRecord(
  id: string,
): Promise<ExecutionActorParticipationRecord | null> {
  const [participation] = await db
    .select()
    .from(executionActorParticipations)
    .where(eq(executionActorParticipations.id, id))
    .limit(1);

  if (!participation) {
    return null;
  }

  return {
    id: participation.id,
    executionId: participation.executionId,
    actorId: participation.actorId,
    roleNamespace: participation.roleNamespace,
    roleType: participation.roleType,
    createdAt: participation.createdAt,
  };
}

export async function createExecutionActorParticipationRecord(
  input: CreateExecutionActorParticipationRecordInput,
): Promise<ExecutionActorParticipationRecord> {
  const participation = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(executionActorParticipations)
      .values({
        id: input.id,
        executionId: input.executionId,
        actorId: input.actorId,
        roleNamespace: input.roleNamespace,
        roleType: input.roleType,
        createdAt: input.createdAt,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create execution actor participation: ${input.id}`,
      );
    }

    return row;
  });

  return {
    id: participation.id,
    executionId: participation.executionId,
    actorId: participation.actorId,
    roleNamespace: participation.roleNamespace,
    roleType: participation.roleType,
    createdAt: participation.createdAt,
  };
}
