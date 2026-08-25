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
  getResearchProvenanceEvents,
  validateResearchProvenanceIntegrity,
  getResearchProvenanceEventsByEntity,
  getResearchProvenanceEventsByInvestigation,
  getResearchProvenanceTimelineByInvestigation,
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

    const conclusionProvenance =
      getResearchProvenanceEventsByEntity(
        "Conclusion",
        "conclusion-test-003",
      );

    expect(
      conclusionProvenance.some(
        (event) =>
          event.eventType === "Updated" &&
          event.reason?.includes(
            "finding-invalid-003",
          ) &&
          event.reason?.includes(
            "finding-valid-003",
          ),
      ),
    ).toBe(true);

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

  it("rejects reference execution when the invalid source is absent from the target", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-006",
        title: "Mutation execution guard test",
        objective: "Test stale reference execution protection",
        question:
          "Can execution reject a mutation when the source reference is absent?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-006"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-006"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-006",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
        validationIds: [],
        investigationId: "investigation-test-006",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-006",
        investigationId: "investigation-test-006",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: [],
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

    const validation =
      validateResearchLineage(
        "investigation-test-006",
      );

    expect(validation.valid).toBe(true);

    const plan =
      createResearchLineageIntegrityRemediationPlan({
        investigationId:
          "investigation-test-006",
        action: "RepairReference",
        issueCode:
          "CONCLUSION_FINDING_REFERENCE_INVALID",
        target: {
          targetId:
            "conclusion-test-006",
          sourceId:
            "finding-invalid-006",
        },
        replacementEntityId:
          "finding-valid-006",
        confirmed: true,
      });

    const conclusionsBefore =
      getResearchInvestigationConclusions();

    expect(
      conclusionsBefore.find(
        (conclusion) =>
          conclusion.id === "conclusion-test-006",
      )?.supportingFindingIds,
    ).toEqual([]);

    expect(
      conclusionsBefore.find(
        (conclusion) =>
          conclusion.id === "conclusion-test-006",
      )?.contradictingFindingIds,
    ).toEqual([]);

    const result =
      executeResearchLineageIntegrityRemediation(
        plan,
      );

    expect(result.executed).toBe(false);
    expect(result.status).toBe("Rejected");
    expect(result.message).toContain(
      "not present on the target conclusion",
    );

    const conclusionsAfter =
      getResearchInvestigationConclusions();

    expect(
      conclusionsAfter[0].supportingFindingIds,
    ).toEqual([]);

    expect(
      conclusionsAfter[0].contradictingFindingIds,
    ).toEqual([]);
  });

  it("preserves contradicting relationship polarity during reference remediation", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-007",
        title: "Relationship polarity test",
        objective: "Test contradicting reference remediation",
        question:
          "Does remediation preserve the original relationship polarity?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-007"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-007"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-007",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
        validationIds: [],
        investigationId: "investigation-test-007",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-007",
        investigationId: "investigation-test-007",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: [],
        contradictingFindingIds: ["finding-invalid-007"],
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

    const plan =
      createResearchLineageIntegrityRemediationPlan({
        investigationId:
          "investigation-test-007",
        action: "RepairReference",
        issueCode:
          "CONCLUSION_FINDING_REFERENCE_INVALID",
        target: {
          targetId:
            "conclusion-test-007",
          sourceId:
            "finding-invalid-007",
        },
        replacementEntityId:
          "finding-valid-007",
        confirmed: true,
      });

    const result =
      executeResearchLineageIntegrityRemediation(
        plan,
      );

    expect(result.executed).toBe(true);
    expect(result.status).toBe("Executed");

    const conclusionsAfter =
      getResearchInvestigationConclusions();

    const updatedConclusion =
      conclusionsAfter.find(
        (conclusion) =>
          conclusion.id ===
          "conclusion-test-007",
      );

    expect(updatedConclusion).toBeDefined();

    if (!updatedConclusion) {
      return;
    }

    expect(
      updatedConclusion.supportingFindingIds,
    ).toEqual([]);

    expect(
      updatedConclusion.contradictingFindingIds,
    ).toEqual([
      "finding-valid-007",
    ]);

    expect(
      updatedConclusion.contradictingFindingIds,
    ).not.toContain(
      "finding-invalid-007",
    );

    expect(
      updatedConclusion.supportingFindingIds,
    ).not.toContain(
      "finding-valid-007",
    );

    const validation =
      validateResearchLineage(
        "investigation-test-007",
      );

    expect(validation.valid).toBe(true);
  });

  it("creates a deterministic mutation contract for a repairable reference", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-005",
        title: "Mutation contract test",
        objective: "Test deterministic mutation contract creation",
        question: "Can a repairable reference produce a deterministic contract?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-005"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-005"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-005",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
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
        supportingFindingIds: ["finding-invalid-005"],
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

    const validation =
      validateResearchLineage(
        "investigation-test-005",
      );

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
        investigationId:
          "investigation-test-005",
        action: action.action,
        issueCode: issue.code,
        target: action.target,
        replacementEntityId:
          "finding-valid-005",
        confirmed: true,
      });

    const decision =
      decideResearchLineageIntegrityRemediationRepair(
        plan,
      );

    expect(decision.decision).toBe(
      "Repairable",
    );

    expect(
      decision.replacementEntityId,
    ).toBe("finding-valid-005");

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
    ).toBe("ReferenceReplacement");

    expect(
      mutationContract.investigationId,
    ).toBe("investigation-test-005");

    expect(
      mutationContract.action,
    ).toBe("RepairReference");

    expect(
      mutationContract.issueCode,
    ).toBe(
      "CONCLUSION_FINDING_REFERENCE_INVALID",
    );

    expect(
      mutationContract.target.entityId,
    ).toBe("conclusion-test-005");

    expect(
      mutationContract.target.sourceId,
    ).toBe("finding-invalid-005");

    expect(
      mutationContract.target.targetId,
    ).toBe("conclusion-test-005");

    expect(
      mutationContract.replacementEntityId,
    ).toBe("finding-valid-005");

    expect(
      mutationContract.deterministic,
    ).toBe(true);

    expect(
      mutationContract.requiresConfirmation,
    ).toBe(true);

    expect(
      mutationContract.createsProvenanceEvent,
    ).toBe(true);
  });

  it("returns the exact provenance event created by successful reference remediation", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-008",
        title: "Provenance execution result test",
        objective: "Test provenance result binding",
        question:
          "Does successful remediation return its exact provenance event?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-008"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-008"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-008",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
        validationIds: [],
        investigationId: "investigation-test-008",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-008",
        investigationId: "investigation-test-008",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-invalid-008"],
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

    const plan =
      createResearchLineageIntegrityRemediationPlan({
        investigationId:
          "investigation-test-008",
        action: "RepairReference",
        issueCode:
          "CONCLUSION_FINDING_REFERENCE_INVALID",
        target: {
          targetId:
            "conclusion-test-008",
          sourceId:
            "finding-invalid-008",
        },
        replacementEntityId:
          "finding-valid-008",
        confirmed: true,
      });

    const result =
      executeResearchLineageIntegrityRemediation(
        plan,
      );

    expect(result.executed).toBe(true);
    expect(result.status).toBe("Executed");

    const provenanceEvents =
      getResearchProvenanceEventsByEntity(
        "Conclusion",
        "conclusion-test-008",
      );

    const provenanceEvent =
      provenanceEvents.find(
        (event) =>
          event.eventType === "Updated" &&
          event.reason?.includes(
            "finding-invalid-008",
          ) &&
          event.reason?.includes(
            "finding-valid-008",
          ),
      );

    expect(provenanceEvent).toBeDefined();

    if (!provenanceEvent) {
      return;
    }

    expect(provenanceEvent.entityType).toBe(
      "Conclusion",
    );

    expect(provenanceEvent.entityId).toBe(
      "conclusion-test-008",
    );

    expect(provenanceEvent.eventType).toBe(
      "Updated",
    );

    expect(provenanceEvent.investigationId).toBe(
      "investigation-test-008",
    );

    expect(provenanceEvent.reason).toContain(
      "finding-invalid-008",
    );

    expect(provenanceEvent.reason).toContain(
      "finding-valid-008",
    );

    expect(provenanceEvent.entityType).toBe(
      "Conclusion",
    );

    expect(provenanceEvent.entityId).toBe(
      "conclusion-test-008",
    );

    expect(provenanceEvent.eventType).toBe(
      "Updated",
    );

    expect(provenanceEvent.investigationId).toBe(
      "investigation-test-008",
    );

    expect(provenanceEvent.reason).toContain(
      "finding-invalid-008",
    );

    expect(provenanceEvent.reason).toContain(
      "finding-valid-008",
    );
  });

  it("preserves unrelated finding polarity during reference remediation", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-011",
        title: "Mixed polarity remediation test",
        objective: "Test selective reference replacement",
        question:
          "Does reference remediation preserve unrelated finding polarity?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: [
          "finding-valid-011",
          "finding-contradicting-011",
        ],
        artifactIds: [],
        conclusionIds: ["conclusion-test-011"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-011",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
        validationIds: [],
        investigationId: "investigation-test-011",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "finding-contradicting-011",
        statement: "Independent contradicting finding",
        evidenceAssessments: [],
        confidence: 0.85,
        validationIds: [],
        investigationId: "investigation-test-011",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-011",
        investigationId: "investigation-test-011",
        statement: "Mixed polarity conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-invalid-011"],
        contradictingFindingIds: ["finding-contradicting-011"],
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

    const plan =
      createResearchLineageIntegrityRemediationPlan({
        investigationId: "investigation-test-011",
        action: "RepairReference",
        issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
        target: {
          targetId: "conclusion-test-011",
          sourceId: "finding-invalid-011",
        },
        replacementEntityId: "finding-valid-011",
        confirmed: true,
      });

    const result =
      executeResearchLineageIntegrityRemediation(plan);

    expect(result.executed).toBe(true);
    expect(result.status).toBe("Executed");

    const updatedConclusion =
      getResearchInvestigationConclusions().find(
        (conclusion) =>
          conclusion.id === "conclusion-test-011",
      );

    expect(updatedConclusion?.supportingFindingIds).toEqual([
      "finding-valid-011",
    ]);

    expect(updatedConclusion?.contradictingFindingIds).toEqual([
      "finding-contradicting-011",
    ]);

    const validation =
      validateResearchLineage(
        "investigation-test-011",
      );

    expect(validation.valid).toBe(true);
  });

  it("reports successful remediation only when the repaired lineage validates", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-009",
        title: "Post-mutation validation test",
        objective: "Test execution validation boundary",
        question:
          "Does successful reference remediation leave the lineage valid?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-009"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-009"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-009",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
        validationIds: [],
        investigationId: "investigation-test-009",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-009",
        investigationId: "investigation-test-009",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-invalid-009"],
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
        "investigation-test-009",
      );

    expect(initialValidation.valid).toBe(false);

    const plan =
      createResearchLineageIntegrityRemediationPlan({
        investigationId:
          "investigation-test-009",
        action: "RepairReference",
        issueCode:
          "CONCLUSION_FINDING_REFERENCE_INVALID",
        target: {
          targetId:
            "conclusion-test-009",
          sourceId:
            "finding-invalid-009",
        },
        replacementEntityId:
          "finding-valid-009",
        confirmed: true,
      });

    const result =
      executeResearchLineageIntegrityRemediation(
        plan,
      );

    expect(result.executed).toBe(true);
    expect(result.status).toBe("Executed");

    const finalValidation =
      validateResearchLineage(
        "investigation-test-009",
      );

    expect(finalValidation.valid).toBe(true);

    expect(
      finalValidation.issues.some(
        (issue) =>
          issue.code ===
          "CONCLUSION_FINDING_REFERENCE_INVALID",
      ),
    ).toBe(false);

    const updatedConclusion =
      getResearchInvestigationConclusions().find(
        (conclusion) =>
          conclusion.id ===
          "conclusion-test-009",
      );

    expect(
      updatedConclusion?.supportingFindingIds,
    ).toEqual(["finding-valid-009"]);
  });

  it("returns a provenance event that passes provenance integrity validation", () => {
  const now = new Date().toISOString();

  const investigations = [
    {
      id: "investigation-test-010",
      title: "Provenance integrity remediation test",
      objective: "Test remediation provenance integrity",
      question:
        "Does successful remediation create provenance that remains internally valid?",
      status: "Draft",
      experimentIds: [],
      evidenceIds: [],
      findingIds: ["finding-valid-010"],
      artifactIds: [],
      conclusionIds: ["conclusion-test-010"],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const findings = [
    {
      id: "finding-valid-010",
      statement: "Valid replacement finding",
      evidenceAssessments: [],
      confidence: 0.95,
      validationIds: [],
      investigationId: "investigation-test-010",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const conclusions = [
    {
      id: "conclusion-test-010",
      investigationId: "investigation-test-010",
      statement: "Test conclusion",
      status: "Accepted",
      supportingFindingIds: ["finding-invalid-010"],
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

  const plan =
    createResearchLineageIntegrityRemediationPlan({
      investigationId:
        "investigation-test-010",
      action: "RepairReference",
      issueCode:
        "CONCLUSION_FINDING_REFERENCE_INVALID",
      target: {
        targetId:
          "conclusion-test-010",
        sourceId:
          "finding-invalid-010",
      },
      replacementEntityId:
        "finding-valid-010",
      confirmed: true,
    });

  const result =
    executeResearchLineageIntegrityRemediation(
      plan,
    );

  expect(result.executed).toBe(true);
  expect(result.status).toBe("Executed");
  expect(result.provenanceEventId).toBeDefined();

  if (!result.provenanceEventId) {
    return;
  }

  const provenanceEvents =
    getResearchProvenanceEvents();

  const provenanceEvent =
    provenanceEvents.find(
      (event) =>
        event.id ===
        result.provenanceEventId,
    );

  expect(provenanceEvent).toBeDefined();

  if (!provenanceEvent) {
    return;
  }

  expect(provenanceEvent.investigationId).toBe(
    "investigation-test-010",
  );

  expect(provenanceEvent.entityType).toBe(
    "Conclusion",
  );

  expect(provenanceEvent.entityId).toBe(
    "conclusion-test-010",
  );

  expect(provenanceEvent.eventType).toBe(
    "Updated",
  );

  expect(provenanceEvent.reason).toContain(
    "finding-invalid-010",
  );

  expect(provenanceEvent.reason).toContain(
    "finding-valid-010",
  );

  const provenanceValidation =
    validateResearchProvenanceIntegrity();

  expect(provenanceValidation.valid).toBe(true);

  expect(
    provenanceValidation.issues.filter(
      (issue) =>
        issue.eventId ===
        result.provenanceEventId,
    ),
  ).toEqual([]);
});

  it("makes successful remediation provenance discoverable through the investigation timeline", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-010",
        title: "Remediation timeline discoverability test",
        objective: "Test remediation provenance discoverability",
        question:
          "Is successful remediation provenance visible in the investigation timeline?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-010"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-010"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-010",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
        validationIds: [],
        investigationId: "investigation-test-010",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-010",
        investigationId: "investigation-test-010",
        statement: "Timeline discoverability conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-invalid-010"],
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

    const plan = createResearchLineageIntegrityRemediationPlan({
      investigationId: "investigation-test-010",
      action: "RepairReference",
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      target: {
        targetId: "conclusion-test-010",
        sourceId: "finding-invalid-010",
      },
      replacementEntityId: "finding-valid-010",
      confirmed: true,
    });

    const result =
      executeResearchLineageIntegrityRemediation(plan);

    expect(result.executed).toBe(true);
    expect(result.status).toBe("Executed");
    expect(result.provenanceEventId).toBeDefined();

    if (!result.provenanceEventId) {
      return;
    }

    const investigationEvents =
      getResearchProvenanceEventsByInvestigation(
        "investigation-test-010",
      );

    const event = investigationEvents.find(
      (candidate) =>
        candidate.id === result.provenanceEventId,
    );

    expect(event).toBeDefined();

    const timeline =
      getResearchProvenanceTimelineByInvestigation(
        "investigation-test-010",
      );

    expect(
      timeline.some(
        (item) =>
          item.eventId === result.provenanceEventId,
      ),
    ).toBe(true);
  });

    it("returns a validated postcondition after successful remediation", () => {
    const now = new Date().toISOString();

    const investigations = [
      {
        id: "investigation-test-012",
        title: "Remediation postcondition test",
        objective: "Test remediation postcondition reporting",
        question:
          "Does successful remediation return a validated lineage postcondition?",
        status: "Draft",
        experimentIds: [],
        evidenceIds: [],
        findingIds: ["finding-valid-012"],
        artifactIds: [],
        conclusionIds: ["conclusion-test-012"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const findings = [
      {
        id: "finding-valid-012",
        statement: "Valid replacement finding",
        evidenceAssessments: [],
        confidence: 0.95,
        validationIds: [],
        investigationId: "investigation-test-012",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const conclusions = [
      {
        id: "conclusion-test-012",
        investigationId: "investigation-test-012",
        statement: "Test conclusion",
        status: "Accepted",
        supportingFindingIds: ["finding-invalid-012"],
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
        "investigation-test-012",
      );

    expect(initialValidation.valid).toBe(false);

    const plan =
      createResearchLineageIntegrityRemediationPlan({
        investigationId:
          "investigation-test-012",
        action: "RepairReference",
        issueCode:
          "CONCLUSION_FINDING_REFERENCE_INVALID",
        target: {
          targetId:
            "conclusion-test-012",
          sourceId:
            "finding-invalid-012",
        },
        replacementEntityId:
          "finding-valid-012",
        confirmed: true,
      });

    const result =
      executeResearchLineageIntegrityRemediation(
        plan,
      );

    expect(result.executed).toBe(true);
    expect(result.status).toBe("Executed");

    expect(result.postcondition).toBeDefined();

    expect(result.postcondition).toEqual(
      expect.objectContaining({
        validated: true,
        valid: true,
        issueCount: 0,
      }),
    );

    expect(
      result.postcondition?.checkedNodeCount,
    ).toBeGreaterThan(0);

    expect(
      result.postcondition?.checkedEdgeCount,
    ).toBeGreaterThan(0);

    expect(
      result.postcondition?.issues,
    ).toEqual([]);
  });
});
