import { beforeEach, describe, expect, it } from "vitest";

import {
  createResearchLineageIntegrityRemediationMutationContract,
  createResearchLineageIntegrityRemediationPlan,
  createResearchLineageIntegrityRemediationRequest,
  decideResearchLineageIntegrityRemediationRepair,
  executeResearchLineageIntegrityRemediation,
  getResearchInvestigationConclusions,
  getResearchLineageIntegrityIssueAction,
  getResearchFindings,
  validateResearchLineage,
} from "@/lib/research";

describe("research lineage remediation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("detects an invalid conclusion finding reference", () => {
    const investigations = [
      {
        id: "investigation-test-001",
        title: "Lineage remediation test",
        objective: "Test lineage integrity",
        question: "Can an invalid conclusion reference be detected?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-001"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-001"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const findings = [
      {
        id: "finding-valid-001",
        statement: "Valid test finding",
        evidenceAssessments: [],
        confidence: 0.9,
        validationIds: [],
        investigationId: "investigation-test-001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-001",
        investigationId: "investigation-test-001",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-INTENTIONALLY-BROKEN-TEST"],
        contradictingFindingIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(
      "titan:research-investigations",
      JSON.stringify(investigations),
    );

    localStorage.setItem(
      "titan:research-findings",
      JSON.stringify(findings),
    );

    localStorage.setItem(
      "titan:research-investigation-conclusions",
      JSON.stringify(conclusions),
    );

    const result =
      validateResearchLineage("investigation-test-001");

    expect(result.valid).toBe(false);

    expect(
      result.issues.some(
        (issue) =>
          issue.code ===
          "CONCLUSION_FINDING_REFERENCE_INVALID",
      ),
    ).toBe(true);
  });

  it("rejects remediation when confirmation is missing", () => {
    const investigations = [
      {
        id: "investigation-test-002",
        title: "Confirmation test",
        objective: "Test confirmation boundary",
        question: "Does remediation require confirmation?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-002"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-002"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const findings = [
      {
        id: "finding-valid-002",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.9,
        validationIds: [],
        investigationId: "investigation-test-002",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-002",
        investigationId: "investigation-test-002",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-invalid-002"],
        contradictingFindingIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(
      "titan:research-investigations",
      JSON.stringify(investigations),
    );

    localStorage.setItem(
      "titan:research-findings",
      JSON.stringify(findings),
    );

    localStorage.setItem(
      "titan:research-investigation-conclusions",
      JSON.stringify(conclusions),
    );

    const validation =
      validateResearchLineage("investigation-test-002");

    const issue =
      validation.issues.find(
        (candidate) =>
          candidate.code ===
          "CONCLUSION_FINDING_REFERENCE_INVALID",
      );

    expect(issue).toBeDefined();

    if (!issue) {
      return;
    }

    const action =
      getResearchLineageIntegrityIssueAction(issue);

    expect(action.action).toBe("RepairReference");

    if (action.action !== "RepairReference") {
      throw new Error(
        `Expected RepairReference action, received ${action.action}`,
      );
    }

    const plan =
      createResearchLineageIntegrityRemediationPlan({
        investigationId: "investigation-test-002",
        action: action.action,
        issueCode: issue.code,
        target: action.target,
        replacementEntityId: "finding-valid-002",
        confirmed: false,
      });

    const result =
      executeResearchLineageIntegrityRemediation(plan);

    expect(result.executed).toBe(false);
    expect(result.status).toBe("Rejected");

    const conclusionsAfter =
      getResearchInvestigationConclusions();

    expect(
      conclusionsAfter[0].supportingFindingIds,
    ).toEqual(["finding-invalid-002"]);
  });

  it("executes deterministic reference remediation and records provenance", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-003",
        title: "Successful remediation test",
        objective: "Test deterministic reference repair",
        question: "Can a broken finding reference be repaired?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: [
          "finding-valid-003",
        ],
        artifactIds: [],
        conclusionIds: ["conclusion-test-003"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-003",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
        validationIds: [],
        investigationId: "investigation-test-003",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-003",
        investigationId: "investigation-test-003",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-invalid-003"],
        contradictingFindingIds: [],
        createdAt: now,
        updatedAt: now,
      },
    ];

    localStorage.setItem(
      "titan:research-investigations",
      JSON.stringify(investigations),
    );

    localStorage.setItem(
      "titan:research-findings",
      JSON.stringify(findings),
    );

    localStorage.setItem(
      "titan:research-investigation-conclusions",
      JSON.stringify(conclusions),
    );

    const initialValidation =
      validateResearchLineage(
        "investigation-test-003",
      );

    const issue =
      initialValidation.issues.find(
        (candidate) =>
          candidate.code ===
          "CONCLUSION_FINDING_REFERENCE_INVALID",
      );

    expect(issue).toBeDefined();

    if (!issue) {
      return;
    }

    const action =
      getResearchLineageIntegrityIssueAction(issue);

    expect(action.action).toBe("RepairReference");

    if (action.action !== "RepairReference") {
      throw new Error(
        `Expected RepairReference action, received ${action.action}`,
      );
    }

    const plan =
      createResearchLineageIntegrityRemediationPlan({
        investigationId:
          "investigation-test-003",
        action:
          action.action,
        issueCode:
          issue.code,
        target:
          action.target,
        replacementEntityId:
          "finding-valid-003",
        confirmed: true,
      });

    const decision =
      decideResearchLineageIntegrityRemediationRepair(
        plan,
      );

    expect(decision.decision).toBe(
      "Repairable",
    );

    expect(decision.action).toBe(
      "RepairReference",
    );

    expect(
      decision.replacementEntityId,
    ).toBe(
      "finding-valid-003",
    );

    expect(
      decision.resolvedTarget.resolvable,
    ).toBe(true);

    const mutationContract =
      createResearchLineageIntegrityRemediationMutationContract(
        decision,
      );

    expect(mutationContract).not.toBeNull();

    if (!mutationContract) {
      return;
    }

    expect(
      mutationContract.mutationType,
    ).toBe(
      "ReferenceReplacement",
    );

    expect(
      mutationContract.investigationId,
    ).toBe(
      "investigation-test-003",
    );

    expect(
      mutationContract.issueCode,
    ).toBe(
      "CONCLUSION_FINDING_REFERENCE_INVALID",
    );

    expect(
      mutationContract.replacementEntityId,
    ).toBe(
      "finding-valid-003",
    );

    expect(
      mutationContract.deterministic,
    ).toBe(true);

    expect(
      mutationContract.requiresConfirmation,
    ).toBe(true);

    expect(
      mutationContract.createsProvenanceEvent,
    ).toBe(true);

    const result =
      executeResearchLineageIntegrityRemediation(
        plan,
      );

    expect(result.executed).toBe(true);
    expect(result.status).toBe("Executed");

    const updatedConclusions =
      getResearchInvestigationConclusions();

    expect(
      updatedConclusions[0].supportingFindingIds,
    ).toEqual(["finding-valid-003"]);

    const finalValidation =
      validateResearchLineage(
        "investigation-test-003",
      );

    expect(finalValidation.issues).not.toContainEqual(
      expect.objectContaining({
        code:
          "CONCLUSION_FINDING_REFERENCE_INVALID",
      }),
    );

    const provenance =
      JSON.parse(
        localStorage.getItem(
          "titan:research-provenance-events",
        ) || "[]",
      );

    expect(
      provenance.some(
        (event: {
          entityType?: string;
          entityId?: string;
          eventType?: string;
          reason?: string;
        }) =>
          event.entityType === "Conclusion" &&
          event.entityId ===
            "conclusion-test-003" &&
          event.eventType === "Updated" &&
          event.reason?.includes(
            "finding-invalid-003",
          ) &&
          event.reason?.includes(
            "finding-valid-003",
          ),
      ),
    ).toBe(true);
  });

  it("does not auto-repair an invalid relationship", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-004",
        title: "Relationship safety test",
        objective: "Test invalid lineage relationship handling",
        question:
          "Can an invalid relationship be prevented from automatic repair?",
        status: "Draft",
        experimentIds: ["experiment-test-004"],
        evidenceIds: ["evidence-test-004"],
        findingIds: ["finding-test-004"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-004"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const experiments = [
      {
        id: "experiment-test-004",
        investigationId: "investigation-test-004",
        title: "Relationship experiment",
        hypothesis: "Test invalid relationship",
        status: "Completed",
        evidenceIds: ["evidence-test-004"],
        findingIds: [],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const evidence = [
      {
        id: "evidence-test-004",
        investigationId: "investigation-test-004",
        title: "Test evidence",
        description: "Evidence for relationship safety test",
        experimentId: "experiment-test-004",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-test-004",
        statement: "Test finding",
        evidenceAssessments: [],
        confidence: 0.9,
        validationIds: [],
        investigationId: "investigation-test-004",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-004",
        investigationId: "investigation-test-004",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: ["evidence-test-004"],
        contradictingFindingIds: [],
        createdAt: now,
        updatedAt: now,
      },
    ];

    localStorage.setItem(
      "titan:research-investigations",
      JSON.stringify(investigations),
    );

    localStorage.setItem(
      "titan:research-experiments",
      JSON.stringify(experiments),
    );

    localStorage.setItem(
      "titan:research-evidence",
      JSON.stringify(evidence),
    );

    localStorage.setItem(
      "titan:research-findings",
      JSON.stringify(findings),
    );

    localStorage.setItem(
      "titan:research-investigation-conclusions",
      JSON.stringify(conclusions),
    );

    const validation =
      validateResearchLineage("investigation-test-004");

    expect(validation.valid).toBe(false);

    const issue =
      validation.issues.find(
        (candidate) =>
          candidate.code ===
          "INVALID_EDGE_DIRECTION",
      );

    expect(issue).toBeDefined();

    if (!issue) {
      return;
    }

    const action =
      getResearchLineageIntegrityIssueAction(issue);

    expect(action.action).toBe("RepairRelationship");
    expect(action.requiresConfirmation).toBe(true);
    expect(action.readiness).toBe("Planned");
    expect(action.target.edgeId).toBe(issue.edgeId);
    expect(action.target.sourceId).toBe(issue.sourceId);
    expect(action.target.targetId).toBe(issue.targetId);

    const request =
      createResearchLineageIntegrityRemediationRequest(
        "investigation-test-004",
        issue,
        false,
      );

    expect(request).toBeNull();
  });

  it("rejects confirmed relationship remediation without a mutation contract", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-005",
        title: "Confirmed relationship safety test",
        objective: "Test confirmed relationship remediation execution",
        question:
          "Can confirmed relationship repair be rejected without a mutation contract?",
        status: "Draft",
        experimentIds: ["experiment-test-005"],
        evidenceIds: ["evidence-test-005"],
        findingIds: ["finding-test-005"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-005"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const experiments = [
      {
        id: "experiment-test-005",
        investigationId: "investigation-test-005",
        title: "Relationship execution experiment",
        hypothesis: "Test confirmed relationship remediation",
        status: "Completed",
        evidenceIds: ["evidence-test-005"],
        findingIds: [],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const evidence = [
      {
        id: "evidence-test-005",
        investigationId: "investigation-test-005",
        title: "Test evidence",
        description: "Evidence for relationship execution safety test",
        experimentId: "experiment-test-005",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-test-005",
        statement: "Test finding",
        evidenceAssessments: [],
        confidence: 0.9,
        validationIds: [],
        investigationId: "investigation-test-005",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-005",
        investigationId: "investigation-test-005",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: ["evidence-test-005"],
        contradictingFindingIds: [],
        createdAt: now,
        updatedAt: now,
      },
    ];

    localStorage.setItem(
      "titan:research-investigations",
      JSON.stringify(investigations),
    );

    localStorage.setItem(
      "titan:research-experiments",
      JSON.stringify(experiments),
    );

    localStorage.setItem(
      "titan:research-evidence",
      JSON.stringify(evidence),
    );

    localStorage.setItem(
      "titan:research-findings",
      JSON.stringify(findings),
    );

    localStorage.setItem(
      "titan:research-investigation-conclusions",
      JSON.stringify(conclusions),
    );

    const validation =
      validateResearchLineage("investigation-test-005");

    const issue =
      validation.issues.find(
        (candidate) =>
          candidate.code ===
          "INVALID_EDGE_DIRECTION",
      );

    expect(issue).toBeDefined();

    if (!issue) {
      return;
    }

    const action =
      getResearchLineageIntegrityIssueAction(issue);

    expect(action.action).toBe("RepairRelationship");

    const request =
      createResearchLineageIntegrityRemediationRequest(
        "investigation-test-005",
        issue,
        true,
      );

    expect(request).not.toBeNull();

    if (!request) {
      return;
    }

    const plan =
      createResearchLineageIntegrityRemediationPlan(
        request,
      );

    const decision =
      decideResearchLineageIntegrityRemediationRepair(
        plan,
      );

    expect(decision.action).toBe(
      "RepairRelationship",
    );

    expect(decision.decision).toBe(
      "NotRepairable",
    );

    const mutationContract =
      createResearchLineageIntegrityRemediationMutationContract(
        decision,
      );

expect(mutationContract).toBeNull();

    expect(
      decision.resolvedTarget.resolvable,
    ).toBe(true);

    expect(
      decision.repairDescription,
    ).toContain(
      "only permits deterministic reference repairs",
    );

    expect(
      decision.reason,
    ).toContain(
      "RepairRelationship",
    );

    const result =
      executeResearchLineageIntegrityRemediation(
        plan,
      );

    expect(result.executed).toBe(false);
    expect(result.status).toBe("Rejected");
    expect(result.message).toContain(
      "not deterministic",
    );
  });
});