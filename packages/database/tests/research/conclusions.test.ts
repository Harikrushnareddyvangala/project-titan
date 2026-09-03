import { eq } from "drizzle-orm";

import { db } from "../../src/client.js";
import {
  researchConclusionContradictingFindings,
  researchConclusionSupportingFindings,
  researchInvestigationConclusions,
  researchFindings,
  researchInvestigations,
} from "../../src/schema/index.js";
import {
  createResearchInvestigationConclusionRecord,
  getResearchInvestigationConclusionRecord,
  updateResearchInvestigationConclusionRecord,
} from "../../src/research/conclusions.js";

const investigationId = "test-conclusion-investigation";
const findingOneId = "test-conclusion-finding-one";
const findingTwoId = "test-conclusion-finding-two";
const findingThreeId = "test-conclusion-finding-three";

const createdAt = new Date("2026-01-01T00:00:00.000Z");
const updatedAt = new Date("2026-01-01T01:00:00.000Z");

async function cleanup(): Promise<void> {
  await db
    .delete(researchInvestigationConclusions)
    .where(eq(researchInvestigationConclusions.investigationId, investigationId));

  await db
    .delete(researchFindings)
    .where(
      eq(researchFindings.id, findingOneId),
    );

  await db
    .delete(researchFindings)
    .where(
      eq(researchFindings.id, findingTwoId),
    );

  await db
    .delete(researchFindings)
    .where(
      eq(researchFindings.id, findingThreeId),
    );

  await db
    .delete(researchInvestigations)
    .where(eq(researchInvestigations.id, investigationId));
}

async function seedInvestigation(): Promise<void> {
  await db.insert(researchInvestigations).values({
    id: investigationId,
    title: "Conclusion persistence test",
    objective: "Test conclusion persistence",
    question: "Can conclusions be persisted correctly?",
    status: "Draft",
    description: null,
    repository: null,
    createdAt,
    updatedAt,
  });
}

async function seedFindings(): Promise<void> {
  await db.insert(researchFindings).values([
    {
      id: findingOneId,
      statement: "Finding one",
      confidence: 0.9,
      createdAt,
      updatedAt,
    },
    {
      id: findingTwoId,
      statement: "Finding two",
      confidence: 0.8,
      createdAt,
      updatedAt,
    },
    {
      id: findingThreeId,
      statement: "Finding three",
      confidence: 0.7,
      createdAt,
      updatedAt,
    },
  ]);
}

describe("research conclusion database persistence", () => {
  beforeEach(async () => {
    await cleanup();
    await seedInvestigation();
    await seedFindings();
  });

  afterEach(async () => {
    await cleanup();
  });

  it("creates and reads a conclusion without finding relationships", async () => {
    const conclusion = await createResearchInvestigationConclusionRecord({
      id: "test-conclusion-one",
      investigationId,
      statement: "The evidence is currently insufficient.",
      status: "Draft",
      createdAt,
      updatedAt,
    });

    expect(conclusion).toEqual({
      id: "test-conclusion-one",
      investigationId,
      statement: "The evidence is currently insufficient.",
      status: "Draft",
      supportingFindingIds: [],
      contradictingFindingIds: [],
      uncertainty: null,
      nextAction: null,
      createdAt,
      updatedAt,
    });

    await expect(
      getResearchInvestigationConclusionRecord("test-conclusion-one"),
    ).resolves.toEqual(conclusion);
  });

  it("persists and hydrates supporting findings", async () => {
    const conclusion = await createResearchInvestigationConclusionRecord({
      id: "test-conclusion-supporting",
      investigationId,
      statement: "The supporting evidence favors the hypothesis.",
      status: "Proposed",
      supportingFindingIds: [findingOneId, findingTwoId],
      createdAt,
      updatedAt,
    });

    expect(conclusion.supportingFindingIds).toEqual([
      findingOneId,
      findingTwoId,
    ]);
    expect(conclusion.contradictingFindingIds).toEqual([]);

    const links = await db
      .select()
      .from(researchConclusionSupportingFindings)
      .where(
        eq(
          researchConclusionSupportingFindings.conclusionId,
          "test-conclusion-supporting",
        ),
      );

    expect(links).toHaveLength(2);
  });

  it("persists and hydrates contradicting findings", async () => {
    const conclusion = await createResearchInvestigationConclusionRecord({
      id: "test-conclusion-contradicting",
      investigationId,
      statement: "Some evidence contradicts the hypothesis.",
      status: "Proposed",
      contradictingFindingIds: [findingThreeId],
      createdAt,
      updatedAt,
    });

    expect(conclusion.supportingFindingIds).toEqual([]);
    expect(conclusion.contradictingFindingIds).toEqual([findingThreeId]);

    const links = await db
      .select()
      .from(researchConclusionContradictingFindings)
      .where(
        eq(
          researchConclusionContradictingFindings.conclusionId,
          "test-conclusion-contradicting",
        ),
      );

    expect(links).toHaveLength(1);
  });

  it("persists both relationship types", async () => {
    const conclusion = await createResearchInvestigationConclusionRecord({
      id: "test-conclusion-both",
      investigationId,
      statement: "The evidence is mixed.",
      status: "Proposed",
      supportingFindingIds: [findingOneId],
      contradictingFindingIds: [findingThreeId],
      uncertainty: "The dataset remains limited.",
      nextAction: "Collect additional evidence.",
      createdAt,
      updatedAt,
    });

    expect(conclusion.supportingFindingIds).toEqual([findingOneId]);
    expect(conclusion.contradictingFindingIds).toEqual([findingThreeId]);
    expect(conclusion.uncertainty).toBe("The dataset remains limited.");
    expect(conclusion.nextAction).toBe("Collect additional evidence.");
  });

  it("replaces finding relationships atomically during update", async () => {
    await createResearchInvestigationConclusionRecord({
      id: "test-conclusion-update",
      investigationId,
      statement: "Initial conclusion.",
      status: "Draft",
      supportingFindingIds: [findingOneId, findingTwoId],
      contradictingFindingIds: [findingThreeId],
      createdAt,
      updatedAt,
    });

    const updated = await updateResearchInvestigationConclusionRecord(
      "test-conclusion-update",
      {
        statement: "Updated conclusion.",
        status: "Proposed",
        supportingFindingIds: [findingTwoId],
        contradictingFindingIds: [],
        uncertainty: "Updated uncertainty.",
        nextAction: "Continue investigation.",
        updatedAt: new Date("2026-01-01T02:00:00.000Z"),
      },
    );

    expect(updated.statement).toBe("Updated conclusion.");
    expect(updated.status).toBe("Proposed");
    expect(updated.supportingFindingIds).toEqual([findingTwoId]);
    expect(updated.contradictingFindingIds).toEqual([]);
    expect(updated.uncertainty).toBe("Updated uncertainty.");
    expect(updated.nextAction).toBe("Continue investigation.");

    const supportingLinks = await db
      .select()
      .from(researchConclusionSupportingFindings)
      .where(
        eq(
          researchConclusionSupportingFindings.conclusionId,
          "test-conclusion-update",
        ),
      );

    const contradictingLinks = await db
      .select()
      .from(researchConclusionContradictingFindings)
      .where(
        eq(
          researchConclusionContradictingFindings.conclusionId,
          "test-conclusion-update",
        ),
      );

    expect(supportingLinks).toHaveLength(1);
    expect(supportingLinks[0]?.findingId).toBe(findingTwoId);
    expect(contradictingLinks).toHaveLength(0);
  });

  it("returns null for a missing conclusion", async () => {
    await expect(
      getResearchInvestigationConclusionRecord("missing-conclusion"),
    ).resolves.toBeNull();
  });

  it("preserves nullable conclusion fields", async () => {
    const conclusion = await createResearchInvestigationConclusionRecord({
      id: "test-conclusion-nullable",
      investigationId,
      statement: "Nullable fields test.",
      status: "Draft",
      uncertainty: undefined,
      nextAction: undefined,
      createdAt,
      updatedAt,
    });

    expect(conclusion.uncertainty).toBeNull();
    expect(conclusion.nextAction).toBeNull();
  });

  it("rolls back conclusion creation when a relationship insert fails", async () => {
    await expect(
      createResearchInvestigationConclusionRecord({
        id: "test-conclusion-rollback",
        investigationId,
        statement: "This should roll back.",
        status: "Draft",
        supportingFindingIds: ["missing-finding"],
        createdAt,
        updatedAt,
      }),
    ).rejects.toThrow();

    await expect(
      getResearchInvestigationConclusionRecord("test-conclusion-rollback"),
    ).resolves.toBeNull();

    const supportingLinks = await db
      .select()
      .from(researchConclusionSupportingFindings)
      .where(
        eq(
          researchConclusionSupportingFindings.conclusionId,
          "test-conclusion-rollback",
        ),
      );

    expect(supportingLinks).toHaveLength(0);
  });
});
