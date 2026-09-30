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
  getIntelligenceSnapshot: vi.fn(),
  deleteIntelligenceSnapshot: vi.fn(),
}));

vi.mock("@/lib/server/auth/principal", () => authMocks);

vi.mock("@/lib/intelligence/serverSnapshotRepository", () => ({
  getIntelligenceSnapshot: repositoryMocks.getIntelligenceSnapshot,
  deleteIntelligenceSnapshot: repositoryMocks.deleteIntelligenceSnapshot,
}));

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

import { DELETE, GET } from "./route";

const mockedAuthenticateRequest = vi.mocked(authenticateRequest);
const {
  getIntelligenceSnapshot,
  deleteIntelligenceSnapshot,
} = repositoryMocks;

describe("GET /api/intelligence/snapshots/[snapshotId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedAuthenticateRequest.mockResolvedValue({
      provider: "cognito",
      subject: "test-subject",
    });
  });

  it("rejects an unauthenticated request before reaching the repository", async () => {
    mockedAuthenticateRequest.mockRejectedValue(
      new UnauthenticatedRequestError(),
    );

    const response = await GET(
      new Request(
        "http://localhost/api/intelligence/snapshots/snapshot-1",
      ),
      {
        params: Promise.resolve({
          snapshotId: "snapshot-1",
        }),
      },
    );

    expect(response.status).toBe(401);

    await expect(response.json()).resolves.toEqual({
      error: "Authentication required.",
    });

    expect(getIntelligenceSnapshot).not.toHaveBeenCalled();
  });

  it("rejects a blank snapshot id", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/intelligence/snapshots/%20%20",
      ),
      {
        params: Promise.resolve({
          snapshotId: "  ",
        }),
      },
    );

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid intelligence snapshot.",
    });

    expect(getIntelligenceSnapshot).not.toHaveBeenCalled();
  });

  it("returns the requested snapshot", async () => {
    const snapshot = {
      id: "snapshot-1",
      repository: "owner/repo",
      createdAt: "2026-09-29T10:00:00.000Z",
      analytics: {},
    };

    getIntelligenceSnapshot.mockResolvedValue(snapshot);

    const response = await GET(
      new Request(
        "http://localhost/api/intelligence/snapshots/snapshot-1",
      ),
      {
        params: Promise.resolve({
          snapshotId: "snapshot-1",
        }),
      },
    );

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual(snapshot);

    expect(getIntelligenceSnapshot).toHaveBeenCalledTimes(1);
    expect(getIntelligenceSnapshot).toHaveBeenCalledWith("snapshot-1");
  });

  it("trims the snapshot id before repository lookup", async () => {
    const snapshot = {
      id: "snapshot-1",
      repository: "owner/repo",
      createdAt: "2026-09-29T10:00:00.000Z",
      analytics: {},
    };

    getIntelligenceSnapshot.mockResolvedValue(snapshot);

    const response = await GET(
      new Request(
        "http://localhost/api/intelligence/snapshots/%20snapshot-1%20",
      ),
      {
        params: Promise.resolve({
          snapshotId: "  snapshot-1  ",
        }),
      },
    );

    expect(response.status).toBe(200);

    expect(getIntelligenceSnapshot).toHaveBeenCalledWith("snapshot-1");
  });

  it("returns 404 when the snapshot does not exist", async () => {
    getIntelligenceSnapshot.mockResolvedValue(null);

    const response = await GET(
      new Request(
        "http://localhost/api/intelligence/snapshots/missing",
      ),
      {
        params: Promise.resolve({
          snapshotId: "missing",
        }),
      },
    );

    expect(response.status).toBe(404);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence snapshot not found.",
    });
  });

  it("returns 500 when repository retrieval fails", async () => {
    getIntelligenceSnapshot.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await GET(
      new Request(
        "http://localhost/api/intelligence/snapshots/snapshot-1",
      ),
      {
        params: Promise.resolve({
          snapshotId: "snapshot-1",
        }),
      },
    );

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence snapshot retrieval failed.",
    });
  });
});


describe("DELETE /api/intelligence/snapshots/[snapshotId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedAuthenticateRequest.mockResolvedValue({
      provider: "cognito",
      subject: "test-subject",
    });
  });

  it("rejects an unauthenticated request before reaching the repository", async () => {
    mockedAuthenticateRequest.mockRejectedValue(
      new UnauthenticatedRequestError(),
    );

    const response = await DELETE(
      new Request(
        "http://localhost/api/intelligence/snapshots/snapshot-1",
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({
          snapshotId: "snapshot-1",
        }),
      },
    );

    expect(response.status).toBe(401);

    await expect(response.json()).resolves.toEqual({
      error: "Authentication required.",
    });

    expect(deleteIntelligenceSnapshot).not.toHaveBeenCalled();
  });

  it("rejects a blank snapshot id", async () => {
    const response = await DELETE(
      new Request(
        "http://localhost/api/intelligence/snapshots/%20%20",
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({
          snapshotId: "  ",
        }),
      },
    );

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid intelligence snapshot.",
    });

    expect(deleteIntelligenceSnapshot).not.toHaveBeenCalled();
  });

  it("deletes the requested snapshot", async () => {
    deleteIntelligenceSnapshot.mockResolvedValue(true);

    const response = await DELETE(
      new Request(
        "http://localhost/api/intelligence/snapshots/snapshot-1",
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({
          snapshotId: "  snapshot-1  ",
        }),
      },
    );

    expect(response.status).toBe(204);
    expect(response.body).toBeNull();

    expect(deleteIntelligenceSnapshot).toHaveBeenCalledTimes(1);
    expect(deleteIntelligenceSnapshot).toHaveBeenCalledWith("snapshot-1");
  });

  it("returns 404 when the snapshot does not exist", async () => {
    deleteIntelligenceSnapshot.mockResolvedValue(false);

    const response = await DELETE(
      new Request(
        "http://localhost/api/intelligence/snapshots/missing",
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({
          snapshotId: "missing",
        }),
      },
    );

    expect(response.status).toBe(404);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence snapshot not found.",
    });
  });

  it("returns 500 when repository deletion fails", async () => {
    deleteIntelligenceSnapshot.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await DELETE(
      new Request(
        "http://localhost/api/intelligence/snapshots/snapshot-1",
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({
          snapshotId: "snapshot-1",
        }),
      },
    );

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence snapshot deletion failed.",
    });
  });
});
