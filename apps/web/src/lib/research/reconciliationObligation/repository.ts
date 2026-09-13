import type {
  ResearchReconciliationObligation,
  ResearchReconciliationObligationStatus,
} from "@/types/research";

export interface ResearchReconciliationObligationCreateInput {
  id: string;
  investigationId: string;
  issueCode: string;
  targetEntityType: string;
  targetEntityId: string;
  remediationAction: string;
  remediationExecutionId?: string;
  provenanceEventId?: string;
  status: ResearchReconciliationObligationStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ResearchReconciliationObligationStatusUpdateInput {
  expectedUpdatedAt: string;
  toStatus: ResearchReconciliationObligationStatus;
  updatedAt: string;
}

export interface ResearchReconciliationObligationRepositoryDependencies {
  getResearchReconciliationObligation(
    id: string,
  ): Promise<ResearchReconciliationObligation | null>;

  getResearchReconciliationObligations(): Promise<
    ResearchReconciliationObligation[]
  >;

  getResearchReconciliationObligationsByInvestigation(
    investigationId: string,
  ): Promise<ResearchReconciliationObligation[]>;

  getUnresolvedResearchReconciliationObligations(): Promise<
    ResearchReconciliationObligation[]
  >;

  getUnresolvedResearchReconciliationObligationsByInvestigation(
    investigationId: string,
  ): Promise<ResearchReconciliationObligation[]>;

  getResearchReconciliationObligationsByTarget(
    targetEntityType: string,
    targetEntityId: string,
  ): Promise<ResearchReconciliationObligation[]>;

  createResearchReconciliationObligation(
    input: ResearchReconciliationObligationCreateInput,
  ): Promise<ResearchReconciliationObligation>;

  ensureActiveResearchReconciliationObligation(
    input: ResearchReconciliationObligationCreateInput,
  ): Promise<ResearchReconciliationObligation>;

  updateResearchReconciliationObligationStatus(
    id: string,
    input: ResearchReconciliationObligationStatusUpdateInput,
  ): Promise<ResearchReconciliationObligation>;
}

export function getResearchReconciliationObligation(
  id: string,
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation | null> {
  return dependencies.getResearchReconciliationObligation(id);
}

export function getResearchReconciliationObligations(
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation[]> {
  return dependencies.getResearchReconciliationObligations();
}

export function getResearchReconciliationObligationsByInvestigation(
  investigationId: string,
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation[]> {
  return dependencies.getResearchReconciliationObligationsByInvestigation(
    investigationId,
  );
}

export function getUnresolvedResearchReconciliationObligations(
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation[]> {
  return dependencies.getUnresolvedResearchReconciliationObligations();
}

export function getUnresolvedResearchReconciliationObligationsByInvestigation(
  investigationId: string,
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation[]> {
  return dependencies.getUnresolvedResearchReconciliationObligationsByInvestigation(
    investigationId,
  );
}

export function getResearchReconciliationObligationsByTarget(
  targetEntityType: string,
  targetEntityId: string,
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation[]> {
  return dependencies.getResearchReconciliationObligationsByTarget(
    targetEntityType,
    targetEntityId,
  );
}

export function createResearchReconciliationObligation(
  input: ResearchReconciliationObligationCreateInput,
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation> {
  return dependencies.createResearchReconciliationObligation(input);
}

export function ensureActiveResearchReconciliationObligation(
  input: ResearchReconciliationObligationCreateInput,
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation> {
  return dependencies.ensureActiveResearchReconciliationObligation(input);
}

export function updateResearchReconciliationObligationStatus(
  id: string,
  input: ResearchReconciliationObligationStatusUpdateInput,
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
): Promise<ResearchReconciliationObligation> {
  return dependencies.updateResearchReconciliationObligationStatus(id, input);
}

export function createResearchReconciliationObligationRepository(
  dependencies: ResearchReconciliationObligationRepositoryDependencies,
) {
  return {
    getResearchReconciliationObligation: (id: string) =>
      getResearchReconciliationObligation(id, dependencies),

    getResearchReconciliationObligations: () =>
      getResearchReconciliationObligations(dependencies),

    getResearchReconciliationObligationsByInvestigation: (
      investigationId: string,
    ) =>
      getResearchReconciliationObligationsByInvestigation(
        investigationId,
        dependencies,
      ),

    getUnresolvedResearchReconciliationObligations: () =>
      getUnresolvedResearchReconciliationObligations(dependencies),

    getUnresolvedResearchReconciliationObligationsByInvestigation: (
      investigationId: string,
    ) =>
      getUnresolvedResearchReconciliationObligationsByInvestigation(
        investigationId,
        dependencies,
      ),

    getResearchReconciliationObligationsByTarget: (
      targetEntityType: string,
      targetEntityId: string,
    ) =>
      getResearchReconciliationObligationsByTarget(
        targetEntityType,
        targetEntityId,
        dependencies,
      ),

    createResearchReconciliationObligation: (
      input: ResearchReconciliationObligationCreateInput,
    ) => createResearchReconciliationObligation(input, dependencies),

    ensureActiveResearchReconciliationObligation: (
      input: ResearchReconciliationObligationCreateInput,
    ) => ensureActiveResearchReconciliationObligation(input, dependencies),

    updateResearchReconciliationObligationStatus: (
      id: string,
      input: ResearchReconciliationObligationStatusUpdateInput,
    ) => updateResearchReconciliationObligationStatus(id, input, dependencies),
  };
}
