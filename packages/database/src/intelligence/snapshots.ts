import { asc, eq } from "drizzle-orm";

import { db } from "../client.js";
import { intelligenceSnapshots } from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface IntelligenceSnapshotRecord {
  id: string;
  repository: string;
  createdAt: Date;
  analytics: unknown;
}

export interface CreateIntelligenceSnapshotRecordInput {
  id: string;
  repository: string;
  createdAt: Date;
  analytics: unknown;
}

export async function getIntelligenceSnapshotRecord(
  id: string,
): Promise<IntelligenceSnapshotRecord | null> {
  const [snapshot] = await db
    .select()
    .from(intelligenceSnapshots)
    .where(eq(intelligenceSnapshots.id, id))
    .limit(1);

  if (!snapshot) {
    return null;
  }

  return {
    id: snapshot.id,
    repository: snapshot.repository,
    createdAt: snapshot.createdAt,
    analytics: snapshot.analytics,
  };
}

export async function getIntelligenceSnapshotRecords(): Promise<
  IntelligenceSnapshotRecord[]
> {
  const rows = await db
    .select()
    .from(intelligenceSnapshots)
    .orderBy(
      asc(intelligenceSnapshots.createdAt),
      asc(intelligenceSnapshots.id),
    );

  return rows.map((snapshot) => ({
    id: snapshot.id,
    repository: snapshot.repository,
    createdAt: snapshot.createdAt,
    analytics: snapshot.analytics,
  }));
}

export async function deleteIntelligenceSnapshotRecord(
  id: string,
): Promise<boolean> {
  const deleted = await withDatabaseTransaction(async (tx) => {
    const rows = await tx
      .delete(intelligenceSnapshots)
      .where(eq(intelligenceSnapshots.id, id))
      .returning({ id: intelligenceSnapshots.id });

    return rows.length > 0;
  });

  return deleted;
}

export async function createIntelligenceSnapshotRecord(
  input: CreateIntelligenceSnapshotRecordInput,
): Promise<IntelligenceSnapshotRecord> {
  const snapshot = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(intelligenceSnapshots)
      .values({
        id: input.id,
        repository: input.repository,
        createdAt: input.createdAt,
        analytics: input.analytics,
      })
      .returning();

    if (!row) {
      throw new Error(`Failed to create intelligence snapshot: ${input.id}`);
    }

    return row;
  });

  return {
    id: snapshot.id,
    repository: snapshot.repository,
    createdAt: snapshot.createdAt,
    analytics: snapshot.analytics,
  };
}
