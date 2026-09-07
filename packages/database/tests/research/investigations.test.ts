import { randomUUID } from "node:crypto";
import { beforeAll, afterAll, describe, expect, it } from "vitest";

import {
    createResearchInvestigationRecord,
    getResearchInvestigationRecord,
    getResearchInvestigationRecords,
    pool,
} from "../../src/index.js";

import { withDatabaseTransaction } from "../../src/transaction.js";
import { researchInvestigations } from "../../src/schema/index.js";

describe("research investigation persistence", () => {
    beforeAll(async () => {
        await pool.query("SELECT 1");
    });

    afterAll(async () => {
        await pool.end();
    });

    it("creates and reads an investigation through PostgreSQL", async () => {
        const id = `test-investigation-${randomUUID()}`;

        const createdAt = new Date("2026-09-03T02:00:00.000Z");
        const updatedAt = new Date("2026-09-03T02:05:00.000Z");

        try {
            const created = await createResearchInvestigationRecord({
                id,
                title: "Persistence Integration Test",
                objective: "Verify PostgreSQL investigation persistence",
                question: "Can an investigation be created and hydrated?",
                status: "active",
                description: "Integration-test investigation",
                repository: "project-titan",
                createdAt,
                updatedAt,
            });

            expect(created).toMatchObject({
                id,
                title: "Persistence Integration Test",
                objective: "Verify PostgreSQL investigation persistence",
                question: "Can an investigation be created and hydrated?",
                status: "active",
                description: "Integration-test investigation",
                repository: "project-titan",
                experimentIds: [],
                evidenceIds: [],
                findingIds: [],
                artifactIds: [],
                conclusionIds: [],
            });

            expect(created.createdAt.toISOString()).toBe(createdAt.toISOString());
            expect(created.updatedAt.toISOString()).toBe(updatedAt.toISOString());

            const loaded = await getResearchInvestigationRecord(id);

            expect(loaded).toEqual(created);
        } finally {
            await pool.query(
                "DELETE FROM research_investigations WHERE id = $1",
                [id],
            );
        }
    });

    it("returns null when an investigation does not exist", async () => {
        const id = `missing-investigation-${randomUUID()}`;

        const result = await getResearchInvestigationRecord(id);

        expect(result).toBeNull();
    });

    it("rolls back an investigation when the transaction fails", async () => {
        const id = `rollback-investigation-${randomUUID()}`;

        await expect(
            withDatabaseTransaction(async (tx) => {
                await tx.insert(researchInvestigations).values({
                    id,
                    title: "Rollback Test",
                    objective: "Verify transaction rollback",
                    question: "Does a failed transaction leave no row?",
                    status: "active",
                    description: null,
                    repository: null,
                    createdAt: new Date("2026-09-03T02:00:00.000Z"),
                    updatedAt: new Date("2026-09-03T02:00:00.000Z"),
                });

                throw new Error("Intentional rollback test");
            }),
        ).rejects.toThrow("Intentional rollback test");

        const result = await getResearchInvestigationRecord(id);

        expect(result).toBeNull();
    });

    it("reads investigations as a deterministically ordered collection", async () => {
        const firstId = `collection-investigation-a-${randomUUID()}`;
        const secondId = `collection-investigation-b-${randomUUID()}`;

        const createdAt = new Date("2026-09-03T04:00:00.000Z");
        const updatedAt = new Date("2026-09-03T04:05:00.000Z");

        try {
            await createResearchInvestigationRecord({
                id: secondId,
                title: "Collection Test B",
                objective: "Verify collection reads",
                question: "Are investigations returned deterministically?",
                status: "active",
                createdAt,
                updatedAt,
            });

            await createResearchInvestigationRecord({
                id: firstId,
                title: "Collection Test A",
                objective: "Verify collection reads",
                question: "Are investigations returned deterministically?",
                status: "active",
                createdAt,
                updatedAt,
            });

            const investigations = await getResearchInvestigationRecords();

            const testInvestigations = investigations.filter(
                ({ id }) => id === firstId || id === secondId,
            );

            expect(testInvestigations.map(({ id }) => id)).toEqual([
                firstId,
                secondId,
            ]);
        } finally {
            await pool.query(
                "DELETE FROM research_investigations WHERE id = ANY($1)",
                [[firstId, secondId]],
            );
        }
    });
});
