import { eq } from "drizzle-orm";

import { db } from "../client.js";
import {
  researchFindingValidations,
  researchFindings,
} from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface ResearchFindingRecord {
  id: string;
  statement: string;
  confidence: number | null;
  validationIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResearchFindingRecordInput {
  id: string;
  statement: string;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

type ResearchFindingQueryDatabase = Pick<typeof db, "select">;

async function hydrateResearchFinding(
  database: ResearchFindingQueryDatabase,
  finding: typeof researchFindings.$inferSelect,
): Promise<ResearchFindingRecord> {
  const validations = await database
    .select({ id: researchFindingValidations.id })
    .from(researchFindingValidations)
    .where(eq(researchFindingValidations.findingId, finding.id));

  return {
    id: finding.id,
    statement: finding.statement,
    confidence: finding.confidence,
    validationIds: validations.map(({ id }) => id),
    createdAt: finding.createdAt,
    updatedAt: finding.updatedAt,
  };
}

export async function getResearchFindingRecord(
  id: string,
): Promise<ResearchFindingRecord | null> {
  const [finding] = await db
    .select()
    .from(researchFindings)
    .where(eq(researchFindings.id, id))
    .limit(1);

  if (!finding) {
    return null;
  }

  return hydrateResearchFinding(db, finding);
}

export async function createResearchFindingRecord(
  input: CreateResearchFindingRecordInput,
): Promise<ResearchFindingRecord> {
  const finding = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchFindings)
      .values({
        id: input.id,
        statement: input.statement,
        confidence: input.confidence ?? null,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      })
      .returning();

    if (!row) {
      throw new Error(`Failed to create research finding: ${input.id}`);
    }

    return row;
  });

  // Hydrate AFTER the transaction commits.
  return hydrateResearchFinding(db, finding);
}
