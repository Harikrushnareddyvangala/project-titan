import "server-only";

import type {
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRequest,
  ResearchReconciliationObligation,
} from "@/types/research";

import {
  getResearchReconciliationObligation,
} from "./serverRepository";

import {
  loadServerResearchSnapshot,
  createServerLineageService,
  type ServerResearchSnapshot,
} from "../serverResearchSnapshot";

import {
  createResearchLineageIntegrityRemediationRequest,
  createResearchLineageIntegrityRemediationPlan,
  type ResearchLineageRemediationPlanningDependencies,
} from "../lineage/remediation/planning";

export type ResearchReconciliationObligationRecoveryPlanningStatus =
  | "Planned"
  | "NotRequired"
  | "NotRepairable";

export interface ResearchReconciliationObligationRecoveryPlanningResult {
  obligationId: string;
  investigationId: string;
  status: ResearchReconciliationObligationRecoveryPlanningStatus;
  obligation: ResearchReconciliationObligation;
  issue?: ResearchLineageIntegrityIssue;
  request?: ResearchLineageIntegrityRemediationRequest;
  plan?: ResearchLineageIntegrityRemediationPlan;
  reason: string;
}

export interface ResearchReconciliationObligationRecoveryPlanningDependencies {
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

const defaultDependencies: ResearchReconciliationObligationRecoveryPlanningDependencies =
  {
    getResearchReconciliationObligation,
    loadServerResearchSnapshot,
    createServerLineageService,
    createResearchLineageIntegrityRemediationRequest,
    createResearchLineageIntegrityRemediationPlan,
  };

export async function planResearchReconciliationObligationRecoveryOnServer(
  obligationId: string,
  dependencies: ResearchReconciliationObligationRecoveryPlanningDependencies =
    defaultDependencies,
): Promise<ResearchReconciliationObligationRecoveryPlanningResult | null> {
  const obligation =
    await dependencies.getResearchReconciliationObligation(obligationId);

  if (!obligation) {
    return null;
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
      false,
      undefined,
      false,
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
      getResearchInvestigations: () =>
        snapshot.getResearchInvestigations,
      getResearchExperiments: () =>
        snapshot.getResearchExperiments,
      getResearchEvidence: () =>
        snapshot.getResearchEvidence,
      getResearchFindings: () =>
        snapshot.getResearchFindings,
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
    status: "Planned",
    obligation,
    issue,
    request,
    plan,
    reason:
      "The current integrity issue remains unresolved and a fresh unconfirmed remediation plan has been prepared.",
  };
}
