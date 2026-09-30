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
  getServerIntelligenceArtifact: vi.fn(),
}));

vi.mock("@/lib/server/auth/principal", () => authMocks);

vi.mock("@/lib/intelligence/serverArtifactRepository", () => ({
  getServerIntelligenceArtifact:
    repositoryMocks.getServerIntelligenceArtifact,
}));

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

import { GET } from "./route";

const mockedAuthenticateRequest = vi.mocked(authenticateRequest);
const { getServerIntelligenceArtifact } = repositoryMocks;

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

function artifactRequest() {
  return new Request(
    "http://localhost/api/intelligence/artifacts/artifact-1",
  );
}

function artifactContext(artifactId: string) {
  return {
    params: Promise.resolve({ artifactId }),
  };
}

describe("GET /api/intelligence/artifacts/[artifactId]", () => {
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
      artifactRequest(),
      artifactContext("artifact-1"),
    );

    expect(response.status).toBe(401);

    await expect(response.json()).resolves.toEqual({
      error: "Authentication required.",
    });

    expect(getServerIntelligenceArtifact).not.toHaveBeenCalled();
  });

  it("rejects a blank artifact id", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/intelligence/artifacts/%20%20",
      ),
      artifactContext("  "),
    );

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid intelligence artifact.",
    });

    expect(getServerIntelligenceArtifact).not.toHaveBeenCalled();
  });

  it("returns the requested artifact", async () => {
    getServerIntelligenceArtifact.mockResolvedValue(artifact);

    const response = await GET(
      artifactRequest(),
      artifactContext("artifact-1"),
    );

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual(artifact);

    expect(getServerIntelligenceArtifact).toHaveBeenCalledTimes(1);
    expect(getServerIntelligenceArtifact).toHaveBeenCalledWith("artifact-1");
  });

  it("trims the artifact id before repository lookup", async () => {
    getServerIntelligenceArtifact.mockResolvedValue(artifact);

    const response = await GET(
      new Request(
        "http://localhost/api/intelligence/artifacts/%20artifact-1%20",
      ),
      artifactContext("  artifact-1  "),
    );

    expect(response.status).toBe(200);

    expect(getServerIntelligenceArtifact).toHaveBeenCalledWith("artifact-1");
  });

  it("returns 404 when the artifact does not exist", async () => {
    getServerIntelligenceArtifact.mockResolvedValue(null);

    const response = await GET(
      artifactRequest(),
      artifactContext("missing"),
    );

    expect(response.status).toBe(404);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence artifact not found.",
    });
  });

  it("returns 500 when repository retrieval fails", async () => {
    getServerIntelligenceArtifact.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await GET(
      artifactRequest(),
      artifactContext("artifact-1"),
    );

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence artifact retrieval failed.",
    });
  });
});
