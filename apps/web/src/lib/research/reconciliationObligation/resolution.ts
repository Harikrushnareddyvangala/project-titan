import "server-only";

import type { ResearchReconciliationObligation } from "@/types/research";

import {
  getResearchReconciliationObligation,
} from "./serverRepository";

import {
  loadServerResearchSnapshot,
  createServerLineageService,
  type ServerResearchSnapshot,
} from "../serverResearchSnapshot";

import { verifyResearchReconciliationObligation } from "./verification";

import {
  transitionResearchReconciliationObligationAfterVerification,
  type ResearchReconciliationObligationLifecycleResult,
} from "./lifecycle";

export interface ResearchReconciliationObligationResolutionDependencies {
  getResearchReconciliationObligation(
    id: string,
  ): Promise<ResearchReconciliationObligation | null>;

  loadServerResearchSnapshot(): Promise<ServerResearchSnapshot>;

  createServerLineageService(
    snapshot: ServerResearchSnapshot,
  ): ReturnType<typeof createServerLineageService>;

  transitionResearchReconciliationObligationAfterVerification(
    obligation: ResearchReconciliationObligation,
    verification: ReturnType<typeof verifyResearchReconciliationObligation>,
  ): Promise<ResearchReconciliationObligationLifecycleResult>;
}

const defaultDependencies: ResearchReconciliationObligationResolutionDependencies = {
  getResearchReconciliationObligation,
  loadServerResearchSnapshot,
  createServerLineageService,
  transitionResearchReconciliationObligationAfterVerification: (
    obligation,
    verification,
  ) =>
    transitionResearchReconciliationObligationAfterVerification(
      obligation,
      verification,
      {
        updateResearchReconciliationObligationStatus: async (id, input) => {
          const { resolveResearchReconciliationObligation } =
            await import("./serverRepository");

          return resolveResearchReconciliationObligation(id, {
            expectedUpdatedAt: input.expectedUpdatedAt,
            updatedAt: input.updatedAt,
          });
        },
        now: () => new Date().toISOString(),
      },
    ),
};

export async function resolveResearchReconciliationObligationOnServer(
  obligationId: string,
  dependencies: ResearchReconciliationObligationResolutionDependencies = defaultDependencies,
): Promise<ResearchReconciliationObligationLifecycleResult | null> {
  const obligation =
    await dependencies.getResearchReconciliationObligation(obligationId);

  if (!obligation) {
    return null;
  }

  const snapshot = await dependencies.loadServerResearchSnapshot();
  const lineageService = dependencies.createServerLineageService(snapshot);
  const integrityResult = lineageService.validateResearchLineageForInvestigation(
    obligation.investigationId,
  );

  const verification = verifyResearchReconciliationObligation(
    obligation,
    integrityResult,
  );

  return dependencies.transitionResearchReconciliationObligationAfterVerification(
    obligation,
    verification,
  );
}
