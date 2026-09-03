import { eq } from "drizzle-orm";

import { db, researchFindingValidations, researchFindings } from "@titan/database";
import {
  createResearchFindingRecord,
  getResearchFindingRecord,
} from "../../src/research/findings.js";
import { withDatabaseTransaction } from "../../src/transaction.js";

describe("research finding persistence", () => {
  it("creates and reads a finding through PostgreSQL", async () => {
    const createdAt = new Date("2026-09-03T10:00:00.000Z");
    const updatedAt = new Date("2026-09-03T11:00:00.000Z");

    const finding = await createResearchFindingRecord({
      id: "finding-test-001",
      statement: "The experimental approach improves retrieval quality.",
      confidence: 0.87,
      createdAt,
      updatedAt,
    });

    const [validation] = await db
      .insert(researchFindingValidations)
      .values({
        id: "validation-test-001",
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
      id: "finding-test-001",
      statement: "The experimental approach improves retrieval quality.",
      confidence: 0.87,
      validationIds: ["validation-test-001"],
      createdAt,
      updatedAt,
    });

    await db
      .delete(researchFindingValidations)
      .where(eq(researchFindingValidations.id, "validation-test-001"));

    await db
      .delete(researchFindings)
      .where(eq(researchFindings.id, "finding-test-001"));
  });

  it("preserves nullable confidence as null", async () => {
    const timestamp = new Date("2026-09-03T12:00:00.000Z");

    const finding = await createResearchFindingRecord({
      id: "finding-test-002",
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
      .where(eq(researchFindings.id, "finding-test-002"));
  });

  it("returns null for a missing finding", async () => {
    await expect(
      getResearchFindingRecord("finding-does-not-exist"),
    ).resolves.toBeNull();
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
