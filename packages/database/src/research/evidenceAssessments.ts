import { eq } from "drizzle-orm";

import { db } from "../client.js";
import { researchEvidenceAssessments } from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface ResearchEvidenceAssessmentRecord {
  id: string;
  findingId: string;
  evidenceId: string;
  type: string;
  relevance: number;
  supportStrength: number;
  reliability: number;
  independence: number;
  rationale: string | null;
  assessedAt: Date;
  updatedAt: Date;
}

export interface CreateResearchEvidenceAssessmentRecordInput {
  id: string;
  findingId: string;
  evidenceId: string;
  type: string;
  relevance: number;
  supportStrength: number;
  reliability: number;
  independence: number;
  rationale?: string;
  assessedAt: Date;
  updatedAt: Date;
}

export interface UpdateResearchEvidenceAssessmentRecordInput {
  id: string;
  type?: string;
  relevance?: number;
  supportStrength?: number;
  reliability?: number;
  independence?: number;
  rationale?: string;
  updatedAt: Date;
}

function mapResearchEvidenceAssessmentRecord(
  assessment: typeof researchEvidenceAssessments.$inferSelect,
): ResearchEvidenceAssessmentRecord {
  return {
    id: assessment.id,
    findingId: assessment.findingId,
    evidenceId: assessment.evidenceId,
    type: assessment.type,
    relevance: assessment.relevance,
    supportStrength: assessment.supportStrength,
    reliability: assessment.reliability,
    independence: assessment.independence,
    rationale: assessment.rationale,
    assessedAt: assessment.assessedAt,
    updatedAt: assessment.updatedAt,
  };
}

export async function getResearchEvidenceAssessmentRecord(
  id: string,
): Promise<ResearchEvidenceAssessmentRecord | null> {
  const [assessment] = await db
    .select()
    .from(researchEvidenceAssessments)
    .where(eq(researchEvidenceAssessments.id, id))
    .limit(1);

  if (!assessment) {
    return null;
  }

  return mapResearchEvidenceAssessmentRecord(assessment);
}

export async function createResearchEvidenceAssessmentRecord(
  input: CreateResearchEvidenceAssessmentRecordInput,
): Promise<ResearchEvidenceAssessmentRecord> {
  const assessment = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchEvidenceAssessments)
      .values({
        id: input.id,
        findingId: input.findingId,
        evidenceId: input.evidenceId,
        type: input.type,
        relevance: input.relevance,
        supportStrength: input.supportStrength,
        reliability: input.reliability,
        independence: input.independence,
        rationale: input.rationale ?? null,
        assessedAt: input.assessedAt,
        updatedAt: input.updatedAt,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create research evidence assessment: ${input.id}`,
      );
    }

    return row;
  });

  return mapResearchEvidenceAssessmentRecord(assessment);
}

export async function updateResearchEvidenceAssessmentRecord(
  input: UpdateResearchEvidenceAssessmentRecordInput,
): Promise<ResearchEvidenceAssessmentRecord | null> {
  const assessment = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .update(researchEvidenceAssessments)
      .set({
        ...(input.type !== undefined && { type: input.type }),
        ...(input.relevance !== undefined && {
          relevance: input.relevance,
        }),
        ...(input.supportStrength !== undefined && {
          supportStrength: input.supportStrength,
        }),
        ...(input.reliability !== undefined && {
          reliability: input.reliability,
        }),
        ...(input.independence !== undefined && {
          independence: input.independence,
        }),
        ...(input.rationale !== undefined && {
          rationale: input.rationale,
        }),
        updatedAt: input.updatedAt,
      })
      .where(eq(researchEvidenceAssessments.id, input.id))
      .returning();

    return row ?? null;
  });

  return assessment
    ? mapResearchEvidenceAssessmentRecord(assessment)
    : null;
}

export async function deleteResearchEvidenceAssessmentRecord(
  id: string,
): Promise<boolean> {
  const deleted = await withDatabaseTransaction(async (tx) => {
    const result = await tx
      .delete(researchEvidenceAssessments)
      .where(eq(researchEvidenceAssessments.id, id))
      .returning({ id: researchEvidenceAssessments.id });

    return result.length > 0;
  });

  return deleted;
}
