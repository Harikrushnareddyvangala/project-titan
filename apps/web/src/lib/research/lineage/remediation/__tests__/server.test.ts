import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ResearchInvestigationConclusion } from "@/types/research";

const { persistResearchLineageRemediationMutation } = vi.hoisted(() => ({
  persistResearchLineageRemediationMutation: vi.fn(),
}));

vi.mock("@titan/database", () => ({
  persistResearchLineageRemediationMutation,
}));

import { researchLineageRemediationDatabasePersistence } from "../server";

describe("research lineage remediation server persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists the conclusion and provenance as one database mutation", async () => {
    persistResearchLineageRemediationMutation.mockResolvedValue({
      provenanceEventId: "research-provenance-generated",
    });

    const conclusion: ResearchInvestigationConclusion = {
      id: "conclusion-1",
      investigationId: "investigation-1",
      statement: "Updated conclusion",
      status: "Proposed",
      supportingFindingIds: ["finding-1"],
      contradictingFindingIds: ["finding-2"],
      uncertainty: "Moderate",
      nextAction: "Validate replacement evidence",
      createdAt: "2026-01-01T10:00:00.000Z",
      updatedAt: "2026-01-02T10:00:00.000Z",
    };

    const provenance = {
      investigationId: "different-investigation",
      entityType: "Conclusion" as const,
      entityId: "conclusion-1",
      eventType: "Updated" as const,
      reason: "Replaced invalid finding reference",
    };

    const result =
      await researchLineageRemediationDatabasePersistence.persistResearchLineageRemediationMutation(
        {
          conclusion,
          provenance,
        },
      );

    expect(persistResearchLineageRemediationMutation).toHaveBeenCalledTimes(1);

    expect(persistResearchLineageRemediationMutation).toHaveBeenCalledWith({
      conclusionId: "conclusion-1",
      conclusion: {
        statement: "Updated conclusion",
        status: "Proposed",
        supportingFindingIds: ["finding-1"],
        contradictingFindingIds: ["finding-2"],
        uncertainty: "Moderate",
        nextAction: "Validate replacement evidence",
        updatedAt: new Date("2026-01-02T10:00:00.000Z"),
      },
      provenance: expect.objectContaining({
        investigationId: "investigation-1",
        entityType: "Conclusion",
        entityId: "conclusion-1",
        eventType: "Updated",
        reason: "Replaced invalid finding reference",
      }),
    });

    const call = persistResearchLineageRemediationMutation.mock.calls[0]?.[0];

    expect(call.provenance.id).toMatch(/^research-provenance-/);
    expect(call.provenance.timestamp).toBeInstanceOf(Date);

    expect(result).toEqual({
      provenanceEventId: "research-provenance-generated",
    });
  });
});
