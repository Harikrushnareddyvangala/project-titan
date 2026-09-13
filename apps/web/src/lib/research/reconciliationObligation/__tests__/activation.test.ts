import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ResearchReconciliationObligation } from "@/types/research";

const {
  getResearchReconciliationObligation,
  activateResearchReconciliationObligation,
} = vi.hoisted(() => ({
  getResearchReconciliationObligation: vi.fn(),
  activateResearchReconciliationObligation: vi.fn(),
}));

vi.mock("../serverRepository", () => ({
  getResearchReconciliationObligation,
  activateResearchReconciliationObligation,
}));

import { activateResearchReconciliationObligationOnServer } from "../activation";

function createObligation(
  overrides: Partial<ResearchReconciliationObligation> = {},
): ResearchReconciliationObligation {
  return {
    id: "reconciliation-001",
    investigationId: "investigation-001",
    issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
    targetEntityType: "Conclusion",
    targetEntityId: "conclusion-001",
    remediationAction: "RepairReference",
    status: "Open",
    reason: "Postcondition validation remained invalid.",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:05:00.000Z",
    ...overrides,
  };
}

describe("research reconciliation obligation activation boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when the obligation does not exist", async () => {
    getResearchReconciliationObligation.mockResolvedValue(null);

    const result =
      await activateResearchReconciliationObligationOnServer(
        "missing-obligation",
      );

    expect(result).toBeNull();
    expect(getResearchReconciliationObligation).toHaveBeenCalledWith(
      "missing-obligation",
    );
    expect(activateResearchReconciliationObligation).not.toHaveBeenCalled();
  });

  it("activates an open obligation into in-progress", async () => {
    const obligation = createObligation();

    getResearchReconciliationObligation.mockResolvedValue(obligation);

    const updatedObligation = createObligation({
      status: "In Progress",
      updatedAt: "2026-01-01T00:10:00.000Z",
    });

    activateResearchReconciliationObligation.mockResolvedValue(
      updatedObligation,
    );

    const result =
      await activateResearchReconciliationObligationOnServer(
        obligation.id,
        {
          getResearchReconciliationObligation,
          activateResearchReconciliationObligation,
          now: () => "2026-01-01T00:10:00.000Z",
        },
      );

    expect(activateResearchReconciliationObligation).toHaveBeenCalledWith(
      obligation.id,
      {
        expectedUpdatedAt: obligation.updatedAt,
        updatedAt: "2026-01-01T00:10:00.000Z",
      },
    );

    expect(result).toEqual({
      obligation: updatedObligation,
      transitioned: true,
    });
  });

  it("does not mutate an already in-progress obligation", async () => {
    const obligation = createObligation({
      status: "In Progress",
    });

    getResearchReconciliationObligation.mockResolvedValue(obligation);

    const result =
      await activateResearchReconciliationObligationOnServer(
        obligation.id,
      );

    expect(activateResearchReconciliationObligation).not.toHaveBeenCalled();

    expect(result).toEqual({
      obligation,
      transitioned: false,
      reason:
        "Reconciliation obligation cannot be activated from status: In Progress.",
    });
  });

  it("does not mutate a terminal obligation", async () => {
    const terminalStatuses = [
      "Resolved",
      "Abandoned",
      "Superseded",
    ] as const;

    for (const status of terminalStatuses) {
      const obligation = createObligation({ status });

      getResearchReconciliationObligation.mockResolvedValue(obligation);

      const result =
        await activateResearchReconciliationObligationOnServer(
          obligation.id,
        );

      expect(activateResearchReconciliationObligation).not.toHaveBeenCalled();

      expect(result).toEqual({
        obligation,
        transitioned: false,
        reason: `Reconciliation obligation cannot be activated from status: ${status}.`,
      });
    }
  });

  it("propagates optimistic concurrency failures from the repository", async () => {
    const obligation = createObligation();
    const staleError = new Error(
      "Reconciliation obligation update is stale.",
    );

    getResearchReconciliationObligation.mockResolvedValue(obligation);
    activateResearchReconciliationObligation.mockRejectedValue(
      staleError,
    );

    await expect(
      activateResearchReconciliationObligationOnServer(obligation.id, {
        getResearchReconciliationObligation,
        activateResearchReconciliationObligation,
        now: () => "2026-01-01T00:10:00.000Z",
      }),
    ).rejects.toBe(staleError);
  });

  it("performs only the lifecycle mutation during activation", async () => {
    const obligation = createObligation();

    getResearchReconciliationObligation.mockResolvedValue(obligation);
    activateResearchReconciliationObligation.mockResolvedValue(
      createObligation({
        status: "In Progress",
        updatedAt: "2026-01-01T00:10:00.000Z",
      }),
    );

    const result =
      await activateResearchReconciliationObligationOnServer(
        obligation.id,
        {
          getResearchReconciliationObligation,
          activateResearchReconciliationObligation,
          now: () => "2026-01-01T00:10:00.000Z",
        },
      );

    expect(result?.transitioned).toBe(true);
    expect(getResearchReconciliationObligation).toHaveBeenCalledTimes(1);
    expect(activateResearchReconciliationObligation).toHaveBeenCalledTimes(
      1,
    );
  });
});
