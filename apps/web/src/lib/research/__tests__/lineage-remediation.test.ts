import { beforeEach, describe, expect, it } from "vitest";

import {
  createResearchLineageIntegrityRemediationPlan,
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

});
