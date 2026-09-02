import { describe, expect, it } from "vitest";

import type {
  ResearchEvidenceAssessment,
} from "@/types/research";

import {
  evaluateFindingValidationEligibility,
  summarizeEvidenceAssessments,
} from "../assessmentAnalysis";

describe("research evidence assessment analysis", () => {
  const supporting: ResearchEvidenceAssessment = {
    id: "assessment-supporting",
    evidenceId: "evidence-001",
    type: "Supporting",
    relevance: 0.9,
    supportStrength: 0.8,
    reliability: 0.95,
    independence: 0.85,
    rationale: "Direct support.",
    assessedAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
  };

  const contradicting: ResearchEvidenceAssessment = {
    id: "assessment-contradicting",
    evidenceId: "evidence-002",
    type: "Contradicting",
    relevance: 0.7,
    supportStrength: 0.6,
    reliability: 0.8,
    independence: 0.75,
    rationale: "Contradicting evidence.",
    assessedAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
  };

  const neutral: ResearchEvidenceAssessment = {
    id: "assessment-neutral",
    evidenceId: "evidence-003",
    type: "Neutral",
    relevance: 0.5,
    supportStrength: 0.5,
    reliability: 0.6,
    independence: 0.7,
    rationale: "Neutral evidence.",
    assessedAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
  };

  describe("summarizeEvidenceAssessments", () => {
    it("returns zero summary for no assessments", () => {
      expect(
        summarizeEvidenceAssessments([]),
      ).toEqual({
        supportingEvidence: 0,
        contradictingEvidence: 0,
        neutralEvidence: 0,
        averageRelevance: 0,
        averageReliability: 0,
        averageIndependence: 0,
        supportScore: 0,
        contradictionScore: 0,
        derivedConfidence: 0,
      });
    });

    it("classifies assessments and calculates averages", () => {
      const result =
        summarizeEvidenceAssessments([
          supporting,
          contradicting,
          neutral,
        ]);

      expect(result.supportingEvidence).toBe(1);
      expect(result.contradictingEvidence).toBe(1);
      expect(result.neutralEvidence).toBe(1);

      expect(result.averageRelevance).toBeCloseTo(
        (0.9 + 0.7 + 0.5) / 3,
      );

      expect(result.averageReliability).toBeCloseTo(
        (0.95 + 0.8 + 0.6) / 3,
      );

      expect(result.averageIndependence).toBeCloseTo(
        (0.85 + 0.75 + 0.7) / 3,
      );
    });

    it("calculates support and contradiction scores", () => {
      const result =
        summarizeEvidenceAssessments([
          supporting,
          contradicting,
        ]);

      expect(result.supportScore).toBeCloseTo(
        0.8 * 0.9 * 0.95 * 0.85,
      );

      expect(result.contradictionScore).toBeCloseTo(
        0.6 * 0.7 * 0.8 * 0.75,
      );
    });

    it("derives confidence from evidence balance and quality", () => {
      const result =
        summarizeEvidenceAssessments([
          supporting,
        ]);

      expect(result.derivedConfidence).toBeCloseTo(
        0.9 * 0.95,
      );
    });

    it("does not let neutral evidence contribute to support or contradiction", () => {
      const result =
        summarizeEvidenceAssessments([
          neutral,
        ]);

      expect(result.supportScore).toBe(0);
      expect(result.contradictionScore).toBe(0);
      expect(result.derivedConfidence).toBe(0);
    });
  });

  describe("evaluateFindingValidationEligibility", () => {
    it("accepts valid supporting evidence with valid confidence", () => {
      expect(
        evaluateFindingValidationEligibility(
          [supporting],
          0.8,
        ),
      ).toEqual({
        eligible: true,
        reasons: [],
        evidenceAssessmentCount: 1,
        supportingEvidenceCount: 1,
        contradictingEvidenceCount: 0,
        confidenceAvailable: true,
      });
    });

    it("rejects findings without evidence", () => {
      const result =
        evaluateFindingValidationEligibility(
          [],
          0.8,
        );

      expect(result.eligible).toBe(false);
      expect(result.reasons).toContain(
        "At least one evidence assessment is required.",
      );
      expect(result.reasons).toContain(
        "At least one supporting evidence assessment is required.",
      );
    });

    it("rejects findings without supporting evidence", () => {
      const result =
        evaluateFindingValidationEligibility(
          [contradicting],
          0.8,
        );

      expect(result.eligible).toBe(false);
      expect(result.reasons).toContain(
        "At least one supporting evidence assessment is required.",
      );
    });

    it("rejects invalid assessment scores", () => {
      const invalid = {
        ...supporting,
        relevance: 1.5,
      };

      const result =
        evaluateFindingValidationEligibility(
          [invalid],
          0.8,
        );

      expect(result.eligible).toBe(false);
      expect(result.reasons).toContain(
        "All evidence assessment scores must be between 0 and 1.",
      );
    });

    it("rejects invalid confidence", () => {
      const result =
        evaluateFindingValidationEligibility(
          [supporting],
          1.5,
        );

      expect(result.eligible).toBe(false);
      expect(result.confidenceAvailable).toBe(false);
      expect(result.reasons).toContain(
        "A valid finding confidence score is required.",
      );
    });

    it("rejects undefined confidence", () => {
      const result =
        evaluateFindingValidationEligibility(
          [supporting],
        );

      expect(result.eligible).toBe(false);
      expect(result.confidenceAvailable).toBe(false);
    });

    it("accepts boundary score values", () => {
      const boundary = {
        ...supporting,
        relevance: 0,
        supportStrength: 1,
        reliability: 0,
        independence: 1,
      };

      const result =
        evaluateFindingValidationEligibility(
          [boundary],
          0,
        );

      expect(result.eligible).toBe(true);
      expect(result.confidenceAvailable).toBe(true);
    });
  });
});
