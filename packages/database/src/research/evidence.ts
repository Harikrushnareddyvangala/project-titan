import { eq } from "drizzle-orm";

import { db } from "../client.js";
import { researchEvidence } from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface ResearchEvidenceRecord {
  id: string;
  type: string;
  title: string;
  description: string | null;
  reference: string | null;
  createdAt: Date;
}

export interface CreateResearchEvidenceRecordInput {
  id: string;
  type: string;
  title: string;
  description?: string;
  reference?: string;
  createdAt: Date;
}

export async function getResearchEvidenceRecord(
  id: string,
): Promise<ResearchEvidenceRecord | null> {
  const [evidence] = await db
    .select()
    .from(researchEvidence)
    .where(eq(researchEvidence.id, id))
    .limit(1);

  if (!evidence) {
    return null;
  }

  return {
    id: evidence.id,
    type: evidence.type,
    title: evidence.title,
    description: evidence.description,
    reference: evidence.reference,
    createdAt: evidence.createdAt,
  };
}

export async function createResearchEvidenceRecord(
  input: CreateResearchEvidenceRecordInput,
): Promise<ResearchEvidenceRecord> {
  const evidence = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchEvidence)
      .values({
        id: input.id,
        type: input.type,
        title: input.title,
        description: input.description ?? null,
        reference: input.reference ?? null,
        createdAt: input.createdAt,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create research evidence: ${input.id}`,
      );
    }

    return row;
  });

  return {
    id: evidence.id,
    type: evidence.type,
    title: evidence.title,
    description: evidence.description,
    reference: evidence.reference,
    createdAt: evidence.createdAt,
  };
}
