import { describe, expect, it, vi } from "vitest";

vi.mock("../serverRepository", () => ({
  getResearchReconciliationObligation: vi.fn(),
}));

vi.mock("../../serverResearchSnapshot", () => ({
  loadServerResearchSnapshot: vi.fn(),
  createServerLineageService: vi.fn(),
}));

import type {
  ResearchLineageIntegrityResult,
  ResearchReconciliationObligation,
} from "@/types/research";

import {
  resolveResearchReconciliationObligationOnServer,
  type ResearchReconciliationObligationResolutionDependencies,
} from "../resolution";

function createObligation(
  overrides: Partial<ResearchReconciliationObligation> = {},
): ResearchReconciliationObligation {
  return {
    id: "reconciliation-1",
    investigationId: "investigation-1",
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    targetEntityType: "Conclusion",
    targetEntityId: "conclusion-1",
    remediationAction: "RepairReference",
    status: "In Progress",
    reason: "Postcondition validation failed.",
    createdAt: "2026-09-11T00:00:00.000Z",
    updatedAt: "2026-09-11T01:00:00.000Z",
    ...overrides,
  };
}

function createIntegrityResult(
  overrides: Partial<ResearchLineageIntegrityResult> = {},
): ResearchLineageIntegrityResult {
  return {
    investigationId: "investigation-1",
    valid: true,
    checkedNodeCount: 3,
    checkedEdgeCount: 2,
    issueCount: 0,
    issues: [],
    ...overrides,
  };
}

function createDependencies(
  overrides: Partial<ResearchReconciliationObligationResolutionDependencies> = {},
) {
  const obligation = createObligation();
  const snapshot = {} as Awaited<
    ReturnType<
      ResearchReconciliationObligationResolutionDependencies["loadServerResearchSnapshot"]
    >
  >;

  const integrityResult = createIntegrityResult();

  const getResearchReconciliationObligation = vi.fn(async () => obligation);
  const loadServerResearchSnapshot = vi.fn(async () => snapshot);
  const validateResearchLineageForInvestigation = vi.fn(
    () => integrityResult,
  );

  const lineageService = {
    getResearchLineage: vi.fn(),
    validateResearchLineage: vi.fn(),
    validateResearchLineageForInvestigation,
  };

  const createServerLineageService = vi.fn(() => lineageService);

  const transitionResearchReconciliationObligationAfterVerification = vi.fn(
    async (
      _obligation: ResearchReconciliationObligation,
      _verification: ReturnType<
        typeof import("../verification").verifyResearchReconciliationObligation
      >,
    ) => ({
      obligation,
      transitioned: true,
    }),
  );

  const dependencies: ResearchReconciliationObligationResolutionDependencies = {
    getResearchReconciliationObligation,
    loadServerResearchSnapshot,
    createServerLineageService,
    transitionResearchReconciliationObligationAfterVerification,
    ...overrides,
  };

  return {
    dependencies,
    obligation,
    snapshot,
    integrityResult,
    getResearchReconciliationObligation,
    loadServerResearchSnapshot,
    createServerLineageService,
    validateResearchLineageForInvestigation,
    transitionResearchReconciliationObligationAfterVerification,
  };
}

describe("resolveResearchReconciliationObligationOnServer", () => {
  it("returns null and performs no resolution work when the obligation does not exist", async () => {
    const loadServerResearchSnapshot = vi.fn();
    const createServerLineageService = vi.fn();
    const transitionResearchReconciliationObligationAfterVerification = vi.fn();

    const dependencies: ResearchReconciliationObligationResolutionDependencies = {
      getResearchReconciliationObligation: vi.fn(async () => null),
      loadServerResearchSnapshot,
      createServerLineageService,
      transitionResearchReconciliationObligationAfterVerification,
    };

    const result = await resolveResearchReconciliationObligationOnServer(
      "missing-obligation",
      dependencies,
    );

    expect(result).toBeNull();
    expect(loadServerResearchSnapshot).not.toHaveBeenCalled();
    expect(createServerLineageService).not.toHaveBeenCalled();
    expect(
      transitionResearchReconciliationObligationAfterVerification,
    ).not.toHaveBeenCalled();
  });

  it("retrieves the persisted obligation by id before loading current research state", async () => {
    const {
      dependencies,
      getResearchReconciliationObligation,
      loadServerResearchSnapshot,
      createServerLineageService,
    } = createDependencies();

    await resolveResearchReconciliationObligationOnServer(
      "reconciliation-1",
      dependencies,
    );

    expect(getResearchReconciliationObligation).toHaveBeenCalledOnce();
    expect(getResearchReconciliationObligation).toHaveBeenCalledWith(
      "reconciliation-1",
    );
    expect(loadServerResearchSnapshot).toHaveBeenCalledOnce();
    expect(createServerLineageService).toHaveBeenCalledOnce();

    const repositoryOrder =
      getResearchReconciliationObligation.mock.invocationCallOrder[0];
    const snapshotOrder =
      loadServerResearchSnapshot.mock.invocationCallOrder[0];
    const lineageOrder =
      createServerLineageService.mock.invocationCallOrder[0];

    expect(repositoryOrder).toBeLessThan(snapshotOrder);
    expect(snapshotOrder).toBeLessThan(lineageOrder);
  });

  it("validates lineage for the persisted obligation's investigation", async () => {
    const obligation = createObligation({
      investigationId: "investigation-authoritative",
    });

    const {
      dependencies,
      validateResearchLineageForInvestigation,
    } = createDependencies({
      getResearchReconciliationObligation: vi.fn(async () => obligation),
    });

    await resolveResearchReconciliationObligationOnServer(
      obligation.id,
      dependencies,
    );

    expect(validateResearchLineageForInvestigation).toHaveBeenCalledOnce();
    expect(validateResearchLineageForInvestigation).toHaveBeenCalledWith(
      "investigation-authoritative",
    );
  });

  it("passes the verification result to the lifecycle boundary when the obligation remains unresolved", async () => {
    const obligation = createObligation();

    const integrityResult = createIntegrityResult({
      valid: false,
      issueCount: 1,
      issues: [
        {
          investigationId: obligation.investigationId,
          code: obligation.issueCode,
          message: "The invalid conclusion finding reference remains.",
          targetId: obligation.targetEntityId,
        },
      ],
    });

    const {
      dependencies,
      transitionResearchReconciliationObligationAfterVerification,
    } = createDependencies({
      getResearchReconciliationObligation: vi.fn(async () => obligation),
      createServerLineageService: vi.fn(() => ({
        getResearchLineage: vi.fn(),
        validateResearchLineage: vi.fn(),
        validateResearchLineageForInvestigation: vi.fn(
          () => integrityResult,
        ),
      })),
    });

    const result = await resolveResearchReconciliationObligationOnServer(
      obligation.id,
      dependencies,
    );

    expect(
      transitionResearchReconciliationObligationAfterVerification,
    ).toHaveBeenCalledOnce();

    const [receivedObligation, verification] =
      transitionResearchReconciliationObligationAfterVerification.mock
        .calls[0];

    expect(receivedObligation).toEqual(obligation);
    expect(verification).toEqual({
      obligationId: obligation.id,
      investigationId: obligation.investigationId,
      verified: false,
      unresolved: true,
      matchingIssueCount: 1,
      matchingIssues: integrityResult.issues,
    });
    expect(result?.transitioned).toBe(true);
  });

  it("passes verified truth to the lifecycle boundary when the specific issue is absent", async () => {
    const obligation = createObligation();

    const {
      dependencies,
      transitionResearchReconciliationObligationAfterVerification,
    } = createDependencies({
      getResearchReconciliationObligation: vi.fn(async () => obligation),
      createServerLineageService: vi.fn(() => ({
        getResearchLineage: vi.fn(),
        validateResearchLineage: vi.fn(),
        validateResearchLineageForInvestigation: vi.fn(() =>
          createIntegrityResult({
            valid: false,
            issueCount: 1,
            issues: [
              {
                investigationId: obligation.investigationId,
                code: "UNRELATED_ISSUE",
                message: "An unrelated integrity issue remains.",
                targetId: "different-target",
              },
            ],
          }),
        ),
      })),
    });

    const result = await resolveResearchReconciliationObligationOnServer(
      obligation.id,
      dependencies,
    );

    const [, verification] =
      transitionResearchReconciliationObligationAfterVerification.mock
        .calls[0];

    expect(verification).toEqual({
      obligationId: obligation.id,
      investigationId: obligation.investigationId,
      verified: true,
      unresolved: false,
      matchingIssueCount: 0,
      matchingIssues: [],
    });
    expect(result?.transitioned).toBe(true);
  });

  it("returns the lifecycle boundary result without replacing it", async () => {
    const obligation = createObligation();

    const lifecycleResult = {
      obligation: createObligation({
        status: "Resolved",
        resolvedAt: "2026-09-11T02:00:00.000Z",
      }),
      transitioned: true,
    };

    const transitionResearchReconciliationObligationAfterVerification =
      vi.fn(async () => lifecycleResult);

    const { dependencies } = createDependencies({
      getResearchReconciliationObligation: vi.fn(async () => obligation),
      transitionResearchReconciliationObligationAfterVerification,
    });

    const result = await resolveResearchReconciliationObligationOnServer(
      obligation.id,
      dependencies,
    );

    expect(result).toEqual(lifecycleResult);
    expect(
      transitionResearchReconciliationObligationAfterVerification,
    ).toHaveBeenCalledOnce();
  });
});
