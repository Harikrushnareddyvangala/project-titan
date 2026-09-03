import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createResearchExperimentRecord,
  getResearchExperimentRecord,
  pool,
} from "../../src/index.js";

import { researchEvidence } from "../../src/schema/evidence.js";
import { researchExperimentEvidence } from "../../src/schema/experimentEvidence.js";
import { researchExperimentFindings } from "../../src/schema/experimentFindings.js";
import { researchExperimentLifecycleEvents } from "../../src/schema/experiments.js";
import { researchFindings } from "../../src/schema/findings.js";
import { researchInvestigations } from "../../src/schema/investigations.js";
import { db } from "../../src/index.js";

describe("research experiment persistence", () => {
  beforeAll(async () => {
    await pool.query("SELECT 1");
  });

  afterAll(async () => {
    await pool.end();
  });

  it("creates and hydrates an experiment with relationships and lifecycle history", async () => {
    const investigationId = `test-investigation-${randomUUID()}`;
    const experimentId = `test-experiment-${randomUUID()}`;
    const evidenceId = `test-evidence-${randomUUID()}`;
    const findingId = `test-finding-${randomUUID()}`;
    const lifecycleId = `test-experiment-lifecycle-${randomUUID()}`;

    const createdAt = new Date("2026-09-03T03:00:00.000Z");
    const updatedAt = new Date("2026-09-03T03:05:00.000Z");
    const lifecycleTimestamp = new Date("2026-09-03T03:10:00.000Z");

    try {
      await db.insert(researchInvestigations).values({
        id: investigationId,
        title: "Experiment Persistence Test Investigation",
        objective: "Provide a parent investigation for experiment persistence",
        question: "Can an experiment be persisted and hydrated?",
        status: "active",
        description: null,
        repository: "project-titan",
        createdAt,
        updatedAt,
      });

      await db.insert(researchEvidence).values({
        id: evidenceId,
        type: "document",
        title: "Experiment Test Evidence",
        description: "Evidence used by the persistence integration test",
        reference: "test-reference",
        createdAt,
      });

      await db.insert(researchFindings).values({
        id: findingId,
        statement: "Experiment persistence hydration works",
        confidence: 0.95,
        createdAt,
        updatedAt,
      });

      await createResearchExperimentRecord({
        id: experimentId,
        investigationId,
        title: "Persistence Integration Test Experiment",
        objective: "Verify PostgreSQL experiment persistence",
        status: "Investigating",
        description: "Integration-test experiment",
        createdAt,
        updatedAt,
      });

      await db.insert(researchExperimentEvidence).values({
        experimentId,
        evidenceId,
      });

      await db.insert(researchExperimentFindings).values({
        experimentId,
        findingId,
      });

      await db.insert(researchExperimentLifecycleEvents).values({
        id: lifecycleId,
        experimentId,
        fromStatus: "Draft",
        toStatus: "Investigating",
        reason: "Persistence integration test",
        timestamp: lifecycleTimestamp,
      });

      const loaded = await getResearchExperimentRecord(experimentId);

      expect(loaded).toEqual({
        id: experimentId,
        investigationId,
        title: "Persistence Integration Test Experiment",
        objective: "Verify PostgreSQL experiment persistence",
        status: "Investigating",
        description: "Integration-test experiment",
        evidenceIds: [evidenceId],
        findingIds: [findingId],
        lifecycle: [
          {
            id: lifecycleId,
            from: "Draft",
            to: "Investigating",
            reason: "Persistence integration test",
            timestamp: lifecycleTimestamp,
          },
        ],
        createdAt,
        updatedAt,
      });
    } finally {
      await pool.query(
        "DELETE FROM research_investigation_evidence WHERE investigation_id = $1",
        [investigationId],
      );

      await pool.query(
        "DELETE FROM research_investigation_findings WHERE investigation_id = $1",
        [investigationId],
      );

      await pool.query(
        "DELETE FROM research_experiment_lifecycle_events WHERE experiment_id = $1",
        [experimentId],
      );

      await pool.query(
        "DELETE FROM research_experiment_evidence WHERE experiment_id = $1",
        [experimentId],
      );

      await pool.query(
        "DELETE FROM research_experiment_findings WHERE experiment_id = $1",
        [experimentId],
      );

      await pool.query(
        "DELETE FROM research_experiments WHERE id = $1",
        [experimentId],
      );

      await pool.query(
        "DELETE FROM research_evidence WHERE id = $1",
        [evidenceId],
      );

      await pool.query(
        "DELETE FROM research_findings WHERE id = $1",
        [findingId],
      );

      await pool.query(
        "DELETE FROM research_investigations WHERE id = $1",
        [investigationId],
      );
    }
  });

  it("returns null when an experiment does not exist", async () => {
    const id = `missing-experiment-${randomUUID()}`;

    const result = await getResearchExperimentRecord(id);

    expect(result).toBeNull();
  });
});
