import "server-only";

import type { ResearchReconciliationObligation } from "@/types/research";

import {
  activateResearchReconciliationObligation,
  getResearchReconciliationObligation,
} from "./serverRepository";

export interface ResearchReconciliationObligationActivationDependencies {
  getResearchReconciliationObligation(
    id: string,
  ): Promise<ResearchReconciliationObligation | null>;

  activateResearchReconciliationObligation(
    id: string,
    input: {
      expectedUpdatedAt: string;
      updatedAt: string;
    },
  ): Promise<ResearchReconciliationObligation>;

  now(): string;
}

const defaultDependencies: ResearchReconciliationObligationActivationDependencies =
  {
    getResearchReconciliationObligation,
    activateResearchReconciliationObligation,
    now: () => new Date().toISOString(),
  };

export interface ResearchReconciliationObligationActivationResult {
  obligation: ResearchReconciliationObligation;
  transitioned: boolean;
  reason?: string;
}

export async function activateResearchReconciliationObligationOnServer(
  obligationId: string,
  dependencies: ResearchReconciliationObligationActivationDependencies =
    defaultDependencies,
): Promise<ResearchReconciliationObligationActivationResult | null> {
  const obligation =
    await dependencies.getResearchReconciliationObligation(obligationId);

  if (!obligation) {
    return null;
  }

  if (obligation.status !== "Open") {
    return {
      obligation,
      transitioned: false,
      reason: `Reconciliation obligation cannot be activated from status: ${obligation.status}.`,
    };
  }

  const updatedAt = dependencies.now();

  const updatedObligation =
    await dependencies.activateResearchReconciliationObligation(
      obligation.id,
      {
        expectedUpdatedAt: obligation.updatedAt,
        updatedAt,
      },
    );

  return {
    obligation: updatedObligation,
    transitioned: true,
  };
}
