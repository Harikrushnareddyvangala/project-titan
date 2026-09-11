import { describe, expect, it } from "vitest";

import type {
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityResult,
  ResearchReconciliationObligation,
} from "@/types/research";

import { verifyResearchReconciliationObligation } from "../verification";

function createObligation(
  overrides: Partial<ResearchReconciliationObligation> = {},
): ResearchReconciliationObligation {
  return {
    id: "reconciliation-001",
    investigationId: "investigation-001",
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    targetEntityType: "Conclusion",
    targetEntityId: "conclusion-001",
    remediationAction: "RepairReference",
    status: "Open",
    reason: "Postcondition validation remained invalid.",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function createIntegrityResult(
  issues: ResearchLineageIntegrityIssue[],
): ResearchLineageIntegrityResult {
  return {
    investigationId: "investigation-001",
    valid: issues.length === 0,
    checkedNodeCount: 2,
    checkedEdgeCount: 1,
    issueCount: issues.length,
    issues,
  };
}

function createIssue(
  overrides: Partial<ResearchLineageIntegrityIssue> = {},
): ResearchLineageIntegrityIssue {
  return {
    investigationId: "investigation-001",
    code: "CONCLUSION_FINDING_REFERENCE_INVALID",
    message: "Conclusion references an invalid Finding node.",
    targetId: "conclusion-001",
    ...overrides,
  };
}

describe("research reconciliation obligation verification", () => {
  it("verifies an obligation when its matching integrity issue is no longer present", () => {
    const obligation = createObligation();
    const integrityResult = createIntegrityResult([]);

    const result = verifyResearchReconciliationObligation(
      obligation,
      integrityResult,
    );

    expect(result).toEqual({
      obligationId: "reconciliation-001",
      investigationId: "investigation-001",
      verified: true,
      unresolved: false,
      matchingIssueCount: 0,
      matchingIssues: [],
    });
  });

  it("keeps an obligation unresolved when its matching integrity issue remains", () => {
    const obligation = createObligation();
    const issue = createIssue();

    const result = verifyResearchReconciliationObligation(
      obligation,
      createIntegrityResult([issue]),
    );

    expect(result).toEqual({
      obligationId: "reconciliation-001",
      investigationId: "investigation-001",
      verified: false,
      unresolved: true,
      matchingIssueCount: 1,
      matchingIssues: [issue],
    });
  });

  it("does not treat an unrelated issue as evidence that the obligation remains unresolved", () => {
    const obligation = createObligation();

    const unrelatedIssue = createIssue({
      code: "INVALID_NODE",
      message: "An unrelated lineage node is invalid.",
      nodeId: "finding-002",
      targetId: undefined,
    });

    const result = verifyResearchReconciliationObligation(
      obligation,
      createIntegrityResult([unrelatedIssue]),
    );

    expect(result).toEqual({
      obligationId: "reconciliation-001",
      investigationId: "investigation-001",
      verified: true,
      unresolved: false,
      matchingIssueCount: 0,
      matchingIssues: [],
    });
  });

  it("does not match the same issue code from another investigation", () => {
    const obligation = createObligation();

    const issue = createIssue({
      investigationId: "investigation-002",
    });

    const result = verifyResearchReconciliationObligation(
      obligation,
      createIntegrityResult([issue]),
    );

    expect(result.verified).toBe(true);
    expect(result.unresolved).toBe(false);
    expect(result.matchingIssueCount).toBe(0);
  });

  it("does not match the same issue code against another target", () => {
    const obligation = createObligation();

    const issue = createIssue({
      targetId: "conclusion-002",
    });

    const result = verifyResearchReconciliationObligation(
      obligation,
      createIntegrityResult([issue]),
    );

    expect(result.verified).toBe(true);
    expect(result.unresolved).toBe(false);
    expect(result.matchingIssueCount).toBe(0);
  });

  it("does not verify an obligation against an integrity result from another investigation", () => {
    const obligation = createObligation();

    const result = verifyResearchReconciliationObligation(
      obligation,
      {
        ...createIntegrityResult([]),
        investigationId: "investigation-002",
      },
    );

    expect(result.verified).toBe(false);
    expect(result.unresolved).toBe(false);
    expect(result.matchingIssueCount).toBe(0);
    expect(result.matchingIssues).toEqual([]);
  });

  it("does not match another issue code against the same target", () => {
    const obligation = createObligation();

    const issue = createIssue({
      code: "INVALID_NODE",
    });

    const result = verifyResearchReconciliationObligation(
      obligation,
      createIntegrityResult([issue]),
    );

    expect(result.verified).toBe(true);
    expect(result.unresolved).toBe(false);
    expect(result.matchingIssueCount).toBe(0);
  });
});
