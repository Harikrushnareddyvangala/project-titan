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
  getServerIntelligenceArtifacts: vi.fn(),
  createServerIntelligenceArtifact: vi.fn(),
}));

vi.mock("@/lib/server/auth/principal", () => authMocks);

vi.mock("@/lib/intelligence/serverArtifactRepository", () => ({
  getServerIntelligenceArtifacts:
    repositoryMocks.getServerIntelligenceArtifacts,
  createServerIntelligenceArtifact:
    repositoryMocks.createServerIntelligenceArtifact,
}));

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

import { GET, POST } from "./route";

const mockedAuthenticateRequest = vi.mocked(authenticateRequest);

const {
  getServerIntelligenceArtifacts,
  createServerIntelligenceArtifact,
} = repositoryMocks;

const artifact = {
  artifactId: "titan-report-owner-repo-20260929100000",
  artifactType: "Report",
  repository: "owner/repo",
  sourceSnapshotId: "snapshot-1",
  author: "Test Author",
  createdAt: "2026-09-29T10:00:00.000Z",
  generatedAt: "2026-09-29T10:01:00.000Z",
  version: "1.0.0",
  format: "PDF",
  source: "Intelligence Snapshot",
  status: "Registered",
  metadata: {
    title: "Report — owner/repo",
    description: "Test artifact",
    tags: ["titan", "intelligence"],
    repository: "owner/repo",
    snapshotCreatedAt: "2026-09-29T10:00:00.000Z",
    generatedAt: "2026-09-29T10:01:00.000Z",
  },
};

describe("/api/intelligence/artifacts", () => {
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
      new Request("http://localhost/api/intelligence/artifacts"),
    );

    expect(response.status).toBe(401);

    await expect(response.json()).resolves.toEqual({
      error: "Authentication required.",
    });

    expect(getServerIntelligenceArtifacts).not.toHaveBeenCalled();
  });

  it("returns artifacts", async () => {
    getServerIntelligenceArtifacts.mockResolvedValue([artifact]);

    const response = await GET(
      new Request("http://localhost/api/intelligence/artifacts"),
    );

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual({
      artifacts: [artifact],
    });

    expect(getServerIntelligenceArtifacts).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when GET repository retrieval fails", async () => {
    getServerIntelligenceArtifacts.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await GET(
      new Request("http://localhost/api/intelligence/artifacts"),
    );

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence artifact retrieval failed.",
    });
  });

  it("rejects unauthenticated POST requests", async () => {
    mockedAuthenticateRequest.mockRejectedValue(
      new UnauthenticatedRequestError(),
    );

    const response = await POST(
      new Request("http://localhost/api/intelligence/artifacts", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(401);

    expect(createServerIntelligenceArtifact).not.toHaveBeenCalled();
  });

  it("rejects an invalid artifact", async () => {
    const response = await POST(
      new Request("http://localhost/api/intelligence/artifacts", {
        method: "POST",
        body: JSON.stringify({
          artifact: {
            artifactId: "artifact-1",
          },
        }),
      }),
    );

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid intelligence artifact.",
    });

    expect(createServerIntelligenceArtifact).not.toHaveBeenCalled();
  });

  it("creates an intelligence artifact", async () => {
    createServerIntelligenceArtifact.mockResolvedValue(artifact);

    const response = await POST(
      new Request("http://localhost/api/intelligence/artifacts", {
        method: "POST",
        body: JSON.stringify({ artifact }),
      }),
    );

    expect(response.status).toBe(201);

    await expect(response.json()).resolves.toEqual(artifact);

    expect(createServerIntelligenceArtifact).toHaveBeenCalledTimes(1);
    expect(createServerIntelligenceArtifact).toHaveBeenCalledWith(artifact);
  });

  it("returns 500 when POST repository creation fails", async () => {
    createServerIntelligenceArtifact.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await POST(
      new Request("http://localhost/api/intelligence/artifacts", {
        method: "POST",
        body: JSON.stringify({ artifact }),
      }),
    );

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence artifact creation failed.",
    });
  });
});
