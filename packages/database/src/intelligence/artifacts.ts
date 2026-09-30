import { asc, eq } from "drizzle-orm";

import { db } from "../client.js";
import { intelligenceArtifacts } from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface IntelligenceArtifactRecord {
  artifactId: string;
  artifactType: string;
  repository: string;
  sourceSnapshotId: string;
  author: string;
  createdAt: Date;
  generatedAt: Date;
  version: string;
  format: string;
  source: string;
  status: string;
  previousArtifactId: string | null;
  metadata: unknown;
  integrity: unknown;
  signature: unknown;
}

export interface CreateIntelligenceArtifactRecordInput {
  artifactId: string;
  artifactType: string;
  repository: string;
  sourceSnapshotId: string;
  author: string;
  createdAt: Date;
  generatedAt: Date;
  version: string;
  format: string;
  source: string;
  status: string;
  previousArtifactId?: string;
  metadata: unknown;
  integrity?: unknown;
  signature?: unknown;
}

function mapArtifactRecord(
  artifact: typeof intelligenceArtifacts.$inferSelect,
): IntelligenceArtifactRecord {
  return {
    artifactId: artifact.artifactId,
    artifactType: artifact.artifactType,
    repository: artifact.repository,
    sourceSnapshotId: artifact.sourceSnapshotId,
    author: artifact.author,
    createdAt: artifact.createdAt,
    generatedAt: artifact.generatedAt,
    version: artifact.version,
    format: artifact.format,
    source: artifact.source,
    status: artifact.status,
    previousArtifactId: artifact.previousArtifactId,
    metadata: artifact.metadata,
    integrity: artifact.integrity,
    signature: artifact.signature,
  };
}

export async function getIntelligenceArtifactRecord(
  artifactId: string,
): Promise<IntelligenceArtifactRecord | null> {
  const [artifact] = await db
    .select()
    .from(intelligenceArtifacts)
    .where(eq(intelligenceArtifacts.artifactId, artifactId))
    .limit(1);

  if (!artifact) {
    return null;
  }

  return mapArtifactRecord(artifact);
}

export async function getIntelligenceArtifactRecords(): Promise<
  IntelligenceArtifactRecord[]
> {
  const rows = await db
    .select()
    .from(intelligenceArtifacts)
    .orderBy(
      asc(intelligenceArtifacts.createdAt),
      asc(intelligenceArtifacts.artifactId),
    );

  return rows.map(mapArtifactRecord);
}


type IntelligenceArtifactLifecycleStatus =
  | "Draft"
  | "Registered"
  | "Published"
  | "Superseded"
  | "Archived";

const ARTIFACT_LIFECYCLE_TRANSITIONS: Record<
  IntelligenceArtifactLifecycleStatus,
  readonly IntelligenceArtifactLifecycleStatus[]
> = {
  Draft: ["Registered", "Archived"],
  Registered: ["Published", "Archived"],
  Published: ["Superseded", "Archived"],
  Superseded: ["Archived"],
  Archived: [],
};

function canTransitionIntelligenceArtifactStatus(
  from: IntelligenceArtifactLifecycleStatus,
  to: IntelligenceArtifactLifecycleStatus,
): boolean {
  if (from === to) {
    return true;
  }

  return ARTIFACT_LIFECYCLE_TRANSITIONS[from].includes(to);
}

async function transitionIntelligenceArtifactRecord(
  artifactId: string,
  status: IntelligenceArtifactLifecycleStatus,
): Promise<IntelligenceArtifactRecord | null> {
  const artifact = await withDatabaseTransaction(async (tx) => {
    const [current] = await tx
      .select()
      .from(intelligenceArtifacts)
      .where(eq(intelligenceArtifacts.artifactId, artifactId))
      .limit(1);

    if (!current) {
      return null;
    }

    const currentStatus =
      current.status as IntelligenceArtifactLifecycleStatus;

    if (!canTransitionIntelligenceArtifactStatus(currentStatus, status)) {
      return null;
    }

    if (currentStatus === status) {
      return current;
    }

    const [updated] = await tx
      .update(intelligenceArtifacts)
      .set({
        status,
      })
      .where(eq(intelligenceArtifacts.artifactId, artifactId))
      .returning();

    if (!updated) {
      throw new Error(
        `Failed to transition intelligence artifact: ${artifactId}`,
      );
    }

    return updated;
  });

  return artifact ? mapArtifactRecord(artifact) : null;
}

export async function publishIntelligenceArtifactRecord(
  artifactId: string,
): Promise<IntelligenceArtifactRecord | null> {
  return transitionIntelligenceArtifactRecord(artifactId, "Published");
}

export async function archiveIntelligenceArtifactRecord(
  artifactId: string,
): Promise<IntelligenceArtifactRecord | null> {
  return transitionIntelligenceArtifactRecord(artifactId, "Archived");
}

export async function supersedeIntelligenceArtifactRecord(
  artifactId: string,
): Promise<IntelligenceArtifactRecord | null> {
  return transitionIntelligenceArtifactRecord(artifactId, "Superseded");
}

export async function createIntelligenceArtifactRecord(
  input: CreateIntelligenceArtifactRecordInput,
): Promise<IntelligenceArtifactRecord> {
  const artifact = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(intelligenceArtifacts)
      .values({
        artifactId: input.artifactId,
        artifactType: input.artifactType,
        repository: input.repository,
        sourceSnapshotId: input.sourceSnapshotId,
        author: input.author,
        createdAt: input.createdAt,
        generatedAt: input.generatedAt,
        version: input.version,
        format: input.format,
        source: input.source,
        status: input.status,
        previousArtifactId: input.previousArtifactId ?? null,
        metadata: input.metadata,
        integrity: input.integrity ?? null,
        signature: input.signature ?? null,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create intelligence artifact: ${input.artifactId}`,
      );
    }

    return row;
  });

  return mapArtifactRecord(artifact);
}
