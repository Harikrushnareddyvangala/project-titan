import { eq, and } from "drizzle-orm";

import {
  type UpdateResearchInvestigationConclusionRecordInput,
} from "./conclusions.js";
import {
  type CreateResearchProvenanceEventRecordInput,
  createResearchProvenanceEventRecordInTransaction,
} from "./provenance.js";
import { withDatabaseTransaction } from "../transaction.js";
import {
  researchConclusionContradictingFindings,
  researchConclusionSupportingFindings,
  researchInvestigationConclusions,
} from "../schema/index.js";
import { type TitanDatabaseTransaction } from "../transaction.js";

export interface PersistResearchLineageRemediationMutationInput {
  conclusionId: string;
  expectedUpdatedAt: Date;
  conclusion: UpdateResearchInvestigationConclusionRecordInput;
  provenance: CreateResearchProvenanceEventRecordInput;
}

export interface PersistResearchLineageRemediationMutationResult {
  provenanceEventId: string;
}

async function updateResearchInvestigationConclusionForRemediation(
  tx: TitanDatabaseTransaction,
  id: string,
  input: UpdateResearchInvestigationConclusionRecordInput,
  expectedUpdatedAt: Date,
): Promise<typeof researchInvestigationConclusions.$inferSelect> {
  const [row] = await tx
    .update(researchInvestigationConclusions)
    .set({
      statement: input.statement,
      status: input.status,
      uncertainty: input.uncertainty ?? null,
      nextAction: input.nextAction ?? null,
      updatedAt: input.updatedAt,
    })
    .where(
      and(
        eq(researchInvestigationConclusions.id, id),
        eq(researchInvestigationConclusions.updatedAt, expectedUpdatedAt),
      ),
    )
    .returning();

  if (!row) {
    throw new Error(
      `Research remediation rejected because the conclusion changed after the remediation plan was created: ${id}`,
    );
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
}

export async function persistResearchLineageRemediationMutation(
  input: PersistResearchLineageRemediationMutationInput,
): Promise<PersistResearchLineageRemediationMutationResult> {
  return withDatabaseTransaction(async (tx) => {
    await updateResearchInvestigationConclusionForRemediation(
      tx,
      input.conclusionId,
      input.conclusion,
      input.expectedUpdatedAt,
    );

    const provenance = await createResearchProvenanceEventRecordInTransaction(
      tx,
      input.provenance,
    );

    return {
      provenanceEventId: provenance.id,
    };
  });
}
