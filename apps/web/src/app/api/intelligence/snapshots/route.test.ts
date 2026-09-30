import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  UnauthenticatedRequestError: class UnauthenticatedRequestError extends Error {
    readonly status = 401;

    constructor(message = "Authentication required.") {
      super(message);
      this.name = "UnauthenticatedRequestError";
    }
  },
}));

const repositoryMocks = vi.hoisted(() => ({
  getIntelligenceSnapshots: vi.fn(),
  createIntelligenceSnapshot: vi.fn(),
}));

vi.mock("@/lib/server/auth/principal", () => authMocks);

vi.mock("@/lib/intelligence/serverSnapshotRepository", () => ({
  getIntelligenceSnapshots: repositoryMocks.getIntelligenceSnapshots,
  createIntelligenceSnapshot: repositoryMocks.createIntelligenceSnapshot,
}));

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

import {
  GET,
  POST,
} from "./route";

const mockedAuthenticateRequest = vi.mocked(authenticateRequest);
const {
  getIntelligenceSnapshots,
  createIntelligenceSnapshot,
} = repositoryMocks;

describe("/api/intelligence/snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedAuthenticateRequest.mockResolvedValue({
      provider: "cognito",
      subject: "test-subject",
    });
  });

  it("rejects unauthenticated GET requests", async () => {
    mockedAuthenticateRequest.mockRejectedValue(
      new UnauthenticatedRequestError(),
    );

    const response = await GET(
      new Request("http://localhost/api/intelligence/snapshots"),
    );

    expect(response.status).toBe(401);

    await expect(response.json()).resolves.toEqual({
      error: "Authentication required.",
    });

    expect(getIntelligenceSnapshots).not.toHaveBeenCalled();
  });

  it("returns snapshots", async () => {
    const snapshots = [
      {
        id: "snapshot-1",
        repository: "owner/repo",
        createdAt: "2026-09-29T10:00:00.000Z",
        analytics: {},
      },
    ];

    getIntelligenceSnapshots.mockResolvedValue(snapshots);

    const response = await GET(
      new Request("http://localhost/api/intelligence/snapshots"),
    );

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual({
      snapshots,
    });

    expect(getIntelligenceSnapshots).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when GET repository retrieval fails", async () => {
    getIntelligenceSnapshots.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await GET(
      new Request("http://localhost/api/intelligence/snapshots"),
    );

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence snapshot retrieval failed.",
    });
  });

  it("rejects unauthenticated POST requests", async () => {
    mockedAuthenticateRequest.mockRejectedValue(
      new UnauthenticatedRequestError(),
    );

    const response = await POST(
      new Request("http://localhost/api/intelligence/snapshots", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(401);

    expect(createIntelligenceSnapshot).not.toHaveBeenCalled();
  });

  it("rejects an invalid snapshot", async () => {
    const response = await POST(
      new Request("http://localhost/api/intelligence/snapshots", {
        method: "POST",
        body: JSON.stringify({
          snapshot: {
            id: "snapshot-1",
          },
        }),
      }),
    );

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid intelligence snapshot.",
    });

    expect(createIntelligenceSnapshot).not.toHaveBeenCalled();
  });

  it("creates an intelligence snapshot", async () => {
    const snapshot = {
      id: "snapshot-1",
      repository: "owner/repo",
      createdAt: "2026-09-29T10:00:00.000Z",
      analytics: {},
    };

    createIntelligenceSnapshot.mockResolvedValue(snapshot);

    const response = await POST(
      new Request("http://localhost/api/intelligence/snapshots", {
        method: "POST",
        body: JSON.stringify({ snapshot }),
      }),
    );

    expect(response.status).toBe(201);

    await expect(response.json()).resolves.toEqual(snapshot);

    expect(createIntelligenceSnapshot).toHaveBeenCalledTimes(1);
    expect(createIntelligenceSnapshot).toHaveBeenCalledWith(snapshot);
  });

  it("returns 500 when POST repository creation fails", async () => {
    const snapshot = {
      id: "snapshot-1",
      repository: "owner/repo",
      createdAt: "2026-09-29T10:00:00.000Z",
      analytics: {},
    };

    createIntelligenceSnapshot.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await POST(
      new Request("http://localhost/api/intelligence/snapshots", {
        method: "POST",
        body: JSON.stringify({ snapshot }),
      }),
    );

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence snapshot creation failed.",
    });
  });
});
