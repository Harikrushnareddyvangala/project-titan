import type {
  ResearchReconciliationObligation,
  ResearchReconciliationObligationStatus,
} from "@/types/research";

import type { ResearchReconciliationObligationVerificationResult } from "./verification";

export interface ResearchReconciliationObligationLifecycleDependencies {
  updateResearchReconciliationObligationStatus(
    id: string,
    input: {
      expectedUpdatedAt: string;
      toStatus: ResearchReconciliationObligationStatus;
      updatedAt: string;
    },
  ): Promise<ResearchReconciliationObligation>;

  now(): string;
}

export interface ResearchReconciliationObligationLifecycleResult {
  obligation: ResearchReconciliationObligation;
  transitioned: boolean;
  reason?: string;
}

const TERMINAL_STATUSES: ResearchReconciliationObligationStatus[] = [
  "Resolved",
  "Abandoned",
  "Superseded",
];

export async function transitionResearchReconciliationObligationAfterVerification(
  obligation: ResearchReconciliationObligation,
  verification: ResearchReconciliationObligationVerificationResult,
  dependencies: ResearchReconciliationObligationLifecycleDependencies,
): Promise<ResearchReconciliationObligationLifecycleResult> {
  if (
    verification.obligationId !== obligation.id ||
    verification.investigationId !== obligation.investigationId
  ) {
    throw new Error(
      "Reconciliation obligation verification does not belong to the obligation.",
    );
  }

  if (!verification.verified) {
    return {
      obligation,
      transitioned: false,
      reason: "Reconciliation obligation remains unresolved.",
    };
  }

  if (TERMINAL_STATUSES.includes(obligation.status)) {
    return {
      obligation,
      transitioned: false,
      reason: `Reconciliation obligation is already terminal: ${obligation.status}.`,
    };
  }

  if (obligation.status === "Open") {
    return {
      obligation,
      transitioned: false,
      reason:
        "Reconciliation obligation cannot transition directly from Open to Resolved.",
    };
  }

  const updatedAt = dependencies.now();

  const updatedObligation =
    await dependencies.updateResearchReconciliationObligationStatus(
      obligation.id,
      {
        expectedUpdatedAt: obligation.updatedAt,
        toStatus: "Resolved",
        updatedAt,
      },
    );

  return {
    obligation: updatedObligation,
    transitioned: true,
  };
}
