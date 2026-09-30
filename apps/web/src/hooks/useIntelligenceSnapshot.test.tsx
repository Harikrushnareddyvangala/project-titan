import {
  act,
  createElement,
  type ReactNode,
} from "react";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { RepositoryAnalytics } from "@/types/github";
import type { IntelligenceSnapshot } from "@/types/intelligence";

const mocks = vi.hoisted(() => ({
  createIntelligenceSnapshot: vi.fn(),
  createIntelligenceArtifact: vi.fn(),
  authenticatedFetch: vi.fn(),
}));

vi.mock("@/lib/intelligence/snapshot", () => ({
  createIntelligenceSnapshot: mocks.createIntelligenceSnapshot,
}));

vi.mock("@/lib/intelligence/artifact", () => ({
  createIntelligenceArtifact:
    mocks.createIntelligenceArtifact,
}));

vi.mock("@/hooks/useAuthenticatedFetch", () => ({
  useAuthenticatedFetch: () => mocks.authenticatedFetch,
}));

import { createRoot } from "react-dom/client";
import { useIntelligenceSnapshot } from "./useIntelligenceSnapshot";

const analytics = {
  repository: {
    full_name: "owner/repository",
  },
} as unknown as RepositoryAnalytics;

const snapshot: IntelligenceSnapshot = {
  id: "snapshot-1",
  repository: "owner/repository",
  createdAt: "2026-09-29T00:00:00.000Z",
  analytics,
};

function Harness({
  onReady,
}: {
  onReady: (value: ReturnType<typeof useIntelligenceSnapshot>) => void;
}): ReactNode {
  const value = useIntelligenceSnapshot();

  onReady(value);

  return null;
}

describe("useIntelligenceSnapshot", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  let hookValue: ReturnType<typeof useIntelligenceSnapshot>;

  beforeEach(() => {
    vi.clearAllMocks();

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    mocks.createIntelligenceSnapshot.mockReturnValue(snapshot);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });

    container.remove();
  });

  async function renderHook(): Promise<
    ReturnType<typeof useIntelligenceSnapshot>
  > {
    await act(async () => {
      root.render(
        createElement(Harness, {
          onReady: (value) => {
            hookValue = value;
          },
        }),
      );
    });

    return hookValue;
  }

  it("persists and returns the durable intelligence snapshot", async () => {
    const persistedSnapshot: IntelligenceSnapshot = {
      ...snapshot,
      id: "snapshot-persisted",
    };

    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          snapshot: persistedSnapshot,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    await act(async () => {
      await value.createSnapshot(
        "owner/repository",
        analytics,
      );
    });

    expect(mocks.authenticatedFetch).toHaveBeenCalledWith(
      "/api/intelligence/snapshots",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snapshot,
        }),
      }),
    );

    expect(mocks.authenticatedFetch).toHaveBeenCalledTimes(1);
  });

  it("returns the persisted durable snapshot", async () => {
    const persistedSnapshot: IntelligenceSnapshot = {
      ...snapshot,
      id: "snapshot-persisted",
    };

    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          snapshot: persistedSnapshot,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    let result: IntelligenceSnapshot | undefined;

    await act(async () => {
      result = await value.createSnapshot(
        "owner/repository",
        analytics,
      );
    });

    expect(result).toEqual(persistedSnapshot);
  });

  it("propagates durable persistence failures", async () => {
    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "Persistence failed.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    await expect(
      act(async () => {
        await value.createSnapshot(
          "owner/repository",
          analytics,
        );
      }),
    ).rejects.toThrow("Persistence failed.");
  });

  it("propagates authentication or network failures", async () => {
    mocks.authenticatedFetch.mockRejectedValue(
      new Error("Authentication required."),
    );

    const value = await renderHook();

    await expect(
      act(async () => {
        await value.createSnapshot(
          "owner/repository",
          analytics,
        );
      }),
    ).rejects.toThrow("Authentication required.");
  });

  it("rejects an invalid successful response", async () => {
    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          unexpected: true,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    await expect(
      act(async () => {
        await value.createSnapshot(
          "owner/repository",
          analytics,
        );
      }),
    ).rejects.toThrow("Invalid intelligence snapshot response.");
  });

  it("creates and persists an artifact through the durable API", async () => {
    const artifact = {
      artifactId: "artifact-1",
    };

    mocks.createIntelligenceArtifact.mockReturnValue(artifact);

    mocks.authenticatedFetch.mockResolvedValue(
      new Response(JSON.stringify(artifact), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const value = await renderHook();

    const result = await value.createArtifact(snapshot);

    expect(
      mocks.createIntelligenceArtifact,
    ).toHaveBeenCalledWith(snapshot);

    expect(mocks.authenticatedFetch).toHaveBeenCalledWith(
      "/api/intelligence/artifacts",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artifact }),
      }),
    );

    expect(result).toEqual(artifact);
  });

  it("propagates durable artifact persistence failures", async () => {
    const artifact = {
      artifactId: "artifact-1",
    };

    mocks.createIntelligenceArtifact.mockReturnValue(artifact);

    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "Artifact persistence failed.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    await expect(
      value.createArtifact(snapshot),
    ).rejects.toThrow("Artifact persistence failed.");
  });

  it("rejects an invalid successful artifact response", async () => {
    const artifact = {
      artifactId: "artifact-1",
    };

    mocks.createIntelligenceArtifact.mockReturnValue(artifact);

    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          invalid: true,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    await expect(
      value.createArtifact(snapshot),
    ).rejects.toThrow(
      "Invalid intelligence artifact response.",
    );
  });
});
