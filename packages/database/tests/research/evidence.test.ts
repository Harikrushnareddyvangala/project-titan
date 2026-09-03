import { randomUUID } from "node:crypto";

import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import {
  createResearchEvidenceRecord,
  getResearchEvidenceRecord,
} from "../../src/research/evidence.js";
import { db, pool } from "../../src/index.js";
import { researchEvidence } from "../../src/schema/index.js";
import { withDatabaseTransaction } from "../../src/transaction.js";

describe("research evidence persistence", () => {
  const createdEvidenceIds: string[] = [];

  beforeEach(() => {
    createdEvidenceIds.length = 0;
  });

  afterEach(async () => {
    for (const id of createdEvidenceIds) {
      await db
        .delete(researchEvidence)
        .where(eq(researchEvidence.id, id));
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it("creates and reads an evidence record through PostgreSQL", async () => {
    const id = `evidence-${randomUUID()}`;
    const createdAt = new Date("2026-01-15T10:30:00.000Z");

    createdEvidenceIds.push(id);

    const created = await createResearchEvidenceRecord({
      id,
      type: "Metric",
      title: "Model accuracy benchmark",
      description: "Validation accuracy from the benchmark run.",
      reference: "experiment://benchmark-001",
      createdAt,
    });

    expect(created).toEqual({
      id,
      type: "Metric",
      title: "Model accuracy benchmark",
      description: "Validation accuracy from the benchmark run.",
      reference: "experiment://benchmark-001",
      createdAt,
    });

    const loaded = await getResearchEvidenceRecord(id);

    expect(loaded).toEqual(created);
  });

  it("preserves nullable evidence fields", async () => {
    const id = `evidence-${randomUUID()}`;
    const createdAt = new Date("2026-02-20T12:00:00.000Z");

    createdEvidenceIds.push(id);

    const created = await createResearchEvidenceRecord({
      id,
      type: "Analysis",
      title: "Analysis without optional metadata",
      createdAt,
    });

    expect(created.description).toBeNull();
    expect(created.reference).toBeNull();

    const loaded = await getResearchEvidenceRecord(id);

    expect(loaded).toEqual(created);
  });

  it("returns null when the evidence record does not exist", async () => {
    const loaded = await getResearchEvidenceRecord(
      `evidence-missing-${randomUUID()}`,
    );

    expect(loaded).toBeNull();
  });

  it("rolls back an evidence insert when the transaction fails", async () => {
    const id = `evidence-${randomUUID()}`;

    await expect(
      withDatabaseTransaction(async (tx) => {
        await tx.insert(researchEvidence).values({
          id,
          type: "File",
          title: "Rolled back evidence",
          description: null,
          reference: null,
          createdAt: new Date("2026-03-01T00:00:00.000Z"),
        });

        throw new Error("intentional evidence rollback");
      }),
    ).rejects.toThrow("intentional evidence rollback");

    const loaded = await getResearchEvidenceRecord(id);

    expect(loaded).toBeNull();
  });
});
