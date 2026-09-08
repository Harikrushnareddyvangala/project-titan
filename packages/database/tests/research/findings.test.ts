import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  db,
  pool,
  researchFindingValidations,
  researchFindings,
} from "@titan/database";
import {
  createResearchFindingRecord,
  getResearchFindingRecord,
  getResearchFindingRecords,
} from "../../src/research/findings.js";
import { withDatabaseTransaction } from "../../src/transaction.js";

describe("research finding persistence", () => {
  it("creates and reads a finding through PostgreSQL", async () => {
    const createdAt = new Date("2026-09-03T10:00:00.000Z");
    const updatedAt = new Date("2026-09-03T11:00:00.000Z");

    const finding = await createResearchFindingRecord({
      id: "finding-persistence-test-001",
      statement: "The experimental approach improves retrieval quality.",
      confidence: 0.87,
      createdAt,
      updatedAt,
    });

    const [validation] = await db
      .insert(researchFindingValidations)
      .values({
        id: "finding-validation-test-001",
        findingId: finding.id,
        status: "Validated",
        decision: "Supported",
        rationale: "Evidence supports the finding.",
        validator: "test-validator",
        confidenceAtValidation: 0.9,
        supportingEvidenceCount: 3,
        contradictingEvidenceCount: 1,
        createdAt,
        updatedAt,
        validatedAt: updatedAt,
      })
      .returning();

    expect(validation).toBeDefined();

    const loaded = await getResearchFindingRecord(finding.id);

    expect(loaded).toEqual({
      id: "finding-persistence-test-001",
      statement: "The experimental approach improves retrieval quality.",
      confidence: 0.87,
      validationIds: ["finding-validation-test-001"],
      createdAt,
      updatedAt,
    });

    await db
      .delete(researchFindingValidations)
      .where(eq(researchFindingValidations.id, "finding-validation-test-001"));

    await db
      .delete(researchFindings)
      .where(eq(researchFindings.id, "finding-persistence-test-001"));
  });

  it("preserves nullable confidence as null", async () => {
    const timestamp = new Date("2026-09-03T12:00:00.000Z");

    const finding = await createResearchFindingRecord({
      id: "finding-persistence-test-002",
      statement: "Confidence has not yet been established.",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    expect(finding.confidence).toBeNull();
    expect(finding.validationIds).toEqual([]);

    const loaded = await getResearchFindingRecord(finding.id);

    expect(loaded?.confidence).toBeNull();
    expect(loaded?.validationIds).toEqual([]);

    await db
      .delete(researchFindings)
      .where(eq(researchFindings.id, "finding-persistence-test-002"));
  });

  it("returns null for a missing finding", async () => {
    await expect(
      getResearchFindingRecord("finding-does-not-exist"),
    ).resolves.toBeNull();
  });

  it("reads findings as a deterministically ordered collection", async () => {
    const firstId = `collection-finding-a-${randomUUID()}`;
    const secondId = `collection-finding-b-${randomUUID()}`;

    const createdAt = new Date("2026-09-03T14:00:00.000Z");
    const updatedAt = new Date("2026-09-03T14:05:00.000Z");

    try {
      await createResearchFindingRecord({
        id: secondId,
        statement: "Collection finding B",
        confidence: 0.8,
        createdAt,
        updatedAt,
      });

      await createResearchFindingRecord({
        id: firstId,
        statement: "Collection finding A",
        confidence: 0.9,
        createdAt,
        updatedAt,
      });

      const findings = await getResearchFindingRecords();

      const testFindings = findings.filter(
        ({ id }) => id === firstId || id === secondId,
      );

      expect(testFindings.map(({ id }) => id)).toEqual([
        firstId,
        secondId,
      ]);
    } finally {
      await pool.query(
        "DELETE FROM research_findings WHERE id = ANY($1)",
        [[firstId, secondId]],
      );
    }
  });

  it("rolls back a finding insert when the transaction fails", async () => {
    const timestamp = new Date("2026-09-03T13:00:00.000Z");

    await expect(
      withDatabaseTransaction(async (tx) => {
        await tx.insert(researchFindings).values({
          id: "finding-test-rollback",
          statement: "This finding must not persist.",
          confidence: 0.5,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        throw new Error("intentional finding rollback");
      }),
    ).rejects.toThrow("intentional finding rollback");

    await expect(
      getResearchFindingRecord("finding-test-rollback"),
    ).resolves.toBeNull();
  });
});
