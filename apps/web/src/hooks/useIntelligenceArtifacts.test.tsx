import {
  act,
  createElement,
  type ReactNode,
  useEffect,
} from "react";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { IntelligenceArtifact } from "@/types/intelligence";

const mocks = vi.hoisted(() => ({
  authenticatedFetch: vi.fn(),
}));

vi.mock("@/hooks/useAuthenticatedFetch", () => ({
  useAuthenticatedFetch: () => mocks.authenticatedFetch,
}));

import { createRoot } from "react-dom/client";
import { useIntelligenceArtifacts } from "./useIntelligenceArtifacts";

const artifacts: IntelligenceArtifact[] = [
  {
    artifactId: "artifact-1",
    artifactType: "Research Report",
    repository: "owner/repository",
    sourceSnapshotId: "snapshot-1",
    author: "Harikrushnareddy Vangala",
    createdAt: "2026-09-29T00:00:00.000Z",
    generatedAt: "2026-09-29T00:00:00.000Z",
    version: "1.0.0",
    format: "JSON",
    source: "Intelligence Snapshot",
    status: "Registered",
    metadata: {},
  },
];

function Harness({
  onReady,
}: {
  onReady: (
    value: ReturnType<typeof useIntelligenceArtifacts>,
  ) => void;
}): ReactNode {
  const value = useIntelligenceArtifacts();

  useEffect(() => {
    onReady(value);
  }, [onReady, value]);

  return null;
}

describe("useIntelligenceArtifacts", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  let hookValue: ReturnType<typeof useIntelligenceArtifacts>;

  beforeEach(() => {
    vi.clearAllMocks();

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    hookValue = undefined as unknown as ReturnType<
      typeof useIntelligenceArtifacts
    >;
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });

    container.remove();
  });

  async function renderHook() {
    await act(async () => {
      root.render(
        createElement(Harness, {
          onReady: (value) => {
            hookValue = value;
          },
        }),
      );
    });

    await vi.waitFor(() => {
      expect(hookValue).toBeDefined();
    });

    return () => hookValue;
  }

  it("retrieves durable intelligence artifacts", async () => {
    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({ artifacts }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    await vi.waitFor(() => {
      expect(value().artifacts).toEqual(artifacts);
    });

    expect(mocks.authenticatedFetch).toHaveBeenCalledWith(
      "/api/intelligence/artifacts",
    );
    expect(value().error).toBeNull();
    expect(value().loading).toBe(false);
  });

  it("surfaces retrieval failures", async () => {
    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "Intelligence artifact retrieval failed.",
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

    await vi.waitFor(() => {
      expect(value().error).toBe(
        "Intelligence artifact retrieval failed.",
      );
    });

    expect(value().artifacts).toEqual([]);
    expect(value().loading).toBe(false);
  });

  it("surfaces authentication or network failures", async () => {
    mocks.authenticatedFetch.mockRejectedValue(
      new Error("Authentication required."),
    );

    const value = await renderHook();

    await vi.waitFor(() => {
      expect(value().error).toBe("Authentication required.");
    });

    expect(value().artifacts).toEqual([]);
    expect(value().loading).toBe(false);
  });

  it("refreshes durable intelligence artifacts", async () => {
    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({ artifacts: [] }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    await vi.waitFor(() => {
      expect(value().loading).toBe(false);
    });

    expect(value().artifacts).toEqual([]);
    expect(mocks.authenticatedFetch).toHaveBeenCalledTimes(1);

    mocks.authenticatedFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ artifacts }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    await act(async () => {
      await value().refresh();
    });

    await vi.waitFor(() => {
      expect(value().artifacts).toEqual(artifacts);
    });

    expect(mocks.authenticatedFetch).toHaveBeenCalledTimes(2);
    expect(mocks.authenticatedFetch).toHaveBeenNthCalledWith(
      1,
      "/api/intelligence/artifacts",
    );
    expect(mocks.authenticatedFetch).toHaveBeenNthCalledWith(
      2,
      "/api/intelligence/artifacts",
    );
  });

  it("rejects an invalid successful response", async () => {
    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          unexpected: true,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const value = await renderHook();

    await vi.waitFor(() => {
      expect(value().error).toBe(
        "Invalid intelligence artifact response.",
      );
    });

    expect(value().artifacts).toEqual([]);
  });
});
