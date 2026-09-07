import { eq } from "drizzle-orm";

import { db } from "./client.js";
import {
  executionLifecycleTransitions,
  executions,
} from "./schema/index.js";
import {
  type TitanDatabaseTransaction,
  withDatabaseTransaction,
} from "./transaction.js";

export interface ExecutionLifecycleTransitionRecord {
  id: string;
  from: string;
  to: string;
  reason: string | null;
  timestamp: Date;
}

export interface ExecutionRecord {
  id: string;
  lifecycleState: string;
  startedAt: Date | null;
  endedAt: Date | null;
  lifecycle: ExecutionLifecycleTransitionRecord[];
}

export interface CreateExecutionRecordInput {
  id: string;
  lifecycleState: string;
  startedAt?: Date;
  endedAt?: Date;
}

type ExecutionQueryDatabase = Pick<typeof db, "select">;

async function hydrateExecution(
  database: ExecutionQueryDatabase,
  execution: typeof executions.$inferSelect,
): Promise<ExecutionRecord> {
  const lifecycle = await database
    .select({
      id: executionLifecycleTransitions.id,
      from: executionLifecycleTransitions.fromState,
      to: executionLifecycleTransitions.toState,
      reason: executionLifecycleTransitions.reason,
      timestamp: executionLifecycleTransitions.timestamp,
    })
    .from(executionLifecycleTransitions)
    .where(eq(executionLifecycleTransitions.executionId, execution.id));

  return {
    id: execution.id,
    lifecycleState: execution.lifecycleState,
    startedAt: execution.startedAt,
    endedAt: execution.endedAt,
    lifecycle,
  };
}

export async function getExecutionRecord(
  id: string,
): Promise<ExecutionRecord | null> {
  const [execution] = await db
    .select()
    .from(executions)
    .where(eq(executions.id, id))
    .limit(1);

  if (!execution) {
    return null;
  }

  return hydrateExecution(db, execution);
}

async function createExecutionRecordInTransaction(
  tx: TitanDatabaseTransaction,
  input: CreateExecutionRecordInput,
): Promise<typeof executions.$inferSelect> {
  const [row] = await tx
    .insert(executions)
    .values({
      id: input.id,
      lifecycleState: input.lifecycleState,
      startedAt: input.startedAt ?? null,
      endedAt: input.endedAt ?? null,
    })
    .returning();

  if (!row) {
    throw new Error(`Failed to create execution: ${input.id}`);
  }

  return row;
}

export async function createExecutionRecord(
  input: CreateExecutionRecordInput,
): Promise<ExecutionRecord> {
  const execution = await withDatabaseTransaction((tx) =>
    createExecutionRecordInTransaction(tx, input),
  );

  return hydrateExecution(db, execution);
}

async function persistExecutionLifecycleTransitionInTransaction(
  tx: TitanDatabaseTransaction,
  input: {
    executionId: string;
    transitionId: string;
    from: string;
    to: string;
    reason?: string;
    timestamp: Date;
    endedAt?: Date;
  },
): Promise<typeof executions.$inferSelect> {
  const [row] = await tx
    .update(executions)
    .set({
      lifecycleState: input.to,
      ...(input.endedAt !== undefined
        ? { endedAt: input.endedAt }
        : {}),
    })
    .where(eq(executions.id, input.executionId))
    .returning();

  if (!row) {
    throw new Error(
      `Failed to update execution lifecycle: ${input.executionId}`,
    );
  }

  await tx.insert(executionLifecycleTransitions).values({
    id: input.transitionId,
    executionId: input.executionId,
    fromState: input.from,
    toState: input.to,
    reason: input.reason ?? null,
    timestamp: input.timestamp,
  });

  return row;
}

export async function persistExecutionLifecycleTransition(
  input: {
    executionId: string;
    transitionId: string;
    from: string;
    to: string;
    reason?: string;
    timestamp: Date;
    endedAt?: Date;
  },
): Promise<ExecutionRecord> {
  const execution = await withDatabaseTransaction((tx) =>
    persistExecutionLifecycleTransitionInTransaction(tx, input),
  );

  return hydrateExecution(db, execution);
}
