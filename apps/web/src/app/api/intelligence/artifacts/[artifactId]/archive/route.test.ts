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
  archiveServerIntelligenceArtifact: vi.fn(),
}));

vi.mock("@/lib/server/auth/principal", () => authMocks);

vi.mock("@/lib/intelligence/serverArtifactRepository", () => ({
  archiveServerIntelligenceArtifact:
    repositoryMocks.archiveServerIntelligenceArtifact,
}));

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

import { POST } from "./route";

const mockedAuthenticateRequest = vi.mocked(authenticateRequest);
const { archiveServerIntelligenceArtifact } = repositoryMocks;

const artifact = {
  artifactId: "artifact-1",
  artifactType: "Report",
  repository: "owner/repo",
  sourceSnapshotId: "snapshot-1",
  author: "Test Author",
  createdAt: "2026-09-30T10:00:00.000Z",
  generatedAt: "2026-09-30T10:01:00.000Z",
  version: "1.0.0",
  format: "PDF",
  source: "Intelligence Snapshot",
  status: "Archived",
  metadata: {
    title: "Test Report",
    description: "Test artifact",
    tags: [],
    repository: "owner/repo",
    snapshotCreatedAt: "2026-09-30T10:00:00.000Z",
    generatedAt: "2026-09-30T10:01:00.000Z",
  },
};

function artifactRequest() {
  return new Request(
    "http://localhost/api/intelligence/artifacts/artifact-1/archive",
    { method: "POST" },
  );
}

function artifactContext(artifactId: string) {
  return {
    params: Promise.resolve({ artifactId }),
  };
}

describe("POST /api/intelligence/artifacts/[artifactId]/archive", () => {
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

    const response = await POST(
      artifactRequest(),
      artifactContext("artifact-1"),
    );

    expect(response.status).toBe(401);

    await expect(response.json()).resolves.toEqual({
      error: "Authentication required.",
    });

    expect(archiveServerIntelligenceArtifact).not.toHaveBeenCalled();
  });

  it("rejects a blank artifact id", async () => {
    const response = await POST(
      new Request(
        "http://localhost/api/intelligence/artifacts/%20%20/archive",
        { method: "POST" },
      ),
      artifactContext("  "),
    );

    expect(response.status).toBe(400);

    await expect(response.json()).resolves.toEqual({
      error: "Invalid intelligence artifact.",
    });

    expect(archiveServerIntelligenceArtifact).not.toHaveBeenCalled();
  });

  it("archives the requested artifact", async () => {
    archiveServerIntelligenceArtifact.mockResolvedValue(artifact);

    const response = await POST(
      artifactRequest(),
      artifactContext("artifact-1"),
    );

    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual(artifact);

    expect(archiveServerIntelligenceArtifact).toHaveBeenCalledTimes(1);
    expect(archiveServerIntelligenceArtifact).toHaveBeenCalledWith(
      "artifact-1",
    );
  });

  it("trims the artifact id before archiving", async () => {
    archiveServerIntelligenceArtifact.mockResolvedValue(artifact);

    const response = await POST(
      new Request(
        "http://localhost/api/intelligence/artifacts/%20artifact-1%20/archive",
        { method: "POST" },
      ),
      artifactContext("  artifact-1  "),
    );

    expect(response.status).toBe(200);

    expect(archiveServerIntelligenceArtifact).toHaveBeenCalledWith(
      "artifact-1",
    );
  });

  it("returns 404 when the artifact cannot be archived", async () => {
    archiveServerIntelligenceArtifact.mockResolvedValue(null);

    const response = await POST(
      artifactRequest(),
      artifactContext("artifact-1"),
    );

    expect(response.status).toBe(404);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence artifact could not be archived.",
    });
  });

  it("returns 500 when archival fails", async () => {
    archiveServerIntelligenceArtifact.mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await POST(
      artifactRequest(),
      artifactContext("artifact-1"),
    );

    expect(response.status).toBe(500);

    await expect(response.json()).resolves.toEqual({
      error: "Intelligence artifact archival failed.",
    });
  });
});
