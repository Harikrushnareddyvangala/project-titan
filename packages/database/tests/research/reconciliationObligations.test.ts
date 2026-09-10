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
