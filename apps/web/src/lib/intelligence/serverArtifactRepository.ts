import "server-only";

import {
  archiveIntelligenceArtifactRecord,
  createIntelligenceArtifactRecord,
  getIntelligenceArtifactRecord,
  getIntelligenceArtifactRecords,
  publishIntelligenceArtifactRecord,
  supersedeIntelligenceArtifactRecord,
} from "@titan/database";

import type { IntelligenceArtifact } from "../../types/intelligence.js";

function toIntelligenceArtifact(
  record: Awaited<ReturnType<typeof getIntelligenceArtifactRecord>>,
): IntelligenceArtifact | null {
  if (!record) {
    return null;
  }

  return {
    artifactId: record.artifactId,
    artifactType: record.artifactType as IntelligenceArtifact["artifactType"],
    repository: record.repository,
    sourceSnapshotId: record.sourceSnapshotId,
    author: record.author,
    createdAt: record.createdAt.toISOString(),
    generatedAt: record.generatedAt.toISOString(),
    version: record.version as IntelligenceArtifact["version"],
    format: record.format as IntelligenceArtifact["format"],
    source: record.source as IntelligenceArtifact["source"],
    status: record.status as IntelligenceArtifact["status"],
    ...(record.previousArtifactId
      ? { previousArtifactId: record.previousArtifactId }
      : {}),
    metadata: record.metadata as IntelligenceArtifact["metadata"],
    ...(record.integrity
      ? { integrity: record.integrity as IntelligenceArtifact["integrity"] }
      : {}),
    ...(record.signature
      ? { signature: record.signature as IntelligenceArtifact["signature"] }
      : {}),
  };
}

export async function getServerIntelligenceArtifact(
  artifactId: string,
): Promise<IntelligenceArtifact | null> {
  const record = await getIntelligenceArtifactRecord(artifactId);
  return toIntelligenceArtifact(record);
}

export async function getServerIntelligenceArtifacts(): Promise<
  IntelligenceArtifact[]
> {
  const records = await getIntelligenceArtifactRecords();

  return records
    .map((record) => toIntelligenceArtifact(record))
    .filter((artifact): artifact is IntelligenceArtifact => artifact !== null);
}

export async function publishServerIntelligenceArtifact(
  artifactId: string,
): Promise<IntelligenceArtifact | null> {
  const record = await publishIntelligenceArtifactRecord(artifactId);
  return toIntelligenceArtifact(record);
}

export async function archiveServerIntelligenceArtifact(
  artifactId: string,
): Promise<IntelligenceArtifact | null> {
  const record = await archiveIntelligenceArtifactRecord(artifactId);
  return toIntelligenceArtifact(record);
}

export async function supersedeServerIntelligenceArtifact(
  artifactId: string,
): Promise<IntelligenceArtifact | null> {
  const record = await supersedeIntelligenceArtifactRecord(artifactId);
  return toIntelligenceArtifact(record);
}

export async function createServerIntelligenceArtifact(
  artifact: IntelligenceArtifact,
): Promise<IntelligenceArtifact> {
  const record = await createIntelligenceArtifactRecord({
    artifactId: artifact.artifactId,
    artifactType: artifact.artifactType,
    repository: artifact.repository,
    sourceSnapshotId: artifact.sourceSnapshotId,
    author: artifact.author,
    createdAt: new Date(artifact.createdAt),
    generatedAt: new Date(artifact.generatedAt),
    version: artifact.version,
    format: artifact.format,
    source: artifact.source,
    status: artifact.status,
    previousArtifactId: artifact.previousArtifactId,
    metadata: artifact.metadata,
    integrity: artifact.integrity,
    signature: artifact.signature,
  });

  return toIntelligenceArtifact(record)!;
}
