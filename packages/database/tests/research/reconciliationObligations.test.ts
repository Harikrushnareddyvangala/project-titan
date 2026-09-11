import { eq } from "drizzle-orm";

import { db } from "../../src/client.js";
import {
  researchInvestigations,
  researchReconciliationObligations,
} from "../../src/schema/index.js";
import {
  createResearchReconciliationObligationRecord,
  getResearchReconciliationObligationRecord,
  getResearchReconciliationObligationRecords,
  ResearchReconciliationObligationStaleError,
  updateResearchReconciliationObligationStatus,
} from "../../src/research/reconciliationObligations.js";

const investigationId = "test-reconciliation-obligation-investigation";

const createdAt = new Date("2026-09-10T03:00:00.000Z");
const updatedAt = new Date("2026-09-10T03:05:00.000Z");

async function cleanup(): Promise<void> {
  await db
    .delete(researchReconciliationObligations)
    .where(
      eq(
        researchReconciliationObligations.investigationId,
        investigationId,
      ),
    );

  await db
    .delete(researchInvestigations)
    .where(eq(researchInvestigations.id, investigationId));
}

async function seedInvestigation(): Promise<void> {
  await db.insert(researchInvestigations).values({
    id: investigationId,
    title: "Reconciliation Obligation Test Investigation",
    objective: "Test reconciliation obligation persistence",
    question: "Can reconciliation obligations be persisted correctly?",
    status: "Draft",
    description: null,
    repository: null,
    createdAt,
    updatedAt,
  });
}

describe("research reconciliation obligation persistence", () => {
  beforeEach(async () => {
    await cleanup();
    await seedInvestigation();
  });

  afterEach(async () => {
    await cleanup();
  });

  it("creates and reads a reconciliation obligation", async () => {
    const obligation = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-test-1",
      investigationId,
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-001",
      remediationAction: "RepairReference",
      remediationExecutionId: "execution-001",
      provenanceEventId: "provenance-001",
      status: "Open",
      reason: "The committed remediation requires reconciliation.",
      createdAt,
      updatedAt,
    });

    expect(obligation).toEqual({
      id: "reconciliation-obligation-test-1",
      investigationId,
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-001",
      remediationAction: "RepairReference",
      remediationExecutionId: "execution-001",
      provenanceEventId: "provenance-001",
      status: "Open",
      reason: "The committed remediation requires reconciliation.",
      createdAt,
      updatedAt,
      resolvedAt: null,
    });

    await expect(
      getResearchReconciliationObligationRecord(
        "reconciliation-obligation-test-1",
      ),
    ).resolves.toEqual(obligation);
  });

  it("preserves nullable reconciliation fields when omitted", async () => {
    const obligation = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-test-2",
      investigationId,
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-002",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Reconciliation remains outstanding.",
      createdAt,
      updatedAt,
    });

    expect(obligation.remediationExecutionId).toBeNull();
    expect(obligation.provenanceEventId).toBeNull();
    expect(obligation.resolvedAt).toBeNull();
  });

  it("reads reconciliation obligations in deterministic creation order", async () => {
    const firstId = "reconciliation-obligation-test-order-a";
    const secondId = "reconciliation-obligation-test-order-b";

    try {
      await createResearchReconciliationObligationRecord({
        id: secondId,
        investigationId,
        issueCode: "ISSUE_B",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-b",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Second obligation.",
        createdAt: new Date("2026-09-10T03:10:00.000Z"),
        updatedAt: new Date("2026-09-10T03:10:00.000Z"),
      });

      await createResearchReconciliationObligationRecord({
        id: firstId,
        investigationId,
        issueCode: "ISSUE_A",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-a",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "First obligation.",
        createdAt: new Date("2026-09-10T03:10:00.000Z"),
        updatedAt: new Date("2026-09-10T03:10:00.000Z"),
      });

      const obligations = await getResearchReconciliationObligationRecords();

      const testObligations = obligations.filter(
        ({ id }) => id === firstId || id === secondId,
      );

      expect(testObligations.map(({ id }) => id)).toEqual([
        firstId,
        secondId,
      ]);
    } finally {
      await db
        .delete(researchReconciliationObligations)
        .where(eq(researchReconciliationObligations.id, firstId));

      await db
        .delete(researchReconciliationObligations)
        .where(eq(researchReconciliationObligations.id, secondId));
    }
  });

  it("updates an obligation through a legal lifecycle transition", async () => {
    const obligation = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-transition-1",
      investigationId,
      issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-transition-1",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Transition test.",
      createdAt,
      updatedAt,
    });

    const nextUpdatedAt = new Date("2026-09-10T03:15:00.000Z");

    const updated = await updateResearchReconciliationObligationStatus(
      obligation.id,
      {
        expectedUpdatedAt: obligation.updatedAt,
        toStatus: "In Progress",
        updatedAt: nextUpdatedAt,
      },
    );

    expect(updated.status).toBe("In Progress");
    expect(updated.updatedAt).toEqual(nextUpdatedAt);
    expect(updated.resolvedAt).toBeNull();
  });

  it("sets resolvedAt when entering Resolved", async () => {
    const inProgressAt = new Date("2026-09-10T03:15:00.000Z");
    const resolvedAt = new Date("2026-09-10T03:20:00.000Z");

    const obligation = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-transition-2",
      investigationId,
      issueCode: "ISSUE_RESOLVE",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-transition-2",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Resolution test.",
      createdAt,
      updatedAt,
    });

    const inProgress = await updateResearchReconciliationObligationStatus(
      obligation.id,
      {
        expectedUpdatedAt: obligation.updatedAt,
        toStatus: "In Progress",
        updatedAt: inProgressAt,
      },
    );

    const resolved = await updateResearchReconciliationObligationStatus(
      obligation.id,
      {
        expectedUpdatedAt: inProgress.updatedAt,
        toStatus: "Resolved",
        updatedAt: resolvedAt,
      },
    );

    expect(resolved.status).toBe("Resolved");
    expect(resolved.updatedAt).toEqual(resolvedAt);
    expect(resolved.resolvedAt).toEqual(resolvedAt);
  });

  it("rejects an illegal lifecycle transition without mutating the obligation", async () => {
    const obligation = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-transition-3",
      investigationId,
      issueCode: "ISSUE_ILLEGAL",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-transition-3",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Illegal transition test.",
      createdAt,
      updatedAt,
    });

    const nextUpdatedAt = new Date("2026-09-10T03:25:00.000Z");

    await expect(
      updateResearchReconciliationObligationStatus(obligation.id, {
        expectedUpdatedAt: obligation.updatedAt,
        toStatus: "Resolved",
        updatedAt: nextUpdatedAt,
      }),
    ).rejects.toThrow(
      "Research reconciliation obligation cannot transition from Open to Resolved",
    );

    const unchanged = await getResearchReconciliationObligationRecord(
      obligation.id,
    );

    expect(unchanged).toEqual(obligation);
  });

  it("rejects a stale expectedUpdatedAt with the dedicated stale error", async () => {
    const obligation = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-transition-4",
      investigationId,
      issueCode: "ISSUE_STALE",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-transition-4",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Stale update test.",
      createdAt,
      updatedAt,
    });

    const currentUpdatedAt = new Date("2026-09-10T03:30:00.000Z");

    const current = await updateResearchReconciliationObligationStatus(
      obligation.id,
      {
        expectedUpdatedAt: obligation.updatedAt,
        toStatus: "In Progress",
        updatedAt: currentUpdatedAt,
      },
    );

    const staleUpdatedAt = new Date("2026-09-10T03:10:00.000Z");

    await expect(
      updateResearchReconciliationObligationStatus(obligation.id, {
        expectedUpdatedAt: staleUpdatedAt,
        toStatus: "Abandoned",
        updatedAt: new Date("2026-09-10T03:35:00.000Z"),
      }),
    ).rejects.toBeInstanceOf(ResearchReconciliationObligationStaleError);

    const unchanged = await getResearchReconciliationObligationRecord(
      obligation.id,
    );

    expect(unchanged).toEqual(current);
  });

  it("keeps terminal states terminal", async () => {
    const terminalStatuses = ["Resolved", "Abandoned", "Superseded"] as const;

    for (const [index, status] of terminalStatuses.entries()) {
      const obligation = await createResearchReconciliationObligationRecord({
        id: `reconciliation-obligation-terminal-${index}`,
        investigationId,
        issueCode: `ISSUE_TERMINAL_${index}`,
        targetEntityType: "Conclusion",
        targetEntityId: `conclusion-terminal-${index}`,
        remediationAction: "RepairReference",
        status,
        reason: "Terminal state test.",
        createdAt,
        updatedAt,
        resolvedAt: status === "Resolved" ? updatedAt : undefined,
      });

      await expect(
        updateResearchReconciliationObligationStatus(obligation.id, {
          expectedUpdatedAt: obligation.updatedAt,
          toStatus: "Open",
          updatedAt: new Date("2026-09-10T03:40:00.000Z"),
        }),
      ).rejects.toThrow(
        `Research reconciliation obligation cannot transition from ${status} to Open`,
      );
    }
  });

  it("returns null for a missing reconciliation obligation", async () => {
    await expect(
      getResearchReconciliationObligationRecord(
        "reconciliation-obligation-does-not-exist",
      ),
    ).resolves.toBeNull();
  });

  it("rejects creation when the investigation does not exist", async () => {
    await expect(
      createResearchReconciliationObligationRecord({
        id: "reconciliation-obligation-invalid-investigation",
        investigationId: "missing-investigation",
        issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-missing",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Invalid investigation reference.",
        createdAt,
        updatedAt,
      }),
    ).rejects.toThrow();

    await expect(
      getResearchReconciliationObligationRecord(
        "reconciliation-obligation-invalid-investigation",
      ),
    ).resolves.toBeNull();
  });
});
