import { eq } from "drizzle-orm";

import { db } from "../client.js";
import {
  researchInvestigationArtifacts,
  researchInvestigationConclusions,
  researchInvestigationEvidence,
  researchInvestigationFindings,
  researchInvestigations,
  researchExperiments,
} from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface ResearchInvestigationRecord {
  id: string;
  title: string;
  objective: string;
  question: string;
  status: string;
  description: string | null;
  repository: string | null;
  experimentIds: string[];
  evidenceIds: string[];
  findingIds: string[];
  artifactIds: string[];
  conclusionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResearchInvestigationRecordInput {
  id: string;
  title: string;
  objective: string;
  question: string;
  status: string;
  description?: string;
  repository?: string;
  createdAt: Date;
  updatedAt: Date;
}

type ResearchInvestigationQueryDatabase = Pick<
  typeof db,
  "select"
>;

async function hydrateResearchInvestigation(
  database: ResearchInvestigationQueryDatabase,
  investigation: typeof researchInvestigations.$inferSelect,
): Promise<ResearchInvestigationRecord> {
  const [
    experiments,
    evidence,
    findings,
    artifacts,
    conclusions,
  ] = await Promise.all([
    database
      .select({ id: researchExperiments.id })
      .from(researchExperiments)
      .where(eq(researchExperiments.investigationId, investigation.id)),

    database
      .select({ evidenceId: researchInvestigationEvidence.evidenceId })
      .from(researchInvestigationEvidence)
      .where(
        eq(
          researchInvestigationEvidence.investigationId,
          investigation.id,
        ),
      ),

    database
      .select({ findingId: researchInvestigationFindings.findingId })
      .from(researchInvestigationFindings)
      .where(
        eq(
          researchInvestigationFindings.investigationId,
          investigation.id,
        ),
      ),

    database
      .select({ artifactId: researchInvestigationArtifacts.artifactId })
      .from(researchInvestigationArtifacts)
      .where(
        eq(
          researchInvestigationArtifacts.investigationId,
          investigation.id,
        ),
      ),

    database
      .select({ id: researchInvestigationConclusions.id })
      .from(researchInvestigationConclusions)
      .where(
        eq(
          researchInvestigationConclusions.investigationId,
          investigation.id,
        ),
      ),
  ]);

  return {
    id: investigation.id,
    title: investigation.title,
    objective: investigation.objective,
    question: investigation.question,
    status: investigation.status,
    description: investigation.description,
    repository: investigation.repository,
    experimentIds: experiments.map(({ id }) => id),
    evidenceIds: evidence.map(({ evidenceId }) => evidenceId),
    findingIds: findings.map(({ findingId }) => findingId),
    artifactIds: artifacts.map(({ artifactId }) => artifactId),
    conclusionIds: conclusions.map(({ id }) => id),
    createdAt: investigation.createdAt,
    updatedAt: investigation.updatedAt,
  };
}

export async function getResearchInvestigationRecord(
  id: string,
): Promise<ResearchInvestigationRecord | null> {
  const [investigation] = await db
    .select()
    .from(researchInvestigations)
    .where(eq(researchInvestigations.id, id))
    .limit(1);

  if (!investigation) {
    return null;
  }

  return hydrateResearchInvestigation(db, investigation);
}

export async function createResearchInvestigationRecord(
  input: CreateResearchInvestigationRecordInput,
): Promise<ResearchInvestigationRecord> {
  const investigation = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchInvestigations)
      .values({
        id: input.id,
        title: input.title,
        objective: input.objective,
        question: input.question,
        status: input.status,
        description: input.description ?? null,
        repository: input.repository ?? null,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create research investigation: ${input.id}`,
      );
    }

    return row;
  });

  // Hydrate AFTER transaction commits.
  return hydrateResearchInvestigation(db, investigation);
}
