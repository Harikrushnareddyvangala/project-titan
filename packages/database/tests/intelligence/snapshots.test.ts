import { randomUUID } from "node:crypto";

import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import {
  createIntelligenceSnapshotRecord,
  deleteIntelligenceSnapshotRecord,
  getIntelligenceSnapshotRecord,
  getIntelligenceSnapshotRecords,
} from "../../src/intelligence/snapshots.js";
import { db, pool } from "../../src/index.js";
import { intelligenceSnapshots } from "../../src/schema/index.js";
import { withDatabaseTransaction } from "../../src/transaction.js";

describe("intelligence snapshot persistence", () => {
  const createdSnapshotIds: string[] = [];

  beforeEach(() => {
    createdSnapshotIds.length = 0;
  });

  afterEach(async () => {
    for (const id of createdSnapshotIds) {
      await db
        .delete(intelligenceSnapshots)
        .where(eq(intelligenceSnapshots.id, id));
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it("creates and reads an intelligence snapshot through PostgreSQL", async () => {
    const id = `snapshot-${randomUUID()}`;
    const createdAt = new Date("2026-09-01T10:30:00.000Z");

    const analytics = {
      repositoryName: "project-titan",
      repositoryFullName: "Harikrushnareddyvangala/project-titan",
      stars: 42,
      forks: 7,
      engineeringScore: 91,
      deploymentReady: true,
      riskLevel: "Low",
      recommendations: [
        {
          title: "Increase test coverage",
          description: "Expand integration coverage.",
        },
      ],
      nested: {
        preserved: true,
        values: [1, 2, 3],
      },
    };

    createdSnapshotIds.push(id);

    const created = await createIntelligenceSnapshotRecord({
      id,
      repository: "Harikrushnareddyvangala/project-titan",
      createdAt,
      analytics,
    });

    expect(created).toEqual({
      id,
      repository: "Harikrushnareddyvangala/project-titan",
      createdAt,
      analytics,
    });

    const loaded = await getIntelligenceSnapshotRecord(id);

    expect(loaded).toEqual(created);
  });

  it("preserves the complete analytics JSON payload", async () => {
    const id = `snapshot-${randomUUID()}`;

    const analytics = {
      repositoryName: "analytics-test",
      arrays: ["one", "two"],
      nested: {
        score: 97,
        enabled: true,
        nullable: null,
      },
    };

    createdSnapshotIds.push(id);

    const created = await createIntelligenceSnapshotRecord({
      id,
      repository: "example/analytics-test",
      createdAt: new Date("2026-09-02T12:00:00.000Z"),
      analytics,
    });

    expect(created.analytics).toEqual(analytics);

    const loaded = await getIntelligenceSnapshotRecord(id);

    expect(loaded?.analytics).toEqual(analytics);
  });

  it("returns null when the snapshot does not exist", async () => {
    const loaded = await getIntelligenceSnapshotRecord(
      `snapshot-missing-${randomUUID()}`,
    );

    expect(loaded).toBeNull();
  });

  it("reads snapshots as a deterministically ordered collection", async () => {
    const firstId = `snapshot-a-${randomUUID()}`;
    const secondId = `snapshot-b-${randomUUID()}`;

    await createIntelligenceSnapshotRecord({
      id: secondId,
      repository: "example/repository-b",
      createdAt: new Date("2026-09-04T00:00:00.000Z"),
      analytics: { repositoryName: "repository-b" },
    });

    await createIntelligenceSnapshotRecord({
      id: firstId,
      repository: "example/repository-a",
      createdAt: new Date("2026-09-03T00:00:00.000Z"),
      analytics: { repositoryName: "repository-a" },
    });

    createdSnapshotIds.push(firstId, secondId);

    const snapshots = await getIntelligenceSnapshotRecords();

    const testSnapshots = snapshots.filter(
      ({ id }) => id === firstId || id === secondId,
    );

    expect(testSnapshots.map(({ id }) => id)).toEqual([firstId, secondId]);
  });

  it("uses the snapshot id as the deterministic tie-breaker", async () => {
    const firstId = `snapshot-a-${randomUUID()}`;
    const secondId = `snapshot-b-${randomUUID()}`;
    const createdAt = new Date("2026-09-05T00:00:00.000Z");

    await createIntelligenceSnapshotRecord({
      id: secondId,
      repository: "example/repository-b",
      createdAt,
      analytics: { repositoryName: "repository-b" },
    });

    await createIntelligenceSnapshotRecord({
      id: firstId,
      repository: "example/repository-a",
      createdAt,
      analytics: { repositoryName: "repository-a" },
    });

    createdSnapshotIds.push(firstId, secondId);

    const snapshots = await getIntelligenceSnapshotRecords();

    const testSnapshots = snapshots.filter(
      ({ id }) => id === firstId || id === secondId,
    );

    expect(testSnapshots.map(({ id }) => id)).toEqual([firstId, secondId]);
  });

  it("deletes an existing intelligence snapshot", async () => {
    const id = `snapshot-delete-${randomUUID()}`;

    await createIntelligenceSnapshotRecord({
      id,
      repository: "example/delete-test",
      createdAt: new Date("2026-09-07T00:00:00.000Z"),
      analytics: { repositoryName: "delete-test" },
    });

    createdSnapshotIds.push(id);

    await expect(
      deleteIntelligenceSnapshotRecord(id),
    ).resolves.toBe(true);

    await expect(
      getIntelligenceSnapshotRecord(id),
    ).resolves.toBeNull();
  });

  it("returns false when deleting a missing intelligence snapshot", async () => {
    const id = `snapshot-delete-missing-${randomUUID()}`;

    await expect(
      deleteIntelligenceSnapshotRecord(id),
    ).resolves.toBe(false);
  });

  it("rolls back a snapshot insert when the transaction fails", async () => {
    const id = `snapshot-${randomUUID()}`;

    await expect(
      withDatabaseTransaction(async (tx) => {
        await tx.insert(intelligenceSnapshots).values({
          id,
          repository: "example/rollback-test",
          createdAt: new Date("2026-09-06T00:00:00.000Z"),
          analytics: {
            repositoryName: "rollback-test",
          },
        });

        throw new Error("intentional intelligence snapshot rollback");
      }),
    ).rejects.toThrow("intentional intelligence snapshot rollback");

    const loaded = await getIntelligenceSnapshotRecord(id);

    expect(loaded).toBeNull();
  });
});
