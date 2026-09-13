import { eq } from "drizzle-orm";

import { db } from "../../src/client.js";
import {
  researchInvestigations,
  researchReconciliationObligations,
} from "../../src/schema/index.js";
import {
  createResearchReconciliationObligationRecord,
  ensureActiveResearchReconciliationObligationRecord,
  getResearchReconciliationObligationRecord,
  getResearchReconciliationObligationRecords,
  getResearchReconciliationObligationRecordsByInvestigation,
  getResearchReconciliationObligationRecordsByTarget,
  getUnresolvedResearchReconciliationObligationRecords,
  getUnresolvedResearchReconciliationObligationRecordsByInvestigation,
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

  it("creates an active reconciliation obligation when no active identity exists", async () => {
    const obligation = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-create",
      investigationId,
      issueCode: "ISSUE_ENSURE_CREATE",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-create",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Create the canonical active obligation.",
      createdAt,
      updatedAt,
    });

    expect(obligation).toMatchObject({
      id: "reconciliation-obligation-ensure-create",
      investigationId,
      issueCode: "ISSUE_ENSURE_CREATE",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-create",
      status: "Open",
    });
  });

  it("returns the existing Open obligation for the same active identity", async () => {
    const existing = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-open-existing",
      investigationId,
      issueCode: "ISSUE_ENSURE_OPEN",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-open",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Existing Open obligation.",
      createdAt,
      updatedAt,
    });

    const result = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-open-candidate",
      investigationId,
      issueCode: "ISSUE_ENSURE_OPEN",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-open",
      remediationAction: "DifferentAction",
      status: "Open",
      reason: "Candidate should converge on the existing obligation.",
      createdAt: new Date(createdAt.getTime() + 60_000),
      updatedAt: new Date(updatedAt.getTime() + 60_000),
    });

    expect(result).toEqual(existing);

    const matching = await getResearchReconciliationObligationRecordsByTarget(
      "Conclusion",
      "conclusion-ensure-open",
    );

    expect(matching.map(({ id }) => id)).toEqual([
      "reconciliation-obligation-ensure-open-existing",
    ]);
  });

  it("returns the existing In Progress obligation for the same active identity", async () => {
    const existing = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-progress-existing",
      investigationId,
      issueCode: "ISSUE_ENSURE_PROGRESS",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-progress",
      remediationAction: "RepairReference",
      status: "In Progress",
      reason: "Existing In Progress obligation.",
      createdAt,
      updatedAt,
    });

    const result = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-progress-candidate",
      investigationId,
      issueCode: "ISSUE_ENSURE_PROGRESS",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-progress",
      remediationAction: "DifferentAction",
      status: "In Progress",
      reason: "Candidate should converge on the existing obligation.",
      createdAt: new Date(createdAt.getTime() + 60_000),
      updatedAt: new Date(updatedAt.getTime() + 60_000),
    });

    expect(result).toEqual(existing);

    const matching = await getResearchReconciliationObligationRecordsByTarget(
      "Conclusion",
      "conclusion-ensure-progress",
    );

    expect(matching.map(({ id }) => id)).toEqual([
      "reconciliation-obligation-ensure-progress-existing",
    ]);
  });

  it("creates a new active obligation when only a terminal obligation has the same identity", async () => {
    const terminal = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-terminal",
      investigationId,
      issueCode: "ISSUE_ENSURE_TERMINAL",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-terminal",
      remediationAction: "RepairReference",
      status: "Resolved",
      reason: "Historical resolved obligation.",
      createdAt,
      updatedAt,
      resolvedAt: updatedAt,
    });

    const result = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-terminal-new",
      investigationId,
      issueCode: "ISSUE_ENSURE_TERMINAL",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-terminal",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "New active obligation after prior resolution.",
      createdAt: new Date(createdAt.getTime() + 60_000),
      updatedAt: new Date(updatedAt.getTime() + 60_000),
    });

    expect(terminal.status).toBe("Resolved");
    expect(result).toMatchObject({
      id: "reconciliation-obligation-ensure-terminal-new",
      status: "Open",
    });

    const matching = await getResearchReconciliationObligationRecordsByTarget(
      "Conclusion",
      "conclusion-ensure-terminal",
    );

    expect(matching.map(({ id, status }) => ({ id, status }))).toEqual([
      {
        id: "reconciliation-obligation-ensure-terminal",
        status: "Resolved",
      },
      {
        id: "reconciliation-obligation-ensure-terminal-new",
        status: "Open",
      },
    ]);
  });

  it("creates a new active obligation when only an Abandoned obligation has the same identity", async () => {
    const terminal = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-abandoned",
      investigationId,
      issueCode: "ISSUE_ENSURE_ABANDONED",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-abandoned",
      remediationAction: "RepairReference",
      status: "Abandoned",
      reason: "Historical abandoned obligation.",
      createdAt,
      updatedAt,
    });

    const result = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-abandoned-new",
      investigationId,
      issueCode: "ISSUE_ENSURE_ABANDONED",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-abandoned",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "New active obligation after prior abandonment.",
      createdAt: new Date(createdAt.getTime() + 60_000),
      updatedAt: new Date(updatedAt.getTime() + 60_000),
    });

    expect(terminal.status).toBe("Abandoned");
    expect(result).toMatchObject({
      id: "reconciliation-obligation-ensure-abandoned-new",
      status: "Open",
    });
  });

  it("creates a new active obligation when only a Superseded obligation has the same identity", async () => {
    const terminal = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-superseded",
      investigationId,
      issueCode: "ISSUE_ENSURE_SUPERSEDED",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-superseded",
      remediationAction: "RepairReference",
      status: "Superseded",
      reason: "Historical superseded obligation.",
      createdAt,
      updatedAt,
    });

    const result = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-superseded-new",
      investigationId,
      issueCode: "ISSUE_ENSURE_SUPERSEDED",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-superseded",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "New active obligation after prior supersession.",
      createdAt: new Date(createdAt.getTime() + 60_000),
      updatedAt: new Date(updatedAt.getTime() + 60_000),
    });

    expect(terminal.status).toBe("Superseded");
    expect(result).toMatchObject({
      id: "reconciliation-obligation-ensure-superseded-new",
      status: "Open",
    });
  });

  it("creates a new active obligation when the targetEntityId differs", async () => {
    const existing = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-different-target-id-existing",
      investigationId,
      issueCode: "ISSUE_ENSURE_IDENTITY",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-identity-a",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Existing obligation for target A.",
      createdAt,
      updatedAt,
    });

    const result = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-different-target-id-new",
      investigationId,
      issueCode: "ISSUE_ENSURE_IDENTITY",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-identity-b",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Different target must have a distinct active obligation.",
      createdAt: new Date(createdAt.getTime() + 60_000),
      updatedAt: new Date(updatedAt.getTime() + 60_000),
    });

    expect(existing.id).not.toBe(result.id);
    expect(result).toMatchObject({
      id: "reconciliation-obligation-ensure-different-target-id-new",
      issueCode: "ISSUE_ENSURE_IDENTITY",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-identity-b",
      status: "Open",
    });
  });

  it("creates a new active obligation when the issueCode differs", async () => {
    const existing = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-different-issue-existing",
      investigationId,
      issueCode: "ISSUE_ENSURE_IDENTITY_A",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-issue",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Existing obligation for issue A.",
      createdAt,
      updatedAt,
    });

    const result = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-different-issue-new",
      investigationId,
      issueCode: "ISSUE_ENSURE_IDENTITY_B",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-issue",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Different issue must have a distinct active obligation.",
      createdAt: new Date(createdAt.getTime() + 60_000),
      updatedAt: new Date(updatedAt.getTime() + 60_000),
    });

    expect(existing.id).not.toBe(result.id);
    expect(result).toMatchObject({
      id: "reconciliation-obligation-ensure-different-issue-new",
      issueCode: "ISSUE_ENSURE_IDENTITY_B",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-issue",
      status: "Open",
    });
  });

  it("creates a new active obligation when the targetEntityType differs", async () => {
    const existing = await createResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-different-type-existing",
      investigationId,
      issueCode: "ISSUE_ENSURE_IDENTITY_TYPE",
      targetEntityType: "Conclusion",
      targetEntityId: "shared-entity-id",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Existing obligation for a conclusion target.",
      createdAt,
      updatedAt,
    });

    const result = await ensureActiveResearchReconciliationObligationRecord({
      id: "reconciliation-obligation-ensure-different-type-new",
      investigationId,
      issueCode: "ISSUE_ENSURE_IDENTITY_TYPE",
      targetEntityType: "Finding",
      targetEntityId: "shared-entity-id",
      remediationAction: "RepairReference",
      status: "Open",
      reason: "Different target type must have a distinct active obligation.",
      createdAt: new Date(createdAt.getTime() + 60_000),
      updatedAt: new Date(updatedAt.getTime() + 60_000),
    });

    expect(existing.id).not.toBe(result.id);
    expect(result).toMatchObject({
      id: "reconciliation-obligation-ensure-different-type-new",
      issueCode: "ISSUE_ENSURE_IDENTITY_TYPE",
      targetEntityType: "Finding",
      targetEntityId: "shared-entity-id",
      status: "Open",
    });
  });

  it("converges concurrent duplicate creation on one active obligation", async () => {
    const identity = {
      investigationId,
      issueCode: "ISSUE_ENSURE_CONCURRENT",
      targetEntityType: "Conclusion",
      targetEntityId: "conclusion-ensure-concurrent",
    };

    const [first, second] = await Promise.all([
      ensureActiveResearchReconciliationObligationRecord({
        id: "reconciliation-obligation-ensure-concurrent-a",
        ...identity,
        remediationAction: "RepairReference",
        status: "Open",
        reason: "First concurrent candidate.",
        createdAt,
        updatedAt,
      }),
      ensureActiveResearchReconciliationObligationRecord({
        id: "reconciliation-obligation-ensure-concurrent-b",
        ...identity,
        remediationAction: "RepairScope",
        status: "Open",
        reason: "Second concurrent candidate.",
        createdAt: new Date(createdAt.getTime() + 60_000),
        updatedAt: new Date(updatedAt.getTime() + 60_000),
      }),
    ]);

    expect(first.id).toBe(second.id);

    const matching = await getResearchReconciliationObligationRecordsByTarget(
      identity.targetEntityType,
      identity.targetEntityId,
    );

    const activeMatching = matching.filter(
      ({ investigationId: returnedInvestigationId, issueCode, status }) =>
        returnedInvestigationId === identity.investigationId &&
        issueCode === identity.issueCode &&
        (status === "Open" || status === "In Progress"),
    );

    expect(activeMatching).toHaveLength(1);
    expect(activeMatching[0]?.id).toBe(first.id);
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

  it("retrieves only obligations belonging to the requested target", async () => {
    const targetEntityType = "Conclusion";
    const targetEntityId = "conclusion-target-scoped";
    const matchingId = "reconciliation-obligation-target-match";
    const otherEntityId = "conclusion-target-other";
    const otherId = "reconciliation-obligation-target-other";
    const otherTypeObligationId = "reconciliation-obligation-target-other-type";

    try {
      await createResearchReconciliationObligationRecord({
        id: matchingId,
        investigationId,
        issueCode: "ISSUE_TARGET_MATCH",
        targetEntityType,
        targetEntityId,
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Matching target.",
        createdAt,
        updatedAt,
      });

      await createResearchReconciliationObligationRecord({
        id: otherId,
        investigationId,
        issueCode: "ISSUE_TARGET_OTHER",
        targetEntityType,
        targetEntityId: otherEntityId,
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Different target entity.",
        createdAt,
        updatedAt,
      });

      await createResearchReconciliationObligationRecord({
        id: otherTypeObligationId,
        investigationId,
        issueCode: "ISSUE_TARGET_OTHER_TYPE",
        targetEntityType: "Finding",
        targetEntityId: targetEntityId,
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Different target entity type.",
        createdAt,
        updatedAt,
      });

      const obligations = await getResearchReconciliationObligationRecordsByTarget(
        targetEntityType,
        targetEntityId,
      );

      expect(obligations.map(({ id }) => id)).toEqual([matchingId]);
    } finally {
      await db
        .delete(researchReconciliationObligations)
        .where(eq(researchReconciliationObligations.id, matchingId));

      await db
        .delete(researchReconciliationObligations)
        .where(eq(researchReconciliationObligations.id, otherId));

      await db
        .delete(researchReconciliationObligations)
        .where(eq(researchReconciliationObligations.id, otherTypeObligationId));
    }
  });

  it("includes all lifecycle statuses for a requested target", async () => {
    const targetEntityType = "Conclusion";
    const targetEntityId = "conclusion-target-statuses";
    const statuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Abandoned",
      "Superseded",
    ] as const;

    const obligationIds = statuses.map(
      (status) => `reconciliation-obligation-target-status-${status
        .toLowerCase()
        .replace(" ", "-")}`,
    );

    try {
      for (const [index, status] of statuses.entries()) {
        await createResearchReconciliationObligationRecord({
          id: obligationIds[index],
          investigationId,
          issueCode: `ISSUE_TARGET_STATUS_${index}`,
          targetEntityType,
          targetEntityId,
          remediationAction: "RepairReference",
          status,
          reason: `Target lifecycle status: ${status}.`,
          createdAt: new Date(createdAt.getTime() + index * 60_000),
          updatedAt: new Date(updatedAt.getTime() + index * 60_000),
          resolvedAt: status === "Resolved"
            ? new Date(updatedAt.getTime() + index * 60_000)
            : undefined,
        });
      }

      const obligations = await getResearchReconciliationObligationRecordsByTarget(
        targetEntityType,
        targetEntityId,
      );

      expect(obligations.map(({ status }) => status)).toEqual([...statuses]);
    } finally {
      for (const id of obligationIds) {
        await db
          .delete(researchReconciliationObligations)
          .where(eq(researchReconciliationObligations.id, id));
      }
    }
  });

  it("retrieves target obligations in deterministic creation order", async () => {
    const targetEntityType = "Conclusion";
    const targetEntityId = "conclusion-target-order";
    const firstId = "reconciliation-obligation-target-order-a";
    const secondId = "reconciliation-obligation-target-order-b";

    try {
      await createResearchReconciliationObligationRecord({
        id: secondId,
        investigationId,
        issueCode: "ISSUE_TARGET_ORDER_B",
        targetEntityType,
        targetEntityId,
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Second target obligation.",
        createdAt,
        updatedAt,
      });

      await createResearchReconciliationObligationRecord({
        id: firstId,
        investigationId,
        issueCode: "ISSUE_TARGET_ORDER_A",
        targetEntityType,
        targetEntityId,
        remediationAction: "RepairReference",
        status: "In Progress",
        reason: "First target obligation.",
        createdAt,
        updatedAt,
      });

      const obligations = await getResearchReconciliationObligationRecordsByTarget(
        targetEntityType,
        targetEntityId,
      );

      expect(obligations.map(({ id }) => id)).toEqual([firstId, secondId]);
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
        await getUnresolvedResearchReconciliationObligationRecordsByInvestigation(
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
        await getUnresolvedResearchReconciliationObligationRecordsByInvestigation(
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

  it("retrieves unresolved obligations across investigations", async () => {
    const otherInvestigationId =
      "test-reconciliation-obligation-global-other-investigation";
    const firstId = "reconciliation-obligation-global-open";
    const secondId = "reconciliation-obligation-global-progress";

    await db.insert(researchInvestigations).values({
      id: otherInvestigationId,
      title: "Other Global Reconciliation Test Investigation",
      objective: "Test global unresolved retrieval",
      question: "Does global retrieval span investigations?",
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
        issueCode: "ISSUE_GLOBAL_OPEN",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-global-open",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Global unresolved open obligation.",
        createdAt,
        updatedAt,
      });

      await createResearchReconciliationObligationRecord({
        id: secondId,
        investigationId: otherInvestigationId,
        issueCode: "ISSUE_GLOBAL_PROGRESS",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-global-progress",
        remediationAction: "RepairReference",
        status: "In Progress",
        reason: "Global unresolved in-progress obligation.",
        createdAt: new Date("2026-09-10T03:10:00.000Z"),
        updatedAt: new Date("2026-09-10T03:10:00.000Z"),
      });

      const unresolved =
        await getUnresolvedResearchReconciliationObligationRecords();

      const testObligations = unresolved.filter(
        ({ id }) => id === firstId || id === secondId,
      );

      expect(testObligations.map(({ id }) => id)).toEqual([
        firstId,
        secondId,
      ]);
      expect(
        testObligations.every(
          ({ status }) => status === "Open" || status === "In Progress",
        ),
      ).toBe(true);
      expect(
        testObligations.some(
          ({ investigationId: returnedInvestigationId }) =>
            returnedInvestigationId === investigationId,
        ),
      ).toBe(true);
      expect(
        testObligations.some(
          ({ investigationId: returnedInvestigationId }) =>
            returnedInvestigationId === otherInvestigationId,
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
        .delete(researchInvestigations)
        .where(eq(researchInvestigations.id, otherInvestigationId));
    }
  });

  it("excludes terminal statuses from global unresolved retrieval", async () => {
    const resolvedId = "reconciliation-obligation-global-resolved";
    const abandonedId = "reconciliation-obligation-global-abandoned";
    const supersededId = "reconciliation-obligation-global-superseded";

    const obligations = [
      {
        id: resolvedId,
        status: "Resolved",
      },
      {
        id: abandonedId,
        status: "Abandoned",
      },
      {
        id: supersededId,
        status: "Superseded",
      },
    ] as const;

    try {
      for (const obligation of obligations) {
        await createResearchReconciliationObligationRecord({
          id: obligation.id,
          investigationId,
          issueCode: `ISSUE_GLOBAL_${obligation.status.replace(" ", "_")}`,
          targetEntityType: "Conclusion",
          targetEntityId: `conclusion-global-${obligation.status.toLowerCase().replace(" ", "-")}`,
          remediationAction: "RepairReference",
          status: obligation.status,
          reason: `Testing global exclusion of ${obligation.status}.`,
          createdAt,
          updatedAt,
        });
      }

      const unresolved =
        await getUnresolvedResearchReconciliationObligationRecords();

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

  it("returns global unresolved obligations in deterministic creation order", async () => {
    const secondId = "reconciliation-obligation-global-order-b";
    const firstId = "reconciliation-obligation-global-order-a";

    try {
      await createResearchReconciliationObligationRecord({
        id: secondId,
        investigationId,
        issueCode: "ISSUE_GLOBAL_ORDER_B",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-global-order-b",
        remediationAction: "RepairReference",
        status: "Open",
        reason: "Second global unresolved obligation.",
        createdAt,
        updatedAt,
      });

      await createResearchReconciliationObligationRecord({
        id: firstId,
        investigationId,
        issueCode: "ISSUE_GLOBAL_ORDER_A",
        targetEntityType: "Conclusion",
        targetEntityId: "conclusion-global-order-a",
        remediationAction: "RepairReference",
        status: "In Progress",
        reason: "First global unresolved obligation.",
        createdAt,
        updatedAt,
      });

      const unresolved =
        await getUnresolvedResearchReconciliationObligationRecords();

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
        await getUnresolvedResearchReconciliationObligationRecordsByInvestigation(
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
