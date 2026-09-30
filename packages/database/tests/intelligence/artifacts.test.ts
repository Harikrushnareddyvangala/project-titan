import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  archiveIntelligenceArtifactRecord,
  createIntelligenceArtifactRecord,
  getIntelligenceArtifactRecord,
  getIntelligenceArtifactRecords,
  publishIntelligenceArtifactRecord,
  supersedeIntelligenceArtifactRecord,
} from "../../src/intelligence/artifacts.js";
import {
  createIntelligenceSnapshotRecord,
  deleteIntelligenceSnapshotRecord,
} from "../../src/intelligence/snapshots.js";
import { db, pool } from "../../src/index.js";
import { intelligenceArtifacts } from "../../src/schema/intelligenceArtifacts.js";

const snapshotId = "snapshot-artifact-repository-test";

const baseSnapshot = {
  id: snapshotId,
  repository: "test/repository",
  createdAt: new Date("2026-09-30T08:00:00.000Z"),
  analytics: {
    repository: "test/repository",
    languages: { TypeScript: 100 },
    commits: 12,
  },
};

const baseArtifact = {
  artifactId: "artifact-repository-test-001",
  artifactType: "Technical Report",
  repository: "test/repository",
  sourceSnapshotId: snapshotId,
  author: "TITAN",
  createdAt: new Date("2026-09-30T08:10:00.000Z"),
  generatedAt: new Date("2026-09-30T08:10:30.000Z"),
  version: "1.0.0",
  format: "JSON",
  source: "Intelligence Snapshot",
  status: "Registered",
  previousArtifactId: undefined,
  metadata: {
    reportTitle: "Repository Technical Report",
    sections: ["overview", "analytics"],
    custom: {
      preserved: true,
    },
  },
  integrity: {
    algorithm: "SHA-256",
    hash: "abc123",
    canonicalVersion: "1",
  },
  signature: {
    algorithm: "Ed25519",
    signerId: "titan",
    keyId: "key-001",
    signature: "signature-value",
  },
};

beforeAll(async () => {
  await createIntelligenceSnapshotRecord(baseSnapshot);
});

afterAll(async () => {
  await db.delete(intelligenceArtifacts);
  await deleteIntelligenceSnapshotRecord(snapshotId);
  await pool.end();
});

describe("intelligence artifact repository", () => {
  it("creates and reads an artifact", async () => {
    const created = await createIntelligenceArtifactRecord(baseArtifact);

    expect(created).toEqual({
      artifactId: baseArtifact.artifactId,
      artifactType: baseArtifact.artifactType,
      repository: baseArtifact.repository,
      sourceSnapshotId: baseArtifact.sourceSnapshotId,
      author: baseArtifact.author,
      createdAt: baseArtifact.createdAt,
      generatedAt: baseArtifact.generatedAt,
      version: baseArtifact.version,
      format: baseArtifact.format,
      source: baseArtifact.source,
      status: baseArtifact.status,
      previousArtifactId: null,
      metadata: baseArtifact.metadata,
      integrity: baseArtifact.integrity,
      signature: baseArtifact.signature,
    });

    const loaded = await getIntelligenceArtifactRecord(
      baseArtifact.artifactId,
    );

    expect(loaded).toEqual(created);
  });

  it("preserves complete metadata, integrity, and signature payloads", async () => {
    const loaded = await getIntelligenceArtifactRecord(
      baseArtifact.artifactId,
    );

    expect(loaded?.metadata).toEqual(baseArtifact.metadata);
    expect(loaded?.integrity).toEqual(baseArtifact.integrity);
    expect(loaded?.signature).toEqual(baseArtifact.signature);
  });

  it("returns null for a missing artifact", async () => {
    await expect(
      getIntelligenceArtifactRecord("artifact-does-not-exist"),
    ).resolves.toBeNull();
  });

  it("orders artifacts deterministically by createdAt and artifactId", async () => {
    await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId: "artifact-repository-test-002",
      createdAt: new Date("2026-09-30T08:20:00.000Z"),
      generatedAt: new Date("2026-09-30T08:20:00.000Z"),
      version: "1.0.1",
    });

    await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId: "artifact-repository-test-003",
      createdAt: new Date("2026-09-30T08:20:00.000Z"),
      generatedAt: new Date("2026-09-30T08:20:00.000Z"),
      version: "1.0.2",
    });

    const artifacts = await getIntelligenceArtifactRecords();

    expect(
      artifacts.map((artifact) => artifact.artifactId),
    ).toEqual([
      "artifact-repository-test-001",
      "artifact-repository-test-002",
      "artifact-repository-test-003",
    ]);
  });

  it("preserves a previous artifact relationship", async () => {
    const revision = await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId: "artifact-repository-test-004",
      version: "2.0.0",
      previousArtifactId: baseArtifact.artifactId,
      createdAt: new Date("2026-09-30T08:30:00.000Z"),
      generatedAt: new Date("2026-09-30T08:30:00.000Z"),
    });

    expect(revision.previousArtifactId).toBe(baseArtifact.artifactId);
  });

  it("rejects duplicate source snapshot, artifact type, and version", async () => {
    await expect(
      createIntelligenceArtifactRecord({
        ...baseArtifact,
        artifactId: "artifact-repository-test-duplicate",
      }),
    ).rejects.toThrow();
  });

  it("rejects an artifact whose source snapshot does not exist", async () => {
    await expect(
      createIntelligenceArtifactRecord({
        ...baseArtifact,
        artifactId: "artifact-repository-test-invalid-snapshot",
        sourceSnapshotId: "snapshot-does-not-exist",
        version: "9.0.0",
      }),
    ).rejects.toThrow();
  });

  it("publishes a registered artifact", async () => {
    const artifactId = "artifact-lifecycle-publish";

    await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId,
      version: "20.0.0",
      status: "Registered",
    });

    const published = await publishIntelligenceArtifactRecord(artifactId);

    expect(published?.status).toBe("Published");
    expect(published?.artifactId).toBe(artifactId);

    const loaded = await getIntelligenceArtifactRecord(artifactId);

    expect(loaded?.status).toBe("Published");
  });

  it("supersedes a published artifact", async () => {
    const artifactId = "artifact-lifecycle-supersede";

    await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId,
      version: "21.0.0",
      status: "Published",
    });

    const superseded = await supersedeIntelligenceArtifactRecord(artifactId);

    expect(superseded?.status).toBe("Superseded");

    const loaded = await getIntelligenceArtifactRecord(artifactId);

    expect(loaded?.status).toBe("Superseded");
  });

  it("archives a superseded artifact", async () => {
    const artifactId = "artifact-lifecycle-archive-superseded";

    await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId,
      version: "22.0.0",
      status: "Superseded",
    });

    const archived = await archiveIntelligenceArtifactRecord(artifactId);

    expect(archived?.status).toBe("Archived");

    const loaded = await getIntelligenceArtifactRecord(artifactId);

    expect(loaded?.status).toBe("Archived");
  });

  it("archives a registered artifact", async () => {
    const artifactId = "artifact-lifecycle-archive-registered";

    await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId,
      version: "23.0.0",
      status: "Registered",
    });

    const archived = await archiveIntelligenceArtifactRecord(artifactId);

    expect(archived?.status).toBe("Archived");
  });

  it("rejects an illegal lifecycle transition", async () => {
    const artifactId = "artifact-lifecycle-illegal";

    await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId,
      version: "24.0.0",
      status: "Registered",
    });

    const result = await supersedeIntelligenceArtifactRecord(artifactId);

    expect(result).toBeNull();

    const loaded = await getIntelligenceArtifactRecord(artifactId);

    expect(loaded?.status).toBe("Registered");
  });

  it("treats a same-state lifecycle transition as idempotent", async () => {
    const artifactId = "artifact-lifecycle-idempotent";

    const created = await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId,
      version: "25.0.0",
      status: "Published",
    });

    const published = await publishIntelligenceArtifactRecord(artifactId);

    expect(published).toEqual(created);
  });

  it("returns null when transitioning a missing artifact", async () => {
    await expect(
      publishIntelligenceArtifactRecord("artifact-lifecycle-missing"),
    ).resolves.toBeNull();
  });

  it("preserves artifact fields other than status during lifecycle transition", async () => {
    const artifactId = "artifact-lifecycle-preservation";

    const created = await createIntelligenceArtifactRecord({
      ...baseArtifact,
      artifactId,
      version: "26.0.0",
      status: "Registered",
    });

    const published = await publishIntelligenceArtifactRecord(artifactId);

    expect(published).toEqual({
      ...created,
      status: "Published",
    });
  });

  it("rejects an artifact whose previous artifact does not exist", async () => {
    await expect(
      createIntelligenceArtifactRecord({
        ...baseArtifact,
        artifactId: "artifact-repository-test-invalid-previous",
        previousArtifactId: "artifact-does-not-exist",
        version: "10.0.0",
      }),
    ).rejects.toThrow();
  });
});
