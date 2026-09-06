import { eq } from "drizzle-orm";

import { db } from "./client.js";
import { executionResourceInteractions } from "./schema/index.js";
import { withDatabaseTransaction } from "./transaction.js";

export interface ExecutionResourceInteractionRecord {
  id: string;
  executionId: string;
  targetKind: "resource" | "revision";
  targetResourceId: string;
  targetResourceType: string;
  targetResourceNamespace: string;
  targetRevisionVersion: string | null;
  targetRevisionCreatedAt: Date | null;
  operationNamespace: string;
  operationType: string;
  createdAt: Date;
}

export interface CreateExecutionResourceInteractionRecordInput {
  id: string;
  executionId: string;
  targetKind: "resource" | "revision";
  targetResourceId: string;
  targetResourceType: string;
  targetResourceNamespace: string;
  targetRevisionVersion?: string;
  targetRevisionCreatedAt?: Date;
  operationNamespace: string;
  operationType: string;
  createdAt: Date;
}

function mapExecutionResourceInteraction(
  interaction: typeof executionResourceInteractions.$inferSelect,
): ExecutionResourceInteractionRecord {
  return {
    id: interaction.id,
    executionId: interaction.executionId,
    targetKind: interaction.targetKind as "resource" | "revision",
    targetResourceId: interaction.targetResourceId,
    targetResourceType: interaction.targetResourceType,
    targetResourceNamespace: interaction.targetResourceNamespace,
    targetRevisionVersion: interaction.targetRevisionVersion,
    targetRevisionCreatedAt: interaction.targetRevisionCreatedAt,
    operationNamespace: interaction.operationNamespace,
    operationType: interaction.operationType,
    createdAt: interaction.createdAt,
  };
}

export async function getExecutionResourceInteractionRecord(
  id: string,
): Promise<ExecutionResourceInteractionRecord | null> {
  const [interaction] = await db
    .select()
    .from(executionResourceInteractions)
    .where(eq(executionResourceInteractions.id, id))
    .limit(1);

  if (!interaction) {
    return null;
  }

  return mapExecutionResourceInteraction(interaction);
}

export async function createExecutionResourceInteractionRecord(
  input: CreateExecutionResourceInteractionRecordInput,
): Promise<ExecutionResourceInteractionRecord> {
  const interaction = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(executionResourceInteractions)
      .values({
        id: input.id,
        executionId: input.executionId,
        targetKind: input.targetKind,
        targetResourceId: input.targetResourceId,
        targetResourceType: input.targetResourceType,
        targetResourceNamespace: input.targetResourceNamespace,
        targetRevisionVersion: input.targetRevisionVersion ?? null,
        targetRevisionCreatedAt: input.targetRevisionCreatedAt ?? null,
        operationNamespace: input.operationNamespace,
        operationType: input.operationType,
        createdAt: input.createdAt,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create execution resource interaction: ${input.id}`,
      );
    }

    return row;
  });

  return mapExecutionResourceInteraction(interaction);
}
