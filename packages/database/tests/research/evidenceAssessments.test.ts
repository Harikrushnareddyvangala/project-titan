import { eq } from "drizzle-orm";

import {
  db,
  researchEvidence,
  researchEvidenceAssessments,
  researchFindings,
} from "@titan/database";
import {
  createResearchEvidenceAssessmentRecord,
  deleteResearchEvidenceAssessmentRecord,
  getResearchEvidenceAssessmentRecord,
  updateResearchEvidenceAssessmentRecord,
} from "../../src/research/evidenceAssessments.js";
import { withDatabaseTransaction } from "../../src/transaction.js";

describe("research evidence assessment persistence", () => {
  const findingId = "assessment-persistence-finding-001";
  const evidenceId = "assessment-persistence-evidence-001";
  const assessmentId = "assessment-persistence-001";

  const createdAt = new Date("2026-09-03T10:00:00.000Z");
  const updatedAt = new Date("2026-09-03T11:00:00.000Z");

  beforeEach(async () => {
    await db
      .delete(researchEvidenceAssessments)
      .where(eq(researchEvidenceAssessments.id, assessmentId));

    await db
      .delete(researchEvidence)
      .where(eq(researchEvidence.id, evidenceId));

    await db
      .delete(researchFindings)
      .where(eq(researchFindings.id, findingId));

    await db.insert(researchFindings).values({
      id: findingId,
      statement: "The evidence supports the research finding.",
      confidence: 0.82,
      createdAt,
      updatedAt,
    });

    await db.insert(researchEvidence).values({
      id: evidenceId,
      type: "Metric",
      title: "Retrieval quality metric",
      description: "Measured retrieval performance.",
      reference: "experiment://assessment-test",
      createdAt,
    });
  });

  afterEach(async () => {
    await db
      .delete(researchEvidenceAssessments)
      .where(eq(researchEvidenceAssessments.id, assessmentId));

    await db
      .delete(researchEvidence)
      .where(eq(researchEvidence.id, evidenceId));

    await db
      .delete(researchFindings)
      .where(eq(researchFindings.id, findingId));
  });

  it("creates and reads a complete evidence assessment through PostgreSQL", async () => {
    const assessment =
      await createResearchEvidenceAssessmentRecord({
        id: assessmentId,
        findingId,
        evidenceId,
        type: "Supporting",
        relevance: 0.9,
        supportStrength: 0.85,
        reliability: 0.95,
        independence: 0.8,
        rationale: "The metric directly supports the finding.",
        assessedAt: createdAt,
        updatedAt,
      });

    expect(assessment).toEqual({
      id: assessmentId,
      findingId,
      evidenceId,
      type: "Supporting",
      relevance: 0.9,
      supportStrength: 0.85,
      reliability: 0.95,
      independence: 0.8,
      rationale: "The metric directly supports the finding.",
      assessedAt: createdAt,
      updatedAt,
    });

    await expect(
      getResearchEvidenceAssessmentRecord(assessmentId),
    ).resolves.toEqual(assessment);
  });

  it("preserves nullable rationale as null", async () => {
    const assessment =
      await createResearchEvidenceAssessmentRecord({
        id: assessmentId,
        findingId,
        evidenceId,
        type: "Neutral",
        relevance: 0.5,
        supportStrength: 0.5,
        reliability: 0.7,
        independence: 0.6,
        assessedAt: createdAt,
        updatedAt,
      });

    expect(assessment.rationale).toBeNull();

    const loaded =
      await getResearchEvidenceAssessmentRecord(assessmentId);

    expect(loaded?.rationale).toBeNull();
  });

  it("returns null for a missing assessment", async () => {
    await expect(
      getResearchEvidenceAssessmentRecord(
        "assessment-does-not-exist",
      ),
    ).resolves.toBeNull();
  });

  it("updates assessment fields without changing identity or relationships", async () => {
    await createResearchEvidenceAssessmentRecord({
      id: assessmentId,
      findingId,
      evidenceId,
      type: "Supporting",
      relevance: 0.9,
      supportStrength: 0.85,
      reliability: 0.95,
      independence: 0.8,
      rationale: "Original rationale.",
      assessedAt: createdAt,
      updatedAt,
    });

    const updated =
      await updateResearchEvidenceAssessmentRecord({
        id: assessmentId,
        type: "Contradicting",
        supportStrength: 0.35,
        rationale: "Updated rationale.",
        updatedAt: new Date("2026-09-03T12:00:00.000Z"),
      });

    expect(updated).toEqual({
      id: assessmentId,
      findingId,
      evidenceId,
      type: "Contradicting",
      relevance: 0.9,
      supportStrength: 0.35,
      reliability: 0.95,
      independence: 0.8,
      rationale: "Updated rationale.",
      assessedAt: createdAt,
      updatedAt: new Date("2026-09-03T12:00:00.000Z"),
    });
  });

  it("returns null when updating a missing assessment", async () => {
    await expect(
      updateResearchEvidenceAssessmentRecord({
        id: "assessment-does-not-exist",
        supportStrength: 0.5,
        updatedAt,
      }),
    ).resolves.toBeNull();
  });

  it("deletes an assessment", async () => {
    await createResearchEvidenceAssessmentRecord({
      id: assessmentId,
      findingId,
      evidenceId,
      type: "Supporting",
      relevance: 0.9,
      supportStrength: 0.85,
      reliability: 0.95,
      independence: 0.8,
      assessedAt: createdAt,
      updatedAt,
    });

    await expect(
      deleteResearchEvidenceAssessmentRecord(assessmentId),
    ).resolves.toBe(true);

    await expect(
      getResearchEvidenceAssessmentRecord(assessmentId),
    ).resolves.toBeNull();
  });

  it("returns false when deleting a missing assessment", async () => {
    await expect(
      deleteResearchEvidenceAssessmentRecord(
        "assessment-does-not-exist",
      ),
    ).resolves.toBe(false);
  });

  it("enforces one assessment per finding and evidence pair", async () => {
    await createResearchEvidenceAssessmentRecord({
      id: assessmentId,
      findingId,
      evidenceId,
      type: "Supporting",
      relevance: 0.9,
      supportStrength: 0.85,
      reliability: 0.95,
      independence: 0.8,
      assessedAt: createdAt,
      updatedAt,
    });

    await expect(
      createResearchEvidenceAssessmentRecord({
        id: "assessment-persistence-duplicate-001",
        findingId,
        evidenceId,
        type: "Contradicting",
        relevance: 0.4,
        supportStrength: 0.3,
        reliability: 0.6,
        independence: 0.5,
        assessedAt: createdAt,
        updatedAt,
      }),
    ).rejects.toThrow();
  });

  it("rolls back an assessment insert when the transaction fails", async () => {
    await expect(
      withDatabaseTransaction(async (tx) => {
        await tx.insert(researchEvidenceAssessments).values({
          id: "assessment-test-rollback",
          findingId,
          evidenceId,
          type: "Supporting",
          relevance: 0.9,
          supportStrength: 0.8,
          reliability: 0.9,
          independence: 0.8,
          rationale: "This must be rolled back.",
          assessedAt: createdAt,
          updatedAt,
        });

        throw new Error("intentional assessment rollback");
      }),
    ).rejects.toThrow("intentional assessment rollback");

    await expect(
      getResearchEvidenceAssessmentRecord(
        "assessment-test-rollback",
      ),
    ).resolves.toBeNull();
  });
});
