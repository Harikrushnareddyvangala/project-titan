import { eq } from "drizzle-orm";

import { db } from "../client.js";
import {
  researchExperimentEvidence,
  researchExperimentFindings,
  researchExperimentLifecycleEvents,
  researchExperiments,
} from "../schema/index.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface ResearchExperimentLifecycleRecord {
  id: string;
  from: string | null;
  to: string;
  reason: string | null;
  timestamp: Date;
}

export interface ResearchExperimentRecord {
  id: string;
  investigationId: string;
  title: string;
  objective: string;
  status: string;
  description: string | null;
  evidenceIds: string[];
  findingIds: string[];
  lifecycle: ResearchExperimentLifecycleRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResearchExperimentRecordInput {
  id: string;
  investigationId: string;
  title: string;
  objective: string;
  status: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

type ResearchExperimentQueryDatabase = Pick<typeof db, "select">;

async function hydrateResearchExperiment(
  database: ResearchExperimentQueryDatabase,
  experiment: typeof researchExperiments.$inferSelect,
): Promise<ResearchExperimentRecord> {
  const [evidence, findings, lifecycle] = await Promise.all([
    database
      .select({
        evidenceId: researchExperimentEvidence.evidenceId,
      })
      .from(researchExperimentEvidence)
      .where(
        eq(
          researchExperimentEvidence.experimentId,
          experiment.id,
        ),
      ),

    database
      .select({
        findingId: researchExperimentFindings.findingId,
      })
      .from(researchExperimentFindings)
      .where(
        eq(
          researchExperimentFindings.experimentId,
          experiment.id,
        ),
      ),

    database
      .select({
        id: researchExperimentLifecycleEvents.id,
        from: researchExperimentLifecycleEvents.fromStatus,
        to: researchExperimentLifecycleEvents.toStatus,
        reason: researchExperimentLifecycleEvents.reason,
        timestamp: researchExperimentLifecycleEvents.timestamp,
      })
      .from(researchExperimentLifecycleEvents)
      .where(
        eq(
          researchExperimentLifecycleEvents.experimentId,
          experiment.id,
        ),
      ),
  ]);

  return {
    id: experiment.id,
    investigationId: experiment.investigationId,
    title: experiment.title,
    objective: experiment.objective,
    status: experiment.status,
    description: experiment.description,
    evidenceIds: evidence.map(({ evidenceId }) => evidenceId),
    findingIds: findings.map(({ findingId }) => findingId),
    lifecycle: lifecycle.map((event) => ({
      id: event.id,
      from: event.from,
      to: event.to,
      reason: event.reason,
      timestamp: event.timestamp,
    })),
    createdAt: experiment.createdAt,
    updatedAt: experiment.updatedAt,
  };
}

export async function getResearchExperimentRecord(
  id: string,
): Promise<ResearchExperimentRecord | null> {
  const [experiment] = await db
    .select()
    .from(researchExperiments)
    .where(eq(researchExperiments.id, id))
    .limit(1);

  if (!experiment) {
    return null;
  }

  return hydrateResearchExperiment(db, experiment);
}

export async function createResearchExperimentRecord(
  input: CreateResearchExperimentRecordInput,
): Promise<ResearchExperimentRecord> {
  const experiment = await withDatabaseTransaction(async (tx) => {
    const [row] = await tx
      .insert(researchExperiments)
      .values({
        id: input.id,
        investigationId: input.investigationId,
        title: input.title,
        objective: input.objective,
        status: input.status,
        description: input.description ?? null,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Failed to create research experiment: ${input.id}`,
      );
    }

    return row;
  });

  // Hydrate AFTER transaction commits.
  return hydrateResearchExperiment(db, experiment);
}
