import {
  type UpdateResearchInvestigationConclusionRecordInput,
  updateResearchInvestigationConclusionRecordInTransaction,
} from "./conclusions.js";
import {
  type CreateResearchProvenanceEventRecordInput,
  createResearchProvenanceEventRecordInTransaction,
} from "./provenance.js";
import { withDatabaseTransaction } from "../transaction.js";

export interface PersistResearchLineageRemediationMutationInput {
  conclusionId: string;
  conclusion: UpdateResearchInvestigationConclusionRecordInput;
  provenance: CreateResearchProvenanceEventRecordInput;
}

export interface PersistResearchLineageRemediationMutationResult {
  provenanceEventId: string;
}
export async function persistResearchLineageRemediationMutation(
  input: PersistResearchLineageRemediationMutationInput,
): Promise<PersistResearchLineageRemediationMutationResult> {
  return withDatabaseTransaction(async (tx) => {
    await updateResearchInvestigationConclusionRecordInTransaction(
      tx,
      input.conclusionId,
      input.conclusion,
    );

    const provenance = await createResearchProvenanceEventRecordInTransaction(tx, input.provenance);

    return {
      provenanceEventId: provenance.id,
    };
  });
}
