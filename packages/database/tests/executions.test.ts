import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  createExecutionRecord,
  getExecutionRecord,
  persistExecutionLifecycleTransition,
  pool,
} from "../src/index.js";

describe("execution persistence", () => {
  beforeEach(async () => {
    await pool.query(
      "DELETE FROM execution_lifecycle_transitions",
    );

    await pool.query(
      "DELETE FROM executions",
    );
  });

  afterAll(async () => {
    await pool.end();
  });

  it("creates and retrieves an execution", async () => {
    const created = await createExecutionRecord({
      id: "execution-test-001",
      lifecycleState: "Running",
    });

    expect(created).toEqual({
      id: "execution-test-001",
      lifecycleState: "Running",
      startedAt: null,
      endedAt: null,
      lifecycle: [],
    });

    const retrieved = await getExecutionRecord("execution-test-001");

    expect(retrieved).toEqual(created);
  });

  it("persists temporal values", async () => {
    const startedAt = new Date("2026-09-06T10:00:00.000Z");
    const endedAt = new Date("2026-09-06T10:05:00.000Z");

    const created = await createExecutionRecord({
      id: "execution-test-002",
      lifecycleState: "Completed",
      startedAt,
      endedAt,
    });

    expect(created.startedAt).toEqual(startedAt);
    expect(created.endedAt).toEqual(endedAt);
  });

  it("returns null for an unknown execution", async () => {
    await expect(
      getExecutionRecord("execution-does-not-exist"),
    ).resolves.toBeNull();
  });

  it("hydrates lifecycle history", async () => {
    await createExecutionRecord({
      id: "execution-test-003",
      lifecycleState: "Completed",
    });

    await pool.query(
      `
        INSERT INTO execution_lifecycle_transitions
          (id, execution_id, from_state, to_state, reason, timestamp)
        VALUES
          ($1, $2, $3, $4, $5, $6)
      `,
      [
        "transition-test-001",
        "execution-test-003",
        "Running",
        "Completed",
        "work completed",
        "2026-09-06T10:05:00.000Z",
      ],
    );

    const execution = await getExecutionRecord("execution-test-003");

    expect(execution?.lifecycle).toEqual([
      {
        id: "transition-test-001",
        from: "Running",
        to: "Completed",
        reason: "work completed",
        timestamp: new Date("2026-09-06T10:05:00.000Z"),
      },
    ]);
  });

  it("persists a lifecycle transition and updates the execution atomically", async () => {
    await createExecutionRecord({
      id: "execution-test-005",
      lifecycleState: "Running",
      startedAt: new Date("2026-09-06T10:00:00.000Z"),
    });

    const transitioned = await persistExecutionLifecycleTransition({
      executionId: "execution-test-005",
      transitionId: "transition-test-005",
      from: "Running",
      to: "Completed",
      reason: "work completed",
      timestamp: new Date("2026-09-06T10:05:00.000Z"),
      endedAt: new Date("2026-09-06T10:05:00.000Z"),
    });

    expect(transitioned).toEqual({
      id: "execution-test-005",
      lifecycleState: "Completed",
      startedAt: new Date("2026-09-06T10:00:00.000Z"),
      endedAt: new Date("2026-09-06T10:05:00.000Z"),
      lifecycle: [
        {
          id: "transition-test-005",
          from: "Running",
          to: "Completed",
          reason: "work completed",
          timestamp: new Date("2026-09-06T10:05:00.000Z"),
        },
      ],
    });

    const retrieved = await getExecutionRecord("execution-test-005");

    expect(retrieved).toEqual(transitioned);
  });

  it("rolls back lifecycle persistence when the execution update fails", async () => {
    await createExecutionRecord({
      id: "execution-test-006",
      lifecycleState: "Running",
    });

    await expect(
      persistExecutionLifecycleTransition({
        executionId: "execution-does-not-exist",
        transitionId: "transition-test-006",
        from: "Running",
        to: "Completed",
        reason: "work completed",
        timestamp: new Date("2026-09-06T10:05:00.000Z"),
        endedAt: new Date("2026-09-06T10:05:00.000Z"),
      }),
    ).rejects.toThrow();

    const execution = await getExecutionRecord("execution-test-006");

    expect(execution).toEqual({
      id: "execution-test-006",
      lifecycleState: "Running",
      startedAt: null,
      endedAt: null,
      lifecycle: [],
    });

    const transitions = await pool.query(
      "SELECT COUNT(*)::int AS count FROM execution_lifecycle_transitions",
    );

    expect(transitions.rows[0]?.count).toBe(0);
  });

  it("rolls back execution creation when the insert fails", async () => {
    await createExecutionRecord({
      id: "execution-test-004",
      lifecycleState: "Running",
    });

    await expect(
      createExecutionRecord({
        id: "execution-test-004",
        lifecycleState: "Running",
      }),
    ).rejects.toThrow();

    const rows = await pool.query(
      "SELECT COUNT(*)::int AS count FROM executions WHERE id = $1",
      ["execution-test-004"],
    );

    expect(rows.rows[0]?.count).toBe(1);
  });
});
