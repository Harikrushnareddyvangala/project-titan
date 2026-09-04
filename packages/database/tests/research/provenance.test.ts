import { eq } from "drizzle-orm";

import { db } from "../../src/client.js";
import {
  researchInvestigations,
  researchProvenanceEvents,
} from "../../src/schema/index.js";
import {
  createResearchProvenanceEventRecord,
  getResearchProvenanceEventRecord,
} from "../../src/research/provenance.js";

const investigationId = "test-investigation-provenance";

async function seedInvestigation() {
  await db
    .insert(researchInvestigations)
    .values({
      id: investigationId,
      title: "Provenance Test Investigation",
      objective: "Test provenance persistence",
      question: "Does provenance persistence work?",
      status: "Draft",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    })
    .onConflictDoNothing();
}

async function cleanup() {
  await db
    .delete(researchProvenanceEvents)
    .where(eq(researchProvenanceEvents.investigationId, investigationId));

  await db
    .delete(researchInvestigations)
    .where(eq(researchInvestigations.id, investigationId));
}

describe("research provenance persistence", () => {
  beforeEach(async () => {
    await cleanup();
    await seedInvestigation();
  });

  afterAll(async () => {
    await cleanup();
  });

  it("creates and reads a provenance event", async () => {
    const timestamp = new Date("2026-01-02T10:00:00.000Z");

    const created = await createResearchProvenanceEventRecord({
      id: "provenance-test-1",
      investigationId,
      entityType: "Investigation",
      entityId: investigationId,
      eventType: "Created",
      timestamp,
    });

    expect(created).toEqual({
      id: "provenance-test-1",
      investigationId,
      entityType: "Investigation",
      entityId: investigationId,
      eventType: "Created",
      fromStatus: null,
      toStatus: null,
      reason: null,
      actor: null,
      timestamp,
      metadata: null,
    });

    await expect(
      getResearchProvenanceEventRecord("provenance-test-1"),
    ).resolves.toEqual(created);
  });

  it("persists nullable provenance fields", async () => {
    const created = await createResearchProvenanceEventRecord({
      id: "provenance-test-2",
      investigationId,
      entityType: "Finding",
      entityId: "finding-1",
      eventType: "Status Changed",
      fromStatus: "Draft",
      toStatus: "Validated",
      reason: "Evidence supports the finding",
      actor: "researcher",
      timestamp: new Date("2026-01-02T11:00:00.000Z"),
    });

    expect(created.fromStatus).toBe("Draft");
    expect(created.toStatus).toBe("Validated");
    expect(created.reason).toBe("Evidence supports the finding");
    expect(created.actor).toBe("researcher");
  });

  it("persists structured metadata as JSON", async () => {
    const metadata = {
      source: "validation-service",
      confidence: 0.94,
      tags: ["research", "validation"],
      nested: {
        revision: 2,
      },
    };

    const created = await createResearchProvenanceEventRecord({
      id: "provenance-test-3",
      investigationId,
      entityType: "Validation",
      entityId: "validation-1",
      eventType: "Validated",
      timestamp: new Date("2026-01-02T12:00:00.000Z"),
      metadata,
    });

    expect(created.metadata).toEqual(metadata);

    await expect(
      getResearchProvenanceEventRecord("provenance-test-3"),
    ).resolves.toMatchObject({
      metadata,
    });
  });

  it("returns null for a missing provenance event", async () => {
    await expect(
      getResearchProvenanceEventRecord("provenance-does-not-exist"),
    ).resolves.toBeNull();
  });

  it("rejects creation when the investigation does not exist", async () => {
    await expect(
      createResearchProvenanceEventRecord({
        id: "provenance-test-invalid-investigation",
        investigationId: "missing-investigation",
        entityType: "Investigation",
        entityId: "missing-investigation",
        eventType: "Created",
        timestamp: new Date("2026-01-02T13:00:00.000Z"),
      }),
    ).rejects.toThrow();

    await expect(
      getResearchProvenanceEventRecord(
        "provenance-test-invalid-investigation",
      ),
    ).resolves.toBeNull();
  });

  it("rolls back the transaction when provenance creation fails", async () => {
    const duplicateId = "provenance-test-duplicate";

    await createResearchProvenanceEventRecord({
      id: duplicateId,
      investigationId,
      entityType: "Finding",
      entityId: "finding-1",
      eventType: "Created",
      timestamp: new Date("2026-01-02T14:00:00.000Z"),
    });

    await expect(
      createResearchProvenanceEventRecord({
        id: duplicateId,
        investigationId,
        entityType: "Finding",
        entityId: "finding-2",
        eventType: "Updated",
        timestamp: new Date("2026-01-02T15:00:00.000Z"),
      }),
    ).rejects.toThrow();

    const rows = await db
      .select()
      .from(researchProvenanceEvents)
      .where(eq(researchProvenanceEvents.id, duplicateId));

    expect(rows).toHaveLength(1);
    expect(rows[0]?.eventType).toBe("Created");
  });
});
