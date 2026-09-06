import { beforeEach, describe, expect, it } from "vitest";

import {
  createExecutionActorParticipationRecord,
  getExecutionActorParticipationRecord,
} from "../src/executionActorParticipations.js";
import { pool } from "../src/client.js";

describe("execution actor participation persistence", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM execution_actor_participations");
    await pool.query("DELETE FROM executions");
  });

  it("creates and retrieves a participation", async () => {
    await pool.query(
      `
        INSERT INTO executions (
          id,
          lifecycle_state
        )
        VALUES ($1, $2)
      `,
      ["execution-participation-test", "Running"],
    );

    const created = await createExecutionActorParticipationRecord({
      id: "participation-test",
      executionId: "execution-participation-test",
      actorId: "actor-test",
      roleNamespace: "titan.execution",
      roleType: "executor",
      createdAt: new Date("2026-09-06T10:00:00.000Z"),
    });

    expect(created).toEqual({
      id: "participation-test",
      executionId: "execution-participation-test",
      actorId: "actor-test",
      roleNamespace: "titan.execution",
      roleType: "executor",
      createdAt: new Date("2026-09-06T10:00:00.000Z"),
    });

    await expect(
      getExecutionActorParticipationRecord("participation-test"),
    ).resolves.toEqual(created);
  });

  it("returns null for an unknown participation", async () => {
    await expect(
      getExecutionActorParticipationRecord("missing-participation"),
    ).resolves.toBeNull();
  });

  it("preserves distinct participation assertion identities", async () => {
    await pool.query(
      `
        INSERT INTO executions (
          id,
          lifecycle_state
        )
        VALUES ($1, $2)
      `,
      ["execution-multiplicity-test", "Running"],
    );

    const first = await createExecutionActorParticipationRecord({
      id: "participation-one",
      executionId: "execution-multiplicity-test",
      actorId: "actor-test",
      roleNamespace: "titan.execution",
      roleType: "executor",
      createdAt: new Date("2026-09-06T10:00:00.000Z"),
    });

    const second = await createExecutionActorParticipationRecord({
      id: "participation-two",
      executionId: "execution-multiplicity-test",
      actorId: "actor-test",
      roleNamespace: "titan.execution",
      roleType: "executor",
      createdAt: new Date("2026-09-06T10:01:00.000Z"),
    });

    expect(first.id).toBe("participation-one");
    expect(second.id).toBe("participation-two");

    const result = await pool.query(
      `
        SELECT COUNT(*)::int AS count
        FROM execution_actor_participations
        WHERE execution_id = $1
      `,
      ["execution-multiplicity-test"],
    );

    expect(result.rows[0].count).toBe(2);
  });

  it("rejects participation for an unknown execution", async () => {
    await expect(
      createExecutionActorParticipationRecord({
        id: "orphan-participation",
        executionId: "missing-execution",
        actorId: "actor-test",
        roleNamespace: "titan.execution",
        roleType: "executor",
        createdAt: new Date("2026-09-06T10:00:00.000Z"),
      }),
    ).rejects.toThrow();
  });

  it("rejects duplicate participation assertion identity", async () => {
    await pool.query(
      `
        INSERT INTO executions (
          id,
          lifecycle_state
        )
        VALUES ($1, $2)
      `,
      ["execution-duplicate-test", "Running"],
    );

    const input = {
      id: "duplicate-participation",
      executionId: "execution-duplicate-test",
      actorId: "actor-test",
      roleNamespace: "titan.execution",
      roleType: "executor",
      createdAt: new Date("2026-09-06T10:00:00.000Z"),
    };

    await createExecutionActorParticipationRecord(input);

    await expect(
      createExecutionActorParticipationRecord(input),
    ).rejects.toThrow();

    const result = await pool.query(
      `
        SELECT COUNT(*)::int AS count
        FROM execution_actor_participations
        WHERE id = $1
      `,
      ["duplicate-participation"],
    );

    expect(result.rows[0].count).toBe(1);
  });
});
