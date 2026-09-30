import "server-only";

import {
  createIntelligenceSnapshotRecord,
  deleteIntelligenceSnapshotRecord,
  getIntelligenceSnapshotRecord,
  getIntelligenceSnapshotRecords,
} from "@titan/database";

import type { IntelligenceSnapshot } from "@/types/intelligence";

function toDate(value: string): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid intelligence snapshot timestamp: ${value}`);
  }

  return date;
}

function mapAnalytics(value: unknown): IntelligenceSnapshot["analytics"] {
  return value as IntelligenceSnapshot["analytics"];
}

function mapSnapshotRecord(
  record: Awaited<ReturnType<typeof getIntelligenceSnapshotRecord>>,
): IntelligenceSnapshot | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    repository: record.repository,
    createdAt: record.createdAt.toISOString(),
    analytics: mapAnalytics(record.analytics),
  };
}

export async function getIntelligenceSnapshot(
  id: string,
): Promise<IntelligenceSnapshot | null> {
  const record = await getIntelligenceSnapshotRecord(id);

  return mapSnapshotRecord(record);
}

export async function getIntelligenceSnapshots(): Promise<IntelligenceSnapshot[]> {
  const records = await getIntelligenceSnapshotRecords();

  return records.map((record) => ({
    id: record.id,
    repository: record.repository,
    createdAt: record.createdAt.toISOString(),
    analytics: mapAnalytics(record.analytics),
  }));
}

export async function deleteIntelligenceSnapshot(
  id: string,
): Promise<boolean> {
  return deleteIntelligenceSnapshotRecord(id);
}

export async function createIntelligenceSnapshot(
  snapshot: IntelligenceSnapshot,
): Promise<IntelligenceSnapshot> {
  const record = await createIntelligenceSnapshotRecord({
    id: snapshot.id,
    repository: snapshot.repository,
    createdAt: toDate(snapshot.createdAt),
    analytics: snapshot.analytics,
  });

  return {
    id: record.id,
    repository: record.repository,
    createdAt: record.createdAt.toISOString(),
    analytics: mapAnalytics(record.analytics),
  };
}
