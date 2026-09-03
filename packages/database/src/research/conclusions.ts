import { eq } from "drizzle-orm";

import { db } from "../client.js";
import {
  researchConclusionContradictingFindings,
  researchConclusionSupportingFindings,
  researchInvestigationConclusions,
} from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface ResearchInvestigationConclusionRecord {
  id: string;
  investigationId: string;
  statement: string;
  status: string;
  supportingFindingIds: string[];
  contradictingFindingIds: string[];
  uncertainty: string | null;
  nextAction: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResearchInvestigationConclusionRecordInput {
  id: string;
  investigationId: string;
  statement: string;
  status: string;
  supportingFindingIds?: string[];
  contradictingFindingIds?: string[];
  uncertainty?: string;
  nextAction?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateResearchInvestigationConclusionRecordInput {
  statement: string;
  status: string;
  supportingFindingIds?: string[];
  contradictingFindingIds?: string[];
  uncertainty?: string;
  nextAction?: string;
  updatedAt: Date;
}

type ResearchConclusionQueryDatabase = Pick<typeof db, "select">;

async function hydrateResearchInvestigationConclusion(
  database: ResearchConclusionQueryDatabase,
  conclusion: typeof researchInvestigationConclusions.$inferSelect,
): Promise<ResearchInvestigationConclusionRecord> {
  const [supportingFindings, contradictingFindings] = await Promise.all([
    database
      .select({
        findingId: researchConclusionSupportingFindings.findingId,
      })
      .from(researchConclusionSupportingFindings)
      .where(
        eq(
          researchConclusionSupportingFindings.conclusionId,
          conclusion.id,
        ),
      ),

    database
      .select({
        findingId: researchConclusionContradictingFindings.findingId,
      })
      .from(researchConclusionContradictingFindings)
      .where(
        eq(
          researchConclusionContradictingFindings.conclusionId,
          conclusion.id,
        ),
      ),
  ]);

  return {
    id: conclusion.id,
    investigationId: conclusion.investigationId,
    statement: conclusion.statement,
    status: conclusion.status,
    supportingFindingIds: supportingFindings.map(({ findingId }) => findingId),
    contradictingFindingIds: contradictingFindings.map(
      ({ findingId }) => findingId,
    ),
    uncertainty: conclusion.uncertainty,
    nextAction: conclusion.nextAction,
    createdAt: conclusion.createdAt,
    updatedAt: conclusion.updatedAt,
  };
}

export async function getResearchInvestigationConclusionRecord(
  id: string,
): Promise<ResearchInvestigationConclusionRecord | null> {
  const [conclusion] = await db
    .select()
    .from(researchInvestigationConclusions)
    .where(eq(researchInvestigationConclusions.id, id))
    .limit(1);

  if (!conclusion) {
    return null;
  }

  return hydrateResearchInvestigationConclusion(db, conclusion);
}

export async function createResearchInvestigationConclusionRecord(
  input: CreateResearchInvestigationConclusionRecordInput,
): Promise<ResearchInvestigationConclusionRecord> {
  const conclusion = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchInvestigationConclusions)
      .values({
        id: input.id,
        investigationId: input.investigationId,
        statement: input.statement,
        status: input.status,
        uncertainty: input.uncertainty ?? null,
        nextAction: input.nextAction ?? null,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create research conclusion: ${input.id}`,
      );
    }

    if (input.supportingFindingIds?.length) {
      await tx.insert(researchConclusionSupportingFindings).values(
        input.supportingFindingIds.map((findingId) => ({
          conclusionId: input.id,
          findingId,
        })),
      );
    }

    if (input.contradictingFindingIds?.length) {
      await tx.insert(researchConclusionContradictingFindings).values(
        input.contradictingFindingIds.map((findingId) => ({
          conclusionId: input.id,
          findingId,
        })),
      );
    }

    return row;
  });

  return hydrateResearchInvestigationConclusion(db, conclusion);
}

export async function updateResearchInvestigationConclusionRecord(
  id: string,
  input: UpdateResearchInvestigationConclusionRecordInput,
): Promise<ResearchInvestigationConclusionRecord> {
  const conclusion = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .update(researchInvestigationConclusions)
      .set({
        statement: input.statement,
        status: input.status,
        uncertainty: input.uncertainty ?? null,
        nextAction: input.nextAction ?? null,
        updatedAt: input.updatedAt,
      })
      .where(eq(researchInvestigationConclusions.id, id))
      .returning();

    if (!row) {
      throw new Error(`Research conclusion not found: ${id}`);
    }

    await tx
      .delete(researchConclusionSupportingFindings)
      .where(eq(researchConclusionSupportingFindings.conclusionId, id));

    await tx
      .delete(researchConclusionContradictingFindings)
      .where(eq(researchConclusionContradictingFindings.conclusionId, id));

    if (input.supportingFindingIds?.length) {
      await tx.insert(researchConclusionSupportingFindings).values(
        input.supportingFindingIds.map((findingId) => ({
          conclusionId: id,
          findingId,
        })),
      );
    }

    if (input.contradictingFindingIds?.length) {
      await tx.insert(researchConclusionContradictingFindings).values(
        input.contradictingFindingIds.map((findingId) => ({
          conclusionId: id,
          findingId,
        })),
      );
    }

    return row;
  });

  return hydrateResearchInvestigationConclusion(db, conclusion);
}
