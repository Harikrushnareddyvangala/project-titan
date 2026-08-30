import { describe, expect, it } from "vitest";

import type { ResearchLineageIntegrityIssue } from "@/types/research";

import {
  getResearchLineageIntegrityAssessment,
  getResearchLineageIntegrityAssessmentExplanation,
  getResearchLineageIntegrityCategory,
  getResearchLineageIntegrityIssueExplanation,
  getResearchLineageIntegrityPriority,
  getResearchLineageIntegrityPrioritySummary,
} from "../assessment";

describe("research lineage integrity assessment", () => {
  it("classifies known integrity issue categories", () => {
    expect(getResearchLineageIntegrityCategory("INVESTIGATION_NOT_FOUND"))
      .toBe("Investigation");
    expect(getResearchLineageIntegrityCategory("INVALID_NODE")).toBe("Node");
    expect(getResearchLineageIntegrityCategory("DUPLICATE_EDGE")).toBe("Edge");
    expect(getResearchLineageIntegrityCategory("CROSS_INVESTIGATION_EDGE"))
      .toBe("Scope");
    expect(
      getResearchLineageIntegrityCategory(
        "CONCLUSION_FINDING_REFERENCE_INVALID",
      ),
    ).toBe("Reference");
    expect(getResearchLineageIntegrityCategory("PROVENANCE_EVENT_INVALID"))
      .toBe("Provenance");
    expect(getResearchLineageIntegrityCategory("UNKNOWN")).toBe("Reference");
  });

  it("assigns expected priorities", () => {
    expect(getResearchLineageIntegrityPriority("INVESTIGATION_NOT_FOUND"))
      .toBe("Critical");
    expect(getResearchLineageIntegrityPriority("CROSS_INVESTIGATION_EDGE"))
      .toBe("Critical");
    expect(getResearchLineageIntegrityPriority("SOURCE_NODE_NOT_FOUND"))
      .toBe("High");
    expect(
      getResearchLineageIntegrityPriority(
        "CONCLUSION_FINDING_REFERENCE_INVALID",
      ),
    ).toBe("High");
    expect(getResearchLineageIntegrityPriority("INVALID_NODE")).toBe("Medium");
    expect(getResearchLineageIntegrityPriority("PROVENANCE_INVALID"))
      .toBe("Low");
    expect(getResearchLineageIntegrityPriority("UNKNOWN")).toBe("Medium");
  });

  it("builds a priority summary and highest priority", () => {
    const issues: ResearchLineageIntegrityIssue[] = [
      {
        investigationId: "investigation-001",
        code: "INVESTIGATION_NOT_FOUND",
        message: "missing investigation",
      },
      {
        investigationId: "investigation-001",
        code: "SOURCE_NODE_NOT_FOUND",
        message: "missing source",
      },
      {
        investigationId: "investigation-001",
        code: "INVALID_NODE",
        message: "invalid node",
      },
      {
        investigationId: "investigation-001",
        code: "PROVENANCE_INVALID",
        message: "invalid provenance",
      },
    ];

    expect(getResearchLineageIntegrityPrioritySummary(issues)).toEqual({
      critical: 1,
      high: 1,
      medium: 1,
      low: 1,
      highestPriority: "Critical",
    });
  });

  it("returns healthy when no medium-or-higher issues exist", () => {
    expect(
      getResearchLineageIntegrityAssessment({
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        highestPriority: null,
      }),
    ).toBe("Healthy");
  });

  it("returns attention for medium-priority issues", () => {
    expect(
      getResearchLineageIntegrityAssessment({
        critical: 0,
        high: 0,
        medium: 1,
        low: 0,
        highestPriority: "Medium",
      }),
    ).toBe("Attention");
  });

  it("returns degraded for high-priority issues", () => {
    expect(
      getResearchLineageIntegrityAssessment({
        critical: 0,
        high: 1,
        medium: 0,
        low: 0,
        highestPriority: "High",
      }),
    ).toBe("Degraded");
  });

  it("returns critical for critical issues", () => {
    expect(
      getResearchLineageIntegrityAssessment({
        critical: 1,
        high: 0,
        medium: 0,
        low: 0,
        highestPriority: "Critical",
      }),
    ).toBe("Critical");
  });

  it("explains each assessment level", () => {
    for (const assessment of [
      "Healthy",
      "Attention",
      "Degraded",
      "Critical",
    ] as const) {
      const summary = {
        critical: assessment === "Critical" ? 1 : 0,
        high: assessment === "Degraded" ? 1 : 0,
        medium: assessment === "Attention" ? 1 : 0,
        low: 0,
        highestPriority:
          assessment === "Critical"
            ? "Critical"
            : assessment === "Degraded"
              ? "High"
              : assessment === "Attention"
                ? "Medium"
                : null,
      } as const;

      expect(
        getResearchLineageIntegrityAssessmentExplanation(summary).assessment,
      ).toBe(assessment);
    }
  });

  it("provides specific explanations for known issue codes", () => {
    expect(
      getResearchLineageIntegrityIssueExplanation("INVALID_NODE").title,
    ).toBe("Lineage node is invalid");

    expect(
      getResearchLineageIntegrityIssueExplanation(
        "CONCLUSION_FINDING_REFERENCE_INVALID",
      ).title,
    ).toBe("Conclusion references an invalid finding");
  });

  it("provides a provenance explanation for provenance issues", () => {
    expect(
      getResearchLineageIntegrityIssueExplanation("PROVENANCE_INVALID"),
    ).toEqual({
      title: "Provenance integrity issue",
      description: "A provenance-related integrity problem was detected.",
      recommendation:
        "Inspect the associated provenance event and repair the underlying lineage or provenance record.",
    });
  });

  it("provides a generic explanation for unknown issue codes", () => {
    expect(
      getResearchLineageIntegrityIssueExplanation("UNKNOWN"),
    ).toEqual({
      title: "Research lineage integrity issue",
      description: "An integrity problem was detected in the research lineage.",
      recommendation:
        "Inspect the associated lineage records and resolve the underlying reference or relationship.",
    });
  });
});