import type {
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityResult,
  ResearchReconciliationObligation,
} from "@/types/research";

export interface ResearchReconciliationObligationVerificationResult {
  obligationId: string;
  investigationId: string;
  verified: boolean;
  unresolved: boolean;
  matchingIssueCount: number;
  matchingIssues: ResearchLineageIntegrityIssue[];
}

export function verifyResearchReconciliationObligation(
  obligation: ResearchReconciliationObligation,
  integrityResult: ResearchLineageIntegrityResult,
): ResearchReconciliationObligationVerificationResult {
  if (integrityResult.investigationId !== obligation.investigationId) {
    return {
      obligationId: obligation.id,
      investigationId: obligation.investigationId,
      verified: false,
      unresolved: false,
      matchingIssueCount: 0,
      matchingIssues: [],
    };
  }

  const matchingIssues = integrityResult.issues.filter(
    (issue) =>
      issue.investigationId === obligation.investigationId &&
      issue.code === obligation.issueCode &&
      issue.targetId === obligation.targetEntityId,
  );

  const unresolved = matchingIssues.length > 0;

  return {
    obligationId: obligation.id,
    investigationId: obligation.investigationId,
    verified: !unresolved,
    unresolved,
    matchingIssueCount: matchingIssues.length,
    matchingIssues,
  };
}
