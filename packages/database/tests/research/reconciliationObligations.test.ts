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
  getResearchReconciliationObligationRecordsByInvestigation,
  getUnresolvedResearchReconciliationObligationRecords,
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

  it("retrieves only obligations belonging to the requested investigation", async () => {
    const otherInvestigationId =
      "test-reconciliation-obligation-other-investigation";

    const firstId = "reconciliation-obligation-investigation-a";
    const secondId = "reconciliation-obligation-investigation-b";
    const otherId = "reconciliation-obligation-investigation-other";

    await db.insert(researchInvestigations).values({
      id: otherInvestigationId,
      title: "Other Reconciliation Obligation Test Investigation",
      objective: "Test investigation-scoped retrieval",
      question: "Does retrieval isolate investigations?",
      status: "Draft",
      description: null,
      repository: null,
      createdAt,
      updatedAt,
    });

    try {
      await createResearchReconciliationObligationRecord({
        id: firstId,
        investigationId,
        issueCode: "ISSUE_INVESTIGATION_A",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-investigation-a",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "First investigation-scoped obligation.",
        createdAt,
        updatedAt,
      });

      await createResearchReconciliationObligationRecord({
        id: secondId,
        investigationId,
        issueCode: "ISSUE_INVESTIGATION_B",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-investigation-b",
        remediationAction: "RepairReference",
        status: "In Progress",
        reason: "Second investigation-scoped obligation.",
        createdAt: new Date("2026-09-10T03:10:00.000Z"),
        updatedAt: new Date("2026-09-10T03:10:00.000Z"),
      });

      await createResearchReconciliationObligationRecord({
        id: otherId,
        investigationId: otherInvestigationId,
        issueCode: "ISSUE_OTHER_INVESTIGATION",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-other",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Obligation for another investigation.",
        createdAt,
        updatedAt,
      });

      const obligations =
        await getResearchReconciliationObligationRecordsByInvestigation(
          investigationId,
        );

      expect(obligations.map(({ id }) => id)).toEqual([firstId, secondId]);
      expect(
        obligations.every(
          ({ investigationId: returnedInvestigationId }) =>
            returnedInvestigationId === investigationId,
        ),
      ).toBe(true);
    } finally {
      await db
        .delete(researchReconciliationObligations)
        .where(eq(researchReconciliationObligations.id, firstId));

      await db
        .delete(researchReconciliationObligations)
        .where(eq(researchReconciliationObligations.id, secondId));

      await db
        .delete(researchReconciliationObligations)
        .where(eq(researchReconciliationObligations.id, otherId));

      await db
        .delete(researchInvestigations)
        .where(eq(researchInvestigations.id, otherInvestigationId));
    }
  });

  it("retrieves investigation obligations in deterministic creation order", async () => {
    const firstId = "reconciliation-obligation-investigation-order-a";
    const secondId = "reconciliation-obligation-investigation-order-b";

    try {
      await createResearchReconciliationObligationRecord({
        id: secondId,
        investigationId,
        issueCode: "ISSUE_INVESTIGATION_ORDER_B",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-order-b",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Second obligation.",
        createdAt,
        updatedAt,
      });

      await createResearchReconciliationObligationRecord({
        id: firstId,
        investigationId,
        issueCode: "ISSUE_INVESTIGATION_ORDER_A",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-order-a",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "First obligation.",
        createdAt,
        updatedAt,
      });

      const obligations =
        await getResearchReconciliationObligationRecordsByInvestigation(
          investigationId,
        );

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

  it("returns an empty list when an investigation has no reconciliation obligations", async () => {
    await expect(
      getResearchReconciliationObligationRecordsByInvestigation(
        "reconciliation-obligation-empty-investigation",
      ),
    ).resolves.toEqual([]);
  });

  it("retrieves only unresolved obligations for the requested investigation", async () => {
    const openId = "reconciliation-obligation-unresolved-open";
    const inProgressId = "reconciliation-obligation-unresolved-progress";
    const resolvedId = "reconciliation-obligation-unresolved-resolved";
    const abandonedId = "reconciliation-obligation-unresolved-abandoned";
    const supersededId = "reconciliation-obligation-unresolved-superseded";

    const obligations = [
      {
        id: openId,
        status: "Open",
        issueCode: "ISSUE_UNRESOLVED_OPEN",
        targetEntityId: "conclusion-unresolved-open",
      },
      {
        id: inProgressId,
        status: "In Progress",
        issueCode: "ISSUE_UNRESOLVED_PROGRESS",
        targetEntityId: "conclusion-unresolved-progress",
      },
      {
        id: resolvedId,
        status: "Resolved",
        issueCode: "ISSUE_UNRESOLVED_RESOLVED",
        targetEntityId: "conclusion-unresolved-resolved",
      },
      {
        id: abandonedId,
        status: "Abandoned",
        issueCode: "ISSUE_UNRESOLVED_ABANDONED",
        targetEntityId: "conclusion-unresolved-abandoned",
      },
      {
        id: supersededId,
        status: "Superseded",
        issueCode: "ISSUE_UNRESOLVED_SUPERSEDED",
        targetEntityId: "conclusion-unresolved-superseded",
      },
    ] as const;

    try {
      for (const obligation of obligations) {
        await createResearchReconciliationObligationRecord({
          id: obligation.id,
          investigationId,
          issueCode: obligation.issueCode,
          targetEntityType: "Conclusion",
          targetEntityId: obligation.targetEntityId,
          remediationAction: "RepairReference",
          status: obligation.status,
          reason: `Testing ${obligation.status} unresolved retrieval semantics.`,
          createdAt,
          updatedAt,
        });
      }

      const unresolved =
        await getUnresolvedResearchReconciliationObligationRecords(
          investigationId,
        );

      expect(unresolved.map(({ id }) => id)).toEqual([
        openId,
        inProgressId,
      ]);
      expect(
        unresolved.every(
          ({ status }) => status === "Open" || status === "In Progress",
        ),
      ).toBe(true);
    } finally {
      for (const { id } of obligations) {
        await db
          .delete(researchReconciliationObligations)
          .where(eq(researchReconciliationObligations.id, id));
      }
    }
  });

  it("excludes terminal reconciliation obligation statuses from unresolved retrieval", async () => {
    const resolvedId = "reconciliation-obligation-terminal-resolved";
    const abandonedId = "reconciliation-obligation-terminal-abandoned";
    const supersededId = "reconciliation-obligation-terminal-superseded";

    const obligations = [
      {
        id: resolvedId,
        status: "Resolved",
        issueCode: "ISSUE_TERMINAL_RESOLVED",
        targetEntityId: "conclusion-terminal-resolved",
      },
      {
        id: abandonedId,
        status: "Abandoned",
        issueCode: "ISSUE_TERMINAL_ABANDONED",
        targetEntityId: "conclusion-terminal-abandoned",
      },
      {
        id: supersededId,
        status: "Superseded",
        issueCode: "ISSUE_TERMINAL_SUPERSEDED",
        targetEntityId: "conclusion-terminal-superseded",
      },
    ] as const;

    try {
      for (const obligation of obligations) {
        await createResearchReconciliationObligationRecord({
          id: obligation.id,
          investigationId,
          issueCode: obligation.issueCode,
          targetEntityType: "Conclusion",
          targetEntityId: obligation.targetEntityId,
          remediationAction: "RepairReference",
          status: obligation.status,
          reason: `Testing exclusion of ${obligation.status}.`,
          createdAt,
          updatedAt,
        });
      }

      const unresolved =
        await getUnresolvedResearchReconciliationObligationRecords(
          investigationId,
        );

      expect(
        unresolved.some(({ id }) =>
          [resolvedId, abandonedId, supersededId].includes(id),
        ),
      ).toBe(false);
    } finally {
      for (const { id } of obligations) {
        await db
          .delete(researchReconciliationObligations)
          .where(eq(researchReconciliationObligations.id, id));
      }
    }
  });

  it("returns unresolved obligations in deterministic creation order", async () => {
    const secondId = "reconciliation-obligation-unresolved-order-b";
    const firstId = "reconciliation-obligation-unresolved-order-a";

    try {
      await createResearchReconciliationObligationRecord({
        id: secondId,
        investigationId,
        issueCode: "ISSUE_UNRESOLVED_ORDER_B",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-unresolved-order-b",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Second unresolved obligation.",
        createdAt,
        updatedAt,
      });

      await createResearchReconciliationObligationRecord({
        id: firstId,
        investigationId,
        issueCode: "ISSUE_UNRESOLVED_ORDER_A",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-unresolved-order-a",
        remediationAction: "RepairReference",
        status: "In Progress",
        reason: "First unresolved obligation.",
        createdAt,
        updatedAt,
      });

      const unresolved =
        await getUnresolvedResearchReconciliationObligationRecords(
          investigationId,
        );

      const testObligations = unresolved.filter(
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
