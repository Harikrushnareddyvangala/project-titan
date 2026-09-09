import { eq } from "drizzle-orm";

import { db } from "../../src/client.js";
import {
  researchConclusionSupportingFindings,
  researchInvestigationConclusions,
  researchProvenanceEvents,
  researchFindings,
  researchInvestigations,
} from "../../src/schema/index.js";
import { createResearchInvestigationConclusionRecord } from "../../src/research/conclusions.js";
import { persistResearchLineageRemediationMutation } from "../../src/research/remediation.js";

const investigationId = "test-remediation-investigation";
const conclusionId = "test-remediation-conclusion";
const findingId = "test-remediation-finding";

const createdAt = new Date("2026-01-01T00:00:00.000Z");
const initialUpdatedAt = new Date("2026-01-01T01:00:00.000Z");
const mutationUpdatedAt = new Date("2026-01-01T02:00:00.000Z");

async function cleanup(): Promise<void> {
  await db
    .delete(researchProvenanceEvents)
    .where(eq(researchProvenanceEvents.entityId, conclusionId));

  await db
    .delete(researchInvestigationConclusions)
    .where(eq(researchInvestigationConclusions.id, conclusionId));

  await db.delete(researchFindings).where(eq(researchFindings.id, findingId));

  await db.delete(researchInvestigations).where(eq(researchInvestigations.id, investigationId));
}

async function seed(): Promise<void> {
  await db.insert(researchInvestigations).values({
    id: investigationId,
    title: "Remediation persistence test",
    objective: "Test atomic remediation persistence",
    question: "Does remediation persistence remain atomic?",
    status: "Draft",
    description: null,
    repository: null,
    createdAt,
    updatedAt: initialUpdatedAt,
  });

  await db.insert(researchFindings).values({
    id: findingId,
    statement: "Initial finding",
    confidence: 0.9,
    createdAt,
    updatedAt: initialUpdatedAt,
  });

  await createResearchInvestigationConclusionRecord({
    id: conclusionId,
    investigationId,
    statement: "Initial conclusion.",
    status: "Draft",
    supportingFindingIds: [findingId],
    createdAt,
    updatedAt: initialUpdatedAt,
  });
}

describe("research remediation database persistence", () => {
  beforeEach(async () => {
    await cleanup();
    await seed();
  });

  afterEach(async () => {
    await cleanup();
  });

  it("persists conclusion mutation and provenance event atomically", async () => {
    const provenanceId = "test-remediation-provenance";

    const result = await persistResearchLineageRemediationMutation({
      conclusionId,
      conclusion: {
        statement: "Updated conclusion.",
        status: "Proposed",
        supportingFindingIds: [],
        contradictingFindingIds: [findingId],
        uncertainty: "Updated uncertainty.",
        nextAction: "Continue investigation.",
        updatedAt: mutationUpdatedAt,
      },
      provenance: {
        id: provenanceId,
        investigationId,
        entityType: "Conclusion",
        entityId: conclusionId,
        eventType: "Updated",
        reason: "Repair invalid conclusion reference.",
        timestamp: mutationUpdatedAt,
      },
    });

    expect(result.provenanceEventId).toBe(provenanceId);

    const [conclusion] = await db
      .select()
      .from(researchInvestigationConclusions)
      .where(eq(researchInvestigationConclusions.id, conclusionId));

    expect(conclusion).toMatchObject({
      id: conclusionId,
      statement: "Updated conclusion.",
      status: "Proposed",
      uncertainty: "Updated uncertainty.",
      nextAction: "Continue investigation.",
      updatedAt: mutationUpdatedAt,
    });

    const supportingLinks = await db
      .select()
      .from(researchConclusionSupportingFindings)
      .where(eq(researchConclusionSupportingFindings.conclusionId, conclusionId));

    expect(supportingLinks).toEqual([]);

    const [provenance] = await db
      .select()
      .from(researchProvenanceEvents)
      .where(eq(researchProvenanceEvents.id, provenanceId));

    expect(provenance).toMatchObject({
      id: provenanceId,
      investigationId,
      entityType: "Conclusion",
      entityId: conclusionId,
      eventType: "Updated",
      reason: "Repair invalid conclusion reference.",
    });
  });

  it("rolls back the conclusion mutation when provenance persistence fails", async () => {
    const invalidInvestigationId = "test-remediation-missing-investigation";

    await expect(
      persistResearchLineageRemediationMutation({
        conclusionId,
        conclusion: {
          statement: "This update must be rolled back.",
          status: "Proposed",
          supportingFindingIds: [],
          contradictingFindingIds: [findingId],
          uncertainty: "This must not persist.",
          nextAction: "This must not persist.",
          updatedAt: mutationUpdatedAt,
        },
        provenance: {
          id: "test-remediation-failing-provenance",
          investigationId: invalidInvestigationId,
          entityType: "Conclusion",
          entityId: conclusionId,
          eventType: "Updated",
          reason: "Force provenance failure.",
          timestamp: mutationUpdatedAt,
        },
      }),
    ).rejects.toThrow();

    const [conclusion] = await db
      .select()
      .from(researchInvestigationConclusions)
      .where(eq(researchInvestigationConclusions.id, conclusionId));

    expect(conclusion).toMatchObject({
      id: conclusionId,
      statement: "Initial conclusion.",
      status: "Draft",
      uncertainty: null,
      nextAction: null,
      updatedAt: initialUpdatedAt,
    });

    const supportingLinks = await db
      .select()
      .from(researchConclusionSupportingFindings)
      .where(eq(researchConclusionSupportingFindings.conclusionId, conclusionId));

    expect(supportingLinks).toHaveLength(1);
    expect(supportingLinks[0]?.findingId).toBe(findingId);

    const provenanceEvents = await db
      .select()
      .from(researchProvenanceEvents)
      .where(eq(researchProvenanceEvents.entityId, conclusionId));

    expect(provenanceEvents).toEqual([]);
  });
});
