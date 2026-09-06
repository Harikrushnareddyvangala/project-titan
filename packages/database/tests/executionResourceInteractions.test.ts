import { randomUUID } from "node:crypto";

import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import {
  createExecutionRecord,
} from "../src/executions.js";
import {
  createExecutionResourceInteractionRecord,
  getExecutionResourceInteractionRecord,
} from "../src/executionResourceInteractions.js";
import { db } from "../src/client.js";

function executionId(): string {
  return `test-execution-${randomUUID()}`;
}

function interactionId(): string {
  return `test-interaction-${randomUUID()}`;
}

describe("execution resource interaction persistence", () => {
  it("creates and retrieves a resource-target interaction", async () => {
    const execution = await createExecutionRecord({
      id: executionId(),
      lifecycleState: "Running",
    });

    const created = await createExecutionResourceInteractionRecord({
      id: interactionId(),
      executionId: execution.id,
      targetKind: "resource",
      targetResourceId: "resource-001",
      targetResourceType: "dataset",
      targetResourceNamespace: "titan.data",
      operationNamespace: "titan.execution",
      operationType: "read",
      createdAt: new Date("2026-09-01T10:00:00.000Z"),
    });

    const retrieved = await getExecutionResourceInteractionRecord(created.id);

    expect(retrieved).toEqual(created);
    expect(retrieved?.targetKind).toBe("resource");
    expect(retrieved?.targetRevisionVersion).toBeNull();
    expect(retrieved?.targetRevisionCreatedAt).toBeNull();
  });

  it("creates and retrieves a revision-target interaction", async () => {
    const execution = await createExecutionRecord({
      id: executionId(),
      lifecycleState: "Running",
    });

    const revisionCreatedAt = new Date("2026-08-31T12:00:00.000Z");

    const created = await createExecutionResourceInteractionRecord({
      id: interactionId(),
      executionId: execution.id,
      targetKind: "revision",
      targetResourceId: "resource-002",
      targetResourceType: "dataset",
      targetResourceNamespace: "titan.data",
      targetRevisionVersion: "v7",
      targetRevisionCreatedAt: revisionCreatedAt,
      operationNamespace: "titan.execution",
      operationType: "read",
      createdAt: new Date("2026-09-01T10:05:00.000Z"),
    });

    const retrieved = await getExecutionResourceInteractionRecord(created.id);

    expect(retrieved).toEqual(created);
    expect(retrieved?.targetKind).toBe("revision");
    expect(retrieved?.targetRevisionVersion).toBe("v7");
    expect(retrieved?.targetRevisionCreatedAt).toEqual(revisionCreatedAt);
  });

  it("preserves revision creation time separately from interaction creation time", async () => {
    const execution = await createExecutionRecord({
      id: executionId(),
      lifecycleState: "Running",
    });

    const revisionCreatedAt = new Date("2026-08-20T08:00:00.000Z");
    const interactionCreatedAt = new Date("2026-09-01T10:00:00.000Z");

    const created = await createExecutionResourceInteractionRecord({
      id: interactionId(),
      executionId: execution.id,
      targetKind: "revision",
      targetResourceId: "resource-003",
      targetResourceType: "model",
      targetResourceNamespace: "titan.ml",
      targetRevisionVersion: "2026.08",
      targetRevisionCreatedAt: revisionCreatedAt,
      operationNamespace: "titan.execution",
      operationType: "consume",
      createdAt: interactionCreatedAt,
    });

    expect(created.targetRevisionCreatedAt).toEqual(revisionCreatedAt);
    expect(created.createdAt).toEqual(interactionCreatedAt);
    expect(created.targetRevisionCreatedAt).not.toEqual(created.createdAt);
  });

  it("allows repeated equivalent interactions with distinct identities", async () => {
    const execution = await createExecutionRecord({
      id: executionId(),
      lifecycleState: "Running",
    });

    const base = {
      executionId: execution.id,
      targetKind: "resource" as const,
      targetResourceId: "resource-repeat",
      targetResourceType: "dataset",
      targetResourceNamespace: "titan.data",
      operationNamespace: "titan.execution",
      operationType: "read",
      createdAt: new Date("2026-09-01T10:00:00.000Z"),
    };

    const first = await createExecutionResourceInteractionRecord({
      id: interactionId(),
      ...base,
    });

    const second = await createExecutionResourceInteractionRecord({
      id: interactionId(),
      ...base,
    });

    expect(second.id).not.toBe(first.id);

    expect(
      await getExecutionResourceInteractionRecord(first.id),
    ).toEqual(first);

    expect(
      await getExecutionResourceInteractionRecord(second.id),
    ).toEqual(second);
  });

  it("rejects an interaction for an unknown execution", async () => {
    await expect(
      createExecutionResourceInteractionRecord({
        id: interactionId(),
        executionId: executionId(),
        targetKind: "resource",
        targetResourceId: "resource-unknown-execution",
        targetResourceType: "dataset",
        targetResourceNamespace: "titan.data",
        operationNamespace: "titan.execution",
        operationType: "read",
        createdAt: new Date("2026-09-01T10:00:00.000Z"),
      }),
    ).rejects.toThrow();
  });

  it("rejects duplicate interaction identities", async () => {
    const execution = await createExecutionRecord({
      id: executionId(),
      lifecycleState: "Running",
    });

    const id = interactionId();

    await createExecutionResourceInteractionRecord({
      id,
      executionId: execution.id,
      targetKind: "resource",
      targetResourceId: "resource-duplicate",
      targetResourceType: "dataset",
      targetResourceNamespace: "titan.data",
      operationNamespace: "titan.execution",
      operationType: "read",
      createdAt: new Date("2026-09-01T10:00:00.000Z"),
    });

    await expect(
      createExecutionResourceInteractionRecord({
        id,
        executionId: execution.id,
        targetKind: "resource",
        targetResourceId: "resource-duplicate",
        targetResourceType: "dataset",
        targetResourceNamespace: "titan.data",
        operationNamespace: "titan.execution",
        operationType: "read",
        createdAt: new Date("2026-09-01T10:01:00.000Z"),
      }),
    ).rejects.toThrow();

    const retrieved = await getExecutionResourceInteractionRecord(id);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.createdAt).toEqual(
      new Date("2026-09-01T10:00:00.000Z"),
    );
  });

  it("rejects invalid target discriminator combinations at the database boundary", async () => {
    const execution = await createExecutionRecord({
      id: executionId(),
      lifecycleState: "Running",
    });

    await expect(
      db.execute(sql`
        INSERT INTO execution_resource_interactions (
          id,
          execution_id,
          target_kind,
          target_resource_id,
          target_resource_type,
          target_resource_namespace,
          target_revision_version,
          target_revision_created_at,
          operation_namespace,
          operation_type,
          created_at
        )
        VALUES (
          ${interactionId()},
          ${execution.id},
          'resource',
          'resource-invalid',
          'dataset',
          'titan.data',
          'should-not-exist',
          ${new Date("2026-09-01T10:00:00.000Z")},
          'titan.execution',
          'read',
          ${new Date("2026-09-01T10:00:00.000Z")}
        )
      `),
    ).rejects.toThrow();
  });
});
