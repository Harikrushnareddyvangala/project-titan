import { describe, expect, it } from "vitest";

import type {
    ResearchExperiment,
    ResearchFinding,
    ResearchFindingValidation,
    ResearchInvestigation,
    ResearchInvestigationConclusion,
    ResearchProvenanceEvent,
} from "@/types/research";

import {
    validateResearchProvenanceIntegrity,
    type ResearchProvenanceIntegrityDependencies,
} from "../integrity";

const investigation: ResearchInvestigation = {
    id: "investigation-integrity-001",
    title: "Integrity investigation",
    objective: "Validate provenance integrity",
    question: "Are provenance references internally consistent?",
    status: "Draft",
    findingIds: ["finding-001"],
    experimentIds: ["experiment-001"],
    evidenceIds: [],
    artifactIds: [],
    conclusionIds: ["conclusion-001"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

const experiment: ResearchExperiment = {
    id: "experiment-001",
    investigationId: investigation.id,
    title: "Integrity experiment",
    objective: "Validate provenance integrity",
    status: "Draft",
    evidenceIds: [],
    findingIds: [],
    lifecycle: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

const finding: ResearchFinding = {
    id: "finding-001",
    statement: "The finding is supported.",
    evidenceAssessments: [],
    confidence: 0.9,
    validationIds: ["validation-001"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

const validation: ResearchFindingValidation = {
    id: "validation-001",
    findingId: finding.id,
    status: "Validated",
    decision: "Accept",
    rationale: "The evidence supports the finding.",
    confidenceAtValidation: 0.9,
    evidenceAssessmentCount: 0,
    supportingEvidenceCount: 0,
    contradictingEvidenceCount: 0,
    validator: "Researcher",
    validatedAt: "2026-01-02T00:00:00.000Z",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
};

const conclusion: ResearchInvestigationConclusion = {
    id: "conclusion-001",
    investigationId: investigation.id,
    statement: "The conclusion follows from the finding.",
    supportingFindingIds: [finding.id],
    contradictingFindingIds: [],
    status: "Draft",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

function createDependencies(
    events: ResearchProvenanceEvent[],
): ResearchProvenanceIntegrityDependencies {
    return {
        getResearchProvenanceEvents: () => events,
        getResearchInvestigations: () => [investigation],
        getResearchExperiments: () => [experiment],
        getResearchFindings: () => [finding],
        getResearchFindingValidations: () => [validation],
        getResearchInvestigationConclusions: () => [conclusion],
    };
}

describe("research provenance integrity", () => {
    it("reports a valid provenance collection when all references resolve", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-investigation",
                investigationId: investigation.id,
                entityType: "Investigation",
                entityId: investigation.id,
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
            {
                id: "event-experiment",
                investigationId: investigation.id,
                entityType: "Experiment",
                entityId: experiment.id,
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
            {
                id: "event-validation",
                investigationId: investigation.id,
                entityType: "FindingValidation",
                entityId: validation.id,
                eventType: "Validated",
                timestamp: "2026-01-02T00:00:00.000Z",
            },
            {
                id: "event-conclusion",
                investigationId: investigation.id,
                entityType: "Conclusion",
                entityId: conclusion.id,
                eventType: "Created",
                timestamp: "2026-01-02T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity(
            createDependencies(events),
        );

        expect(result.valid).toBe(true);
        expect(result.checkedEventCount).toBe(4);
        expect(result.issues).toEqual([]);
    });

    it("reports a missing investigation", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-missing-investigation",
                investigationId: "missing-investigation",
                entityType: "Finding",
                entityId: finding.id,
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity(
            createDependencies(events),
        );

        expect(result.valid).toBe(false);
        expect(result.issues).toHaveLength(1);
        expect(result.issues[0]?.code).toBe("INVESTIGATION_NOT_FOUND");
    });

    it("reports invalid timestamps", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-invalid-timestamp",
                investigationId: investigation.id,
                entityType: "Investigation",
                entityId: investigation.id,
                eventType: "Created",
                timestamp: "not-a-timestamp",
            },
        ];

        const result = validateResearchProvenanceIntegrity(
            createDependencies(events),
        );

        expect(result.valid).toBe(false);
        expect(result.issues[0]?.code).toBe("INVALID_TIMESTAMP");
    });

    it("reports investigation entity mismatches", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-investigation-mismatch",
                investigationId: investigation.id,
                entityType: "Investigation",
                entityId: "different-investigation",
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity(
            createDependencies(events),
        );

        expect(result.issues[0]?.code).toBe(
            "ENTITY_INVESTIGATION_MISMATCH",
        );
    });

    it("reports missing experiments", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-missing-experiment",
                investigationId: investigation.id,
                entityType: "Experiment",
                entityId: "missing-experiment",
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity(
            createDependencies(events),
        );

        expect(result.issues[0]?.code).toBe("EXPERIMENT_NOT_FOUND");
    });

    it("reports experiment investigation mismatches", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-experiment-mismatch",
                investigationId: investigation.id,
                entityType: "Experiment",
                entityId: experiment.id,
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const dependencies = createDependencies(events);

        const result = validateResearchProvenanceIntegrity({
            ...dependencies,
            getResearchExperiments: () => [
                {
                    ...experiment,
                    investigationId: "different-investigation",
                },
            ],
        });

        expect(result.issues[0]?.code).toBe(
            "EXPERIMENT_INVESTIGATION_MISMATCH",
        );
    });

    it("reports missing validations", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-missing-validation",
                investigationId: investigation.id,
                entityType: "FindingValidation",
                entityId: "missing-validation",
                eventType: "Validated",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity(
            createDependencies(events),
        );

        expect(result.issues[0]?.code).toBe("VALIDATION_NOT_FOUND");
    });

    it("reports validations whose finding is missing", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-missing-finding",
                investigationId: investigation.id,
                entityType: "FindingValidation",
                entityId: validation.id,
                eventType: "Validated",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity({
            ...createDependencies(events),
            getResearchFindings: () => [],
        });

        expect(result.issues[0]?.code).toBe(
            "VALIDATION_FINDING_NOT_FOUND",
        );
    });

    it("reports a finding that is outside the investigation scope", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-finding-out-of-scope",
                investigationId: investigation.id,
                entityType: "FindingValidation",
                entityId: validation.id,
                eventType: "Validated",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity({
            ...createDependencies(events),
            getResearchInvestigations: () => [
                {
                    ...investigation,
                    findingIds: [],
                },
            ],
        });

        expect(result.issues[0]?.code).toBe(
            "FINDING_INVESTIGATION_MISMATCH",
        );
    });

    it("reports missing conclusions", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-missing-conclusion",
                investigationId: investigation.id,
                entityType: "Conclusion",
                entityId: "missing-conclusion",
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity(
            createDependencies(events),
        );

        expect(result.issues[0]?.code).toBe("CONCLUSION_NOT_FOUND");
    });

    it("reports conclusion investigation mismatches", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-conclusion-mismatch",
                investigationId: investigation.id,
                entityType: "Conclusion",
                entityId: conclusion.id,
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity({
            ...createDependencies(events),
            getResearchInvestigationConclusions: () => [
                {
                    ...conclusion,
                    investigationId: "different-investigation",
                },
            ],
        });

        expect(result.issues[0]?.code).toBe(
            "CONCLUSION_INVESTIGATION_MISMATCH",
        );
    });

    it("allows evidence and finding events without additional integrity checks", () => {
        const events: ResearchProvenanceEvent[] = [
            {
                id: "event-evidence",
                investigationId: investigation.id,
                entityType: "Evidence",
                entityId: "evidence-001",
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
            {
                id: "event-assessment",
                investigationId: investigation.id,
                entityType: "EvidenceAssessment",
                entityId: "assessment-001",
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
            {
                id: "event-finding",
                investigationId: investigation.id,
                entityType: "Finding",
                entityId: finding.id,
                eventType: "Created",
                timestamp: "2026-01-01T00:00:00.000Z",
            },
        ];

        const result = validateResearchProvenanceIntegrity(
            createDependencies(events),
        );

        expect(result.valid).toBe(true);
        expect(result.checkedEventCount).toBe(3);
    });
});