import { describe, expect, it } from "vitest";

import type {
  ResearchEvidence,
  ResearchExperiment,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchLineage,
  ResearchLineageIntegrityIssue,
} from "@/types/research";

import {
  createResearchLineageIntegrityRemediationPlan,
  createResearchLineageIntegrityRemediationRequest,
  getResearchLineageIntegrityIssueAction,
  getResearchLineageIntegrityRemediationExecutionPolicy,
  getResearchLineageRemediationReplacement,
  resolveResearchLineageIntegrityRemediationTarget,
  validateResearchLineageIntegrityRemediationTarget,
} from "../planning";

const investigation: ResearchInvestigation = {
  id: "investigation-001",
  title: "Test investigation",
  objective: "Validate the research finding.",
  question: "Is the finding supported by the available evidence?",
  description: "Test investigation",
  status: "Investigating",
  findingIds: ["finding-001", "finding-002"],
  experimentIds: [],
  evidenceIds: [],
  artifactIds: [],
  conclusionIds: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const finding: ResearchFinding = {
  id: "finding-001",
  statement: "Primary finding",
  confidence: 0.9,
  evidenceAssessments: [],
  validationIds: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const replacementFinding: ResearchFinding = {
  ...finding,
  id: "finding-002",
  statement: "Replacement finding",
};

const lineage: ResearchLineage = {
  investigationId: investigation.id,
  nodes: [
    {
      id: investigation.id,
      type: "Investigation",
      title: investigation.title,
      investigationId: investigation.id,
      provenanceEventCount: 0,
      valid: true,
      issueCount: 0,
      missingLinks: [],

    },
    {
      id: finding.id,
      type: "Finding",
      title: finding.statement,
      investigationId: investigation.id,
      provenanceEventCount: 0,
      valid: true,
      issueCount: 0,
      missingLinks: [],
    },
  ],
  edges: [],
  valid: true,
  issueCount: 0,
};

const dependencies = {
  getResearchLineage: () => lineage,

  getResearchInvestigations: (): ResearchInvestigation[] => [
    investigation,
  ],

  getResearchExperiments: (): ResearchExperiment[] => [],

  getResearchEvidence: (): ResearchEvidence[] => [],

  getResearchFindings: (): ResearchFinding[] => [
    finding,
    replacementFinding,
  ],

  getResearchFindingValidations: (): ResearchFindingValidation[] => [],

  getResearchInvestigationConclusions:
    (): ResearchInvestigationConclusion[] => [],
};

function createIssue(
  overrides: Partial<ResearchLineageIntegrityIssue> = {},
): ResearchLineageIntegrityIssue {
  return {
    code: "CONCLUSION_FINDING_REFERENCE_INVALID",
    message: "Conclusion references an invalid finding.",
    investigationId: investigation.id,
    nodeId: finding.id,
    ...overrides,
  };
}

describe("research lineage remediation planning", () => {
  it("maps a known integrity issue to a deterministic action", () => {
    const action = getResearchLineageIntegrityIssueAction(
      createIssue(),
    );

    expect(action.action).toBe("RepairReference");
    expect(action.requiresConfirmation).toBe(true);
    expect(action.readiness).toBe("Planned");
    expect(action.target.nodeId).toBe(finding.id);
  });

  it("creates a remediation request with the supplied issue context", () => {
    const issue = createIssue();

    const request = createResearchLineageIntegrityRemediationRequest(
      investigation.id,
      issue,
      true,
      replacementFinding.id,
    );

    expect(request).not.toBeNull();
    expect(request?.investigationId).toBe(investigation.id);
    expect(request?.issueCode).toBe(
      "CONCLUSION_FINDING_REFERENCE_INVALID",
    );
    expect(request?.action).toBe("RepairReference");
    expect(request?.confirmed).toBe(true);
    expect(request?.replacementEntityId).toBe(replacementFinding.id);
  });

  it("resolves an explicit replacement only inside the investigation", () => {
    const replacement = getResearchLineageRemediationReplacement(
      investigation.id,
      replacementFinding.id,
      dependencies,
    );

    expect(replacement?.id).toBe(replacementFinding.id);
  });

  it("rejects a replacement outside the investigation scope", () => {
    const replacement = getResearchLineageRemediationReplacement(
      investigation.id,
      "finding-outside",
      dependencies,
    );

    expect(replacement).toBeUndefined();
  });

  it("returns the deterministic remediation execution policy", () => {
    const policy =
      getResearchLineageIntegrityRemediationExecutionPolicy(
        "RepairReference",
      );

    expect(policy.action).toBe("RepairReference");
    expect(policy.requiresConfirmation).toBe(true);
    expect(policy.mutatesResearchData).toBe(true);
    expect(policy.createsProvenanceEvent).toBe(true);
    expect(policy.requiresTargetValidation).toBe(true);
  });

  it("resolves a finding remediation target", () => {
    const result = resolveResearchLineageIntegrityRemediationTarget(
      investigation.id,
      {
        nodeId: finding.id,
      },
      "RepairReference",
      dependencies,
    );

    expect(result.resolvable).toBe(true);
    expect(result.kind).toBe("Finding");
    expect(result.entityId).toBe(finding.id);
    expect(result.investigationId).toBe(investigation.id);
  });

  it("rejects an unsupported remediation target", () => {
    const result = resolveResearchLineageIntegrityRemediationTarget(
      investigation.id,
      {
        edgeId: "missing-edge",
      },
      "RepairRelationship",
      dependencies,
    );

    expect(result.resolvable).toBe(false);
  });

  it("validates a repairable remediation target", () => {
    const result =
      validateResearchLineageIntegrityRemediationTarget(
        investigation.id,
        {
          nodeId: finding.id,
        },
        "RepairReference",
        dependencies,
      );

    expect(result.valid).toBe(true);
    expect(result.investigationId).toBe(investigation.id);
    expect(result.target.nodeId).toBe(finding.id);
  });

  it("creates a deterministic remediation plan", () => {
    const issue = createIssue();

    const request =
      createResearchLineageIntegrityRemediationRequest(
        investigation.id,
        issue,
        true,
        replacementFinding.id,
      );

    expect(request).not.toBeNull();

    const plan = createResearchLineageIntegrityRemediationPlan(
      request!,
      dependencies,
    );

    expect(plan.investigationId).toBe(investigation.id);
    expect(plan.issueCode).toBe(
      "CONCLUSION_FINDING_REFERENCE_INVALID",
    );
    expect(plan.action).toBe("RepairReference");
    expect(plan.confirmed).toBe(true);
    expect(plan.status).toBe("Validated");
    expect(plan.replacementEntityId).toBe(replacementFinding.id);
    expect(plan.description).toContain("RepairReference");
  });
});
