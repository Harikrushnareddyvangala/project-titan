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

import type { IntelligenceSnapshot } from "@/types/intelligence";

const mocks = vi.hoisted(() => ({
  authenticatedFetch: vi.fn(),
}));

vi.mock("@/hooks/useAuthenticatedFetch", () => ({
  useAuthenticatedFetch: () => mocks.authenticatedFetch,
}));

import { createRoot } from "react-dom/client";
import { useIntelligenceSnapshots } from "./useIntelligenceSnapshots";

const snapshots: IntelligenceSnapshot[] = [
  {
    id: "snapshot-1",
    repository: "owner/repository",
    createdAt: "2026-09-29T00:00:00.000Z",
    analytics: {} as IntelligenceSnapshot["analytics"],
  },
];

function Harness({
  onReady,
}: {
  onReady: (
    value: ReturnType<typeof useIntelligenceSnapshots>,
  ) => void;
}): ReactNode {
  const value = useIntelligenceSnapshots();

  onReady(value);

  return null;
}

describe("useIntelligenceSnapshots", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  let hookValue: ReturnType<typeof useIntelligenceSnapshots>;

  beforeEach(() => {
    vi.clearAllMocks();

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
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

    return hookValue;
  }

  it("retrieves durable intelligence snapshots", async () => {
    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({ snapshots }),
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
      expect(value.snapshots).toEqual(snapshots);
    });

    expect(mocks.authenticatedFetch).toHaveBeenCalledWith(
      "/api/intelligence/snapshots",
    );
  });

  it("surfaces retrieval failures", async () => {
    mocks.authenticatedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "Snapshot retrieval failed.",
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
      expect(value.error).toBe("Snapshot retrieval failed.");
    });

    expect(value.snapshots).toEqual([]);
  });

  it("surfaces authentication or network failures", async () => {
    mocks.authenticatedFetch.mockRejectedValue(
      new Error("Authentication required."),
    );

    const value = await renderHook();

    await vi.waitFor(() => {
      expect(value.error).toBe("Authentication required.");
    });

    expect(value.snapshots).toEqual([]);
  });


  it("deletes a durable intelligence snapshot", async () => {
    mocks.authenticatedFetch
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ snapshots }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ snapshots: [] }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

    await renderHook();

    await vi.waitFor(() => {
      expect(hookValue.snapshots).toEqual(snapshots);
    });

    await act(async () => {
      await hookValue.deleteSnapshot("  snapshot-1  ");
    });

    expect(mocks.authenticatedFetch).toHaveBeenNthCalledWith(
      2,
      "/api/intelligence/snapshots/snapshot-1",
      {
        method: "DELETE",
      },
    );

    await vi.waitFor(() => {
      expect(hookValue.snapshots).toEqual([]);
    });
  });

  it("surfaces durable deletion failures", async () => {
    mocks.authenticatedFetch
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ snapshots }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: "Intelligence snapshot not found.",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

    const value = await renderHook();

    await vi.waitFor(() => {
      expect(value.snapshots).toEqual(snapshots);
    });

    await expect(
      value.deleteSnapshot("snapshot-1"),
    ).rejects.toThrow("Intelligence snapshot not found.");

    expect(mocks.authenticatedFetch).toHaveBeenNthCalledWith(
      2,
      "/api/intelligence/snapshots/snapshot-1",
      {
        method: "DELETE",
      },
    );
  });

  it("surfaces authentication or network failures during deletion", async () => {
    mocks.authenticatedFetch
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ snapshots }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      )
      .mockRejectedValueOnce(new Error("Authentication required."));

    const value = await renderHook();

    await vi.waitFor(() => {
      expect(value.snapshots).toEqual(snapshots);
    });

    await expect(
      value.deleteSnapshot("snapshot-1"),
    ).rejects.toThrow("Authentication required.");
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
      expect(value.error).toBe(
        "Invalid intelligence snapshot response.",
      );
    });

    expect(value.snapshots).toEqual([]);
  });
});
