import "server-only";

import type {
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRequest,
  ResearchReconciliationObligation,
} from "@/types/research";

import {
  createResearchLineageIntegrityRemediationPlan,
  createResearchLineageIntegrityRemediationRequest,
  type ResearchLineageRemediationPlanningDependencies,
} from "../lineage/remediation/planning";
import {
  createServerLineageService,
  loadServerResearchSnapshot,
  type ServerResearchSnapshot,
} from "../serverResearchSnapshot";
import { getResearchReconciliationObligation } from "./serverRepository";

export interface ResearchReconciliationObligationConfirmationDependencies {
  getResearchReconciliationObligation(
    id: string,
  ): Promise<ResearchReconciliationObligation | null>;

  loadServerResearchSnapshot(): Promise<ServerResearchSnapshot>;

  createServerLineageService(
    snapshot: ServerResearchSnapshot,
  ): ReturnType<typeof createServerLineageService>;

  createResearchLineageIntegrityRemediationRequest(
    investigationId: string,
    issue: ResearchLineageIntegrityIssue,
    confirmed: boolean,
    replacementEntityId?: string,
    enforceConfirmation?: boolean,
  ): ResearchLineageIntegrityRemediationRequest | null;

  createResearchLineageIntegrityRemediationPlan(
    request: ResearchLineageIntegrityRemediationRequest,
    dependencies: ResearchLineageRemediationPlanningDependencies,
  ): ResearchLineageIntegrityRemediationPlan;
}

export interface ResearchReconciliationObligationConfirmationResult {
  obligationId: string;
  investigationId: string;
  status:
    | "Validated"
    | "NotRequired"
    | "NotRepairable"
    | "NotAllowed";
  obligation: ResearchReconciliationObligation;
  issue?: ResearchLineageIntegrityIssue;
  request?: ResearchLineageIntegrityRemediationRequest;
  plan?: ResearchLineageIntegrityRemediationPlan;
  reason: string;
}

const defaultDependencies: ResearchReconciliationObligationConfirmationDependencies =
  {
    getResearchReconciliationObligation,
    loadServerResearchSnapshot,
    createServerLineageService,
    createResearchLineageIntegrityRemediationRequest,
    createResearchLineageIntegrityRemediationPlan,
  };

export async function confirmResearchReconciliationObligationRecoveryOnServer(
  obligationId: string,
  dependencies: ResearchReconciliationObligationConfirmationDependencies =
    defaultDependencies,
): Promise<ResearchReconciliationObligationConfirmationResult | null> {
  const obligation =
    await dependencies.getResearchReconciliationObligation(obligationId);

  if (!obligation) {
    return null;
  }

  if (obligation.status !== "In Progress") {
    return {
      obligationId: obligation.id,
      investigationId: obligation.investigationId,
      status: "NotAllowed",
      obligation,
      reason:
        "Reconciliation obligation must be In Progress before recovery confirmation.",
    };
  }

  const snapshot = await dependencies.loadServerResearchSnapshot();
  const lineageService = dependencies.createServerLineageService(snapshot);

  const integrityResult =
    lineageService.validateResearchLineageForInvestigation(
      obligation.investigationId,
    );

  const matchingIssues = integrityResult.issues.filter(
    (issue) =>
      issue.investigationId === obligation.investigationId &&
      issue.code === obligation.issueCode &&
      issue.targetId === obligation.targetEntityId,
  );

  if (matchingIssues.length === 0) {
    return {
      obligationId: obligation.id,
      investigationId: obligation.investigationId,
      status: "NotRequired",
      obligation,
      reason:
        "The integrity condition represented by the reconciliation obligation is no longer present.",
    };
  }

  const issue = matchingIssues[0];

  const request =
    dependencies.createResearchLineageIntegrityRemediationRequest(
      obligation.investigationId,
      issue,
      true,
      undefined,
      true,
    );

  if (!request) {
    return {
      obligationId: obligation.id,
      investigationId: obligation.investigationId,
      status: "NotRepairable",
      obligation,
      issue,
      reason:
        "The current integrity issue does not produce an executable remediation request.",
    };
  }

  const planningDependencies: ResearchLineageRemediationPlanningDependencies =
    {
      getResearchLineage: (investigationId) =>
        lineageService.getResearchLineage(investigationId),
      getResearchInvestigations: () => snapshot.getResearchInvestigations,
      getResearchExperiments: () => snapshot.getResearchExperiments,
      getResearchEvidence: () => snapshot.getResearchEvidence,
      getResearchFindings: () => snapshot.getResearchFindings,
      getResearchFindingValidations: () =>
        snapshot.getResearchFindingValidations,
      getResearchInvestigationConclusions: () =>
        snapshot.getResearchInvestigationConclusions,
    };

  const plan = dependencies.createResearchLineageIntegrityRemediationPlan(
    request,
    planningDependencies,
  );

  return {
    obligationId: obligation.id,
    investigationId: obligation.investigationId,
    status: "Validated",
    obligation,
    issue,
    request,
    plan,
    reason:
      "The current integrity issue remains unresolved and an explicitly confirmed remediation plan has been prepared.",
  };
}
