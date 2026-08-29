import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    localResearchPersistence,
} from "../local";

describe("local research persistence", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("loads empty collections from empty storage", () => {
        expect(localResearchPersistence.load()).toEqual({
            investigations: [],
            experiments: [],
            evidence: [],
            evidenceAssessments: [],
            findings: [],
            findingValidations: [],
            findingValidationHistory: [],
            investigationConclusions: [],
            provenanceEvents: [],
        });
    });

    it("loads persisted collections from localStorage", () => {
        localStorage.setItem(
            "titan:research-evidence",
            JSON.stringify([
                {
                    id: "evidence-001",
                    type: "Analysis",
                    title: "Test evidence",
                    createdAt: "2026-01-01T00:00:00.000Z",
                },
            ]),
        );

        localStorage.setItem(
            "titan:research-findings",
            JSON.stringify([
                {
                    id: "finding-001",
                    statement: "Test finding",
                    evidenceAssessments: [],
                    validationIds: [],
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                },
            ]),
        );

        const snapshot = localResearchPersistence.load();

        expect(snapshot.evidence).toHaveLength(1);
        expect(snapshot.evidence[0].id).toBe("evidence-001");

        expect(snapshot.findings).toHaveLength(1);
        expect(snapshot.findings[0].id).toBe("finding-001");
    });

    it("treats malformed collection JSON as empty", () => {
        localStorage.setItem(
            "titan:research-evidence",
            "{invalid-json",
        );

        expect(
            localResearchPersistence.load().evidence,
        ).toEqual([]);
    });

    it("writes investigations and emits the research change event", () => {
        const listener = vi.fn();

        window.addEventListener(
            "titan:research-change",
            listener,
        );

        const investigations = [
            {
                id: "investigation-001",
                title: "Test investigation",
                objective: "Test persistence",
                question: "Does persistence work?",
                status: "Draft" as const,
                experimentIds: [],
                evidenceIds: [],
                findingIds: [],
                artifactIds: [],
                conclusionIds: [],
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
            },
        ];

        localResearchPersistence.saveInvestigations(
            investigations,
        );

        expect(
            JSON.parse(
                localStorage.getItem(
                    "titan:research-investigations",
                ) ?? "null",
            ),
        ).toEqual(investigations);

        expect(listener).toHaveBeenCalledTimes(1);

        window.removeEventListener(
            "titan:research-change",
            listener,
        );
    });

    it("produces an aggregate snapshot key from all collections", () => {
        const initial =
            localResearchPersistence.getSnapshotKey();

        localResearchPersistence.saveEvidence([
            {
                id: "evidence-002",
                type: "Metric",
                title: "Snapshot evidence",
                createdAt: "2026-01-01T00:00:00.000Z",
            },
        ]);

        const updated =
            localResearchPersistence.getSnapshotKey();

        expect(updated).not.toBe(initial);
    });

    it("produces collection-specific snapshot keys", () => {
        const initialEvidence =
            localResearchPersistence.getCollectionSnapshotKey(
                "evidence",
            );

        const initialFindings =
            localResearchPersistence.getCollectionSnapshotKey(
                "findings",
            );

        localResearchPersistence.saveEvidence([
            {
                id: "evidence-003",
                type: "Analysis",
                title: "Collection snapshot evidence",
                createdAt: "2026-01-01T00:00:00.000Z",
            },
        ]);

        const updatedEvidence =
            localResearchPersistence.getCollectionSnapshotKey(
                "evidence",
            );

        const updatedFindings =
            localResearchPersistence.getCollectionSnapshotKey(
                "findings",
            );

        expect(updatedEvidence).not.toBe(initialEvidence);
        expect(updatedFindings).toBe(initialFindings);
    });

    it("subscribes to both storage and research change events", () => {
        const callback = vi.fn();

        const unsubscribe =
            localResearchPersistence.subscribe(
                callback,
            );

        window.dispatchEvent(
            new Event("titan:research-change"),
        );

        window.dispatchEvent(
            new Event("storage"),
        );

        expect(callback).toHaveBeenCalledTimes(2);

        unsubscribe();

        window.dispatchEvent(
            new Event("titan:research-change"),
        );

        window.dispatchEvent(
            new Event("storage"),
        );

        expect(callback).toHaveBeenCalledTimes(2);
    });
});