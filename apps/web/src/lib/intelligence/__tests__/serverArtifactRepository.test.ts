import { describe, expect, it, vi } from "vitest";

import type { IntelligenceArtifact } from "../../../types/intelligence";

import {
  archiveServerIntelligenceArtifact,
  createServerIntelligenceArtifact,
  getServerIntelligenceArtifact,
  getServerIntelligenceArtifacts,
  publishServerIntelligenceArtifact,
  supersedeServerIntelligenceArtifact,
} from "../serverArtifactRepository";

vi.mock("@titan/database", () => ({
  archiveIntelligenceArtifactRecord: vi.fn(),
  createIntelligenceArtifactRecord: vi.fn(),
  getIntelligenceArtifactRecord: vi.fn(),
  getIntelligenceArtifactRecords: vi.fn(),
  publishIntelligenceArtifactRecord: vi.fn(),
  supersedeIntelligenceArtifactRecord: vi.fn(),
}));

import {
  archiveIntelligenceArtifactRecord,
  createIntelligenceArtifactRecord,
  getIntelligenceArtifactRecord,
  getIntelligenceArtifactRecords,
  publishIntelligenceArtifactRecord,
  supersedeIntelligenceArtifactRecord,
} from "@titan/database";

const record = {
  artifactId: "artifact-001",
  artifactType: "Technical Report",
  repository: "test/repository",
  sourceSnapshotId: "snapshot-001",
  author: "TITAN",
  createdAt: new Date("2026-09-30T08:10:00.000Z"),
  generatedAt: new Date("2026-09-30T08:10:30.000Z"),
  version: "1.0.0",
  format: "JSON",
  source: "Intelligence Snapshot",
  status: "Registered",
  previousArtifactId: null,
  metadata: {
    title: "Repository Technical Report",
    description: "Test intelligence artifact",
    tags: ["technical", "test"],
    repository: "test/repository",
    snapshotCreatedAt: "2026-09-30T08:00:00.000Z",
    generatedAt: "2026-09-30T08:10:30.000Z",
  },
  integrity: {
    algorithm: "SHA-256" as const,
    hash: "abc123",
    canonicalVersion: "1.0" as const,
    generatedAt: "2026-09-30T08:10:30.000Z",
  },
  signature: {
    algorithm: "ECDSA-P256-SHA256" as const,
    signerId: "titan",
    signerName: "TITAN",
    signerType: "System" as const,
    signedAt: "2026-09-30T08:10:30.000Z",
    keyId: "key-001",
    signature: "signature-value",
  },
};

const artifact: IntelligenceArtifact = {
  artifactId: record.artifactId,
  artifactType: record.artifactType as "Technical Report",
  repository: record.repository,
  sourceSnapshotId: record.sourceSnapshotId,
  author: record.author,
  createdAt: record.createdAt.toISOString(),
  generatedAt: record.generatedAt.toISOString(),
  version: record.version as "1.0.0",
  format: record.format as "JSON",
  source: record.source as "Intelligence Snapshot",
  status: record.status as "Registered",
  metadata: record.metadata,
  integrity: record.integrity,
  signature: record.signature,
};

describe("server artifact repository", () => {
  it("loads and maps an artifact", async () => {
    vi.mocked(getIntelligenceArtifactRecord).mockResolvedValue(record);

    await expect(
      getServerIntelligenceArtifact(record.artifactId),
    ).resolves.toEqual(artifact);
  });

  it("returns null for a missing artifact", async () => {
    vi.mocked(getIntelligenceArtifactRecord).mockResolvedValue(null);

    await expect(
      getServerIntelligenceArtifact("missing"),
    ).resolves.toBeNull();
  });

  it("loads and maps all artifacts", async () => {
    vi.mocked(getIntelligenceArtifactRecords).mockResolvedValue([record]);

    await expect(getServerIntelligenceArtifacts()).resolves.toEqual([artifact]);
  });

  it("maps nullable persistence fields to optional domain fields", async () => {
    vi.mocked(getIntelligenceArtifactRecord).mockResolvedValue({
      ...record,
      previousArtifactId: null,
      integrity: null,
      signature: null,
    });

    const loaded = await getServerIntelligenceArtifact(record.artifactId);

    expect(loaded).toEqual({
      ...artifact,
      previousArtifactId: undefined,
      integrity: undefined,
      signature: undefined,
    });
  });

  it("creates an artifact through the database repository", async () => {
    vi.mocked(createIntelligenceArtifactRecord).mockResolvedValue(record);

    await expect(createServerIntelligenceArtifact(artifact)).resolves.toEqual(
      artifact,
    );

    expect(createIntelligenceArtifactRecord).toHaveBeenCalledWith({
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
      previousArtifactId: undefined,
      metadata: artifact.metadata,
      integrity: artifact.integrity,
      signature: artifact.signature,
    });
  });

  it("publishes an artifact through the database lifecycle boundary", async () => {
    vi.mocked(publishIntelligenceArtifactRecord).mockResolvedValue({
      artifactId: record.artifactId,
      artifactType: record.artifactType,
      repository: record.repository,
      sourceSnapshotId: record.sourceSnapshotId,
      author: record.author,
      createdAt: record.createdAt,
      generatedAt: record.generatedAt,
      version: record.version,
      format: record.format,
      source: record.source,
      status: "Published",
      previousArtifactId: record.previousArtifactId,
      metadata: record.metadata,
      integrity: record.integrity,
      signature: record.signature,
    });

    await expect(
      publishServerIntelligenceArtifact(record.artifactId),
    ).resolves.toMatchObject({
      artifactId: record.artifactId,
      status: "Published",
    });

    expect(publishIntelligenceArtifactRecord).toHaveBeenCalledWith(
      record.artifactId,
    );
  });

  it("archives an artifact through the database lifecycle boundary", async () => {
    vi.mocked(archiveIntelligenceArtifactRecord).mockResolvedValue({
      ...record,
      status: "Archived",
    });

    await expect(
      archiveServerIntelligenceArtifact(record.artifactId),
    ).resolves.toMatchObject({
      artifactId: record.artifactId,
      status: "Archived",
    });

    expect(archiveIntelligenceArtifactRecord).toHaveBeenCalledWith(
      record.artifactId,
    );
  });

  it("supersedes an artifact through the database lifecycle boundary", async () => {
    vi.mocked(supersedeIntelligenceArtifactRecord).mockResolvedValue({
      ...record,
      status: "Superseded",
    });

    await expect(
      supersedeServerIntelligenceArtifact(record.artifactId),
    ).resolves.toMatchObject({
      artifactId: record.artifactId,
      status: "Superseded",
    });

    expect(supersedeIntelligenceArtifactRecord).toHaveBeenCalledWith(
      record.artifactId,
    );
  });

  it("returns null when the database lifecycle operation returns no artifact", async () => {
    vi.mocked(publishIntelligenceArtifactRecord).mockResolvedValue(null);

    await expect(
      publishServerIntelligenceArtifact("missing"),
    ).resolves.toBeNull();
  });

  it("preserves previous artifact lineage", async () => {
    const revisionRecord = {
      ...record,
      artifactId: "artifact-002",
      version: "2.0.0",
      previousArtifactId: record.artifactId,
    };

    vi.mocked(getIntelligenceArtifactRecord).mockResolvedValue(
      revisionRecord,
    );

    await expect(
      getServerIntelligenceArtifact(revisionRecord.artifactId),
    ).resolves.toMatchObject({
      artifactId: "artifact-002",
      version: "2.0.0",
      previousArtifactId: record.artifactId,
    });
  });
});
