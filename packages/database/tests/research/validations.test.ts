import { eq } from "drizzle-orm";

import {
  db,
  researchFindingValidationHistory,
  researchFindingValidations,
  researchFindings,
} from "@titan/database";
import {
  createResearchFindingValidationHistoryRecord,
  createResearchFindingValidationRecord,
  getResearchFindingValidationHistoryRecord,
  getResearchFindingValidationRecord,
} from "../../src/research/validations.js";
import { withDatabaseTransaction } from "../../src/transaction.js";

describe("research finding validation persistence", () => {
  const findingId = "finding-validation-persistence-test-001";

  beforeEach(async () => {
    await db
      .delete(researchFindingValidationHistory)
      .where(
        eq(
          researchFindingValidationHistory.validationId,
          "validation-persistence-test-001",
        ),
      );

    await db
      .delete(researchFindingValidations)
      .where(eq(researchFindingValidations.id, "validation-persistence-test-001"));

    await db
      .delete(researchFindings)
      .where(eq(researchFindings.id, findingId));

    const timestamp = new Date("2026-09-03T10:00:00.000Z");

    await db.insert(researchFindings).values({
      id: findingId,
      statement: "Finding used for validation persistence tests.",
      confidence: 0.82,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  });

  afterEach(async () => {
    await db
      .delete(researchFindingValidationHistory)
      .where(
        eq(
          researchFindingValidationHistory.validationId,
          "validation-persistence-test-001",
        ),
      );

    await db
      .delete(researchFindingValidations)
      .where(eq(researchFindingValidations.id, "validation-persistence-test-001"));

    await db
      .delete(researchFindings)
      .where(eq(researchFindings.id, findingId));
  });

  it("creates and reads a validation through PostgreSQL", async () => {
    const createdAt = new Date("2026-09-03T10:00:00.000Z");
    const updatedAt = new Date("2026-09-03T11:00:00.000Z");
    const validatedAt = new Date("2026-09-03T11:30:00.000Z");

    const validation = await createResearchFindingValidationRecord({
      id: "validation-persistence-test-001",
      findingId,
      status: "Validated",
      decision: "Accept",
      rationale: "The evidence supports the finding.",
      validator: "test-validator",
      confidenceAtValidation: 0.82,
      supportingEvidenceCount: 4,
      contradictingEvidenceCount: 1,
      createdAt,
      updatedAt,
      validatedAt,
    });

    expect(validation).toEqual({
      id: "validation-persistence-test-001",
      findingId,
      status: "Validated",
      decision: "Accept",
      rationale: "The evidence supports the finding.",
      validator: "test-validator",
      confidenceAtValidation: 0.82,
      supportingEvidenceCount: 4,
      contradictingEvidenceCount: 1,
      createdAt,
      updatedAt,
      validatedAt,
    });

    await expect(
      getResearchFindingValidationRecord("validation-persistence-test-001"),
    ).resolves.toEqual(validation);
  });

  it("preserves nullable validation fields as null", async () => {
    const timestamp = new Date("2026-09-03T12:00:00.000Z");

    const validation = await createResearchFindingValidationRecord({
      id: "validation-persistence-test-001",
      findingId,
      status: "Pending",
      supportingEvidenceCount: 0,
      contradictingEvidenceCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    expect(validation).toEqual({
      id: "validation-persistence-test-001",
      findingId,
      status: "Pending",
      decision: null,
      rationale: null,
      validator: null,
      confidenceAtValidation: null,
      supportingEvidenceCount: 0,
      contradictingEvidenceCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      validatedAt: null,
    });
  });

  it("creates and reads a validation history record", async () => {
    const createdAt = new Date("2026-09-03T13:00:00.000Z");

    await createResearchFindingValidationRecord({
      id: "validation-persistence-test-001",
      findingId,
      status: "In Review",
      supportingEvidenceCount: 2,
      contradictingEvidenceCount: 0,
      createdAt,
      updatedAt: createdAt,
    });

    const history = await createResearchFindingValidationHistoryRecord({
      id: "validation-history-test-001",
      validationId: "validation-persistence-test-001",
      fromStatus: "Pending",
      toStatus: "In Review",
      timestamp: createdAt,
    });

    expect(history).toEqual({
      id: "validation-history-test-001",
      validationId: "validation-persistence-test-001",
      fromStatus: "Pending",
      toStatus: "In Review",
      decision: null,
      reason: null,
      timestamp: createdAt,
    });

    await expect(
      getResearchFindingValidationHistoryRecord(
        "validation-history-test-001",
      ),
    ).resolves.toEqual(history);

    await db
      .delete(researchFindingValidationHistory)
      .where(
        eq(
          researchFindingValidationHistory.id,
          "validation-history-test-001",
        ),
      );
  });

  it("returns null for missing validation and history records", async () => {
    await expect(
      getResearchFindingValidationRecord("validation-does-not-exist"),
    ).resolves.toBeNull();

    await expect(
      getResearchFindingValidationHistoryRecord(
        "validation-history-does-not-exist",
      ),
    ).resolves.toBeNull();
  });

  it("rolls back a validation insert when the transaction fails", async () => {
    const timestamp = new Date("2026-09-03T14:00:00.000Z");

    await expect(
      withDatabaseTransaction(async (tx) => {
        await tx.insert(researchFindingValidations).values({
          id: "validation-persistence-test-001",
          findingId,
          status: "Pending",
          supportingEvidenceCount: 0,
          contradictingEvidenceCount: 0,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        throw new Error("intentional validation rollback");
      }),
    ).rejects.toThrow("intentional validation rollback");

    await expect(
      getResearchFindingValidationRecord("validation-persistence-test-001"),
    ).resolves.toBeNull();
  });
});
