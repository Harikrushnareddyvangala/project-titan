import "server-only";

import {
  createResearchReconciliationObligationRecord,
  persistResearchLineageRemediationMutation,
} from "@titan/database";

import type { ResearchInvestigationConclusion } from "@/types/research";

export interface ResearchLineageRemediationAsyncPersistence {
  persistResearchLineageRemediationMutation(input: {
    conclusion: ResearchInvestigationConclusion;
    expectedUpdatedAt: Date;
    provenance: {
      investigationId: string;
      entityType: "Conclusion";
      entityId: string;
      eventType: "Updated";
      reason: string;
    };
  }): Promise<{
    provenanceEventId: string;
  }>;

  createResearchReconciliationObligation(input: {
    id: string;
    investigationId: string;
    issueCode: string;
    targetEntityType: string;
    targetEntityId: string;
    remediationAction: string;
    remediationExecutionId?: string;
    provenanceEventId?: string;
    status: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
  }): Promise<void>;
}

function createResearchProvenanceId(): string {
  return `research-provenance-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const researchLineageRemediationDatabasePersistence: ResearchLineageRemediationAsyncPersistence =
  {
    async persistResearchLineageRemediationMutation(input) {
      return persistResearchLineageRemediationMutation({
        conclusionId: input.conclusion.id,
        expectedUpdatedAt: input.expectedUpdatedAt,
        conclusion: {
          statement: input.conclusion.statement,
          status: input.conclusion.status,
          supportingFindingIds: input.conclusion.supportingFindingIds,
          contradictingFindingIds: input.conclusion.contradictingFindingIds,
          uncertainty: input.conclusion.uncertainty,
          nextAction: input.conclusion.nextAction,
          updatedAt: new Date(input.conclusion.updatedAt),
        },
        provenance: {
          id: createResearchProvenanceId(),
          investigationId: input.conclusion.investigationId,
          entityType: input.provenance.entityType,
          entityId: input.provenance.entityId,
          eventType: input.provenance.eventType,
          reason: input.provenance.reason,
          timestamp: new Date(),
        },
      });
    },

    async createResearchReconciliationObligation(input) {
      await createResearchReconciliationObligationRecord(input);
    },
  };
