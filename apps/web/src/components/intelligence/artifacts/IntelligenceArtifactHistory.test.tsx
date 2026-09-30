import {
  act,
  createElement,
  type ReactNode,
  useEffect,
} from "react";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { IntelligenceArtifact } from "@/types/intelligence";

const mocks = vi.hoisted(() => ({
  authenticatedFetch: vi.fn(),
  getAllowedArtifactStatusTransitions: vi.fn(),
  getArtifactFamily: vi.fn(),
  assessArtifactTrust: vi.fn(),
}));

vi.mock("@/hooks/useAuthenticatedFetch", () => ({
  useAuthenticatedFetch: () => mocks.authenticatedFetch,
}));

vi.mock("@/lib/intelligence/artifactRegistry", () => ({
  getAllowedArtifactStatusTransitions:
    mocks.getAllowedArtifactStatusTransitions,
  getArtifactFamily: mocks.getArtifactFamily,
}));

vi.mock("@/lib/intelligence/artifactTrustService", () => ({
  assessArtifactTrust: mocks.assessArtifactTrust,
}));

vi.mock("./IntelligenceArtifactExportButtons", () => ({
  IntelligenceArtifactExportButtons: () => null,
}));

vi.mock("./IntelligenceArtifactIntegrity", () => ({
  IntelligenceArtifactIntegrity: () => null,
}));

vi.mock("./IntelligenceArtifactTrust", () => ({
  IntelligenceArtifactTrust: () => null,
}));

vi.mock("./IntelligenceArtifactSigningPanel", () => ({
  IntelligenceArtifactSigningPanel: () => null,
}));

vi.mock("./IntelligenceArtifactLineage", () => ({
  IntelligenceArtifactLineage: () => null,
}));

vi.mock("./IntelligenceArtifactStatusBadge", () => ({
  IntelligenceArtifactStatusBadge: ({
    status,
  }: {
    status?: string;
  }) => createElement("span", null, status ?? ""),
}));

import { createRoot } from "react-dom/client";
import { IntelligenceArtifactHistory } from "./IntelligenceArtifactHistory";

const artifact: IntelligenceArtifact = {
  artifactId: "artifact-1",
  artifactType: "Research Report",
  repository: "owner/repository",
  sourceSnapshotId: "snapshot-1",
  author: "Test Author",
  createdAt: "2026-09-29T00:00:00.000Z",
  generatedAt: "2026-09-29T00:00:00.000Z",
  version: "1.0.0",
  format: "JSON",
  source: "Intelligence Snapshot",
  status: "Registered",
  metadata: {},
};

const publishedArtifact: IntelligenceArtifact = {
  ...artifact,
  status: "Published",
};

const archivedArtifact: IntelligenceArtifact = {
  ...artifact,
  status: "Archived",
};

const supersededArtifact: IntelligenceArtifact = {
  ...artifact,
  status: "Superseded",
};

function createResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function Harness({
  onReady,
}: {
  onReady: () => void;
}): ReactNode {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return createElement(IntelligenceArtifactHistory);
}

describe("IntelligenceArtifactHistory durable lifecycle", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    vi.clearAllMocks();

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    mocks.getAllowedArtifactStatusTransitions.mockReturnValue([
      "Published",
      "Archived",
    ]);

    mocks.getArtifactFamily.mockReturnValue([artifact]);

    mocks.assessArtifactTrust.mockResolvedValue({
      status: "Trusted",
      reasons: [],
    });

    mocks.authenticatedFetch.mockImplementation(async (url: string) => {
      if (url === "/api/intelligence/artifacts") {
        return createResponse({
          artifacts: [artifact],
        });
      }

      return createResponse(artifact);
    });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });

    container.remove();
  });

  async function renderHistory() {
    await act(async () => {
      root.render(
        createElement(Harness, {
          onReady: () => undefined,
        }),
      );
    });

    await vi.waitFor(() => {
      expect(container.textContent).toContain("Intelligence Artifacts");
    });
  }

  async function selectArtifact() {
    const artifactText = Array.from(
      container.querySelectorAll("button"),
    ).find((button) =>
      button.textContent?.includes("Research Report"),
    );

    if (!artifactText) {
      throw new Error("Artifact selection button not found.");
    }

    await act(async () => {
      artifactText.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
        }),
      );
    });
  }

  it("publishes through the durable API and refreshes", async () => {
    let refreshCalls = 0;

    mocks.authenticatedFetch.mockImplementation(async (url: string) => {
      if (url === "/api/intelligence/artifacts") {
        refreshCalls += 1;

        return createResponse({
          artifacts: [refreshCalls === 1 ? artifact : publishedArtifact],
        });
      }

      if (url === "/api/intelligence/artifacts/artifact-1/publish") {
        return createResponse(publishedArtifact);
      }

      return createResponse(artifact);
    });

    await renderHistory();
    await selectArtifact();

    const publishButton = Array.from(
      container.querySelectorAll("button"),
    ).find((button) => button.textContent === "Published");

    expect(publishButton).toBeDefined();

    await act(async () => {
      publishButton?.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
        }),
      );
    });

    await vi.waitFor(() => {
      expect(mocks.authenticatedFetch).toHaveBeenCalledWith(
        "/api/intelligence/artifacts/artifact-1/publish",
        {
          method: "POST",
        },
      );
    });

    expect(refreshCalls).toBeGreaterThanOrEqual(2);
  });

  it("archives through the durable API", async () => {
    mocks.authenticatedFetch.mockImplementation(async (url: string) => {
      if (url === "/api/intelligence/artifacts") {
        return createResponse({
          artifacts: [artifact],
        });
      }

      if (url === "/api/intelligence/artifacts/artifact-1/archive") {
        return createResponse(archivedArtifact);
      }

      return createResponse(artifact);
    });

    mocks.getAllowedArtifactStatusTransitions.mockReturnValue([
      "Archived",
    ]);

    await renderHistory();
    await selectArtifact();

    const archiveButton = Array.from(
      container.querySelectorAll("button"),
    ).find((button) => button.textContent === "Archived");

    expect(archiveButton).toBeDefined();

    await act(async () => {
      archiveButton?.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
        }),
      );
    });

    await vi.waitFor(() => {
      expect(mocks.authenticatedFetch).toHaveBeenCalledWith(
        "/api/intelligence/artifacts/artifact-1/archive",
        {
          method: "POST",
        },
      );
    });
  });

  it("supersedes through the durable API", async () => {
    mocks.authenticatedFetch.mockImplementation(async (url: string) => {
      if (url === "/api/intelligence/artifacts") {
        return createResponse({
          artifacts: [publishedArtifact],
        });
      }

      if (url === "/api/intelligence/artifacts/artifact-1/supersede") {
        return createResponse(supersededArtifact);
      }

      return createResponse(publishedArtifact);
    });

    mocks.getAllowedArtifactStatusTransitions.mockReturnValue([
      "Superseded",
      "Archived",
    ]);

    await renderHistory();
    await selectArtifact();

    const supersedeButton = Array.from(
      container.querySelectorAll("button"),
    ).find((button) => button.textContent === "Superseded");

    expect(supersedeButton).toBeDefined();

    await act(async () => {
      supersedeButton?.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
        }),
      );
    });

    await vi.waitFor(() => {
      expect(mocks.authenticatedFetch).toHaveBeenCalledWith(
        "/api/intelligence/artifacts/artifact-1/supersede",
        {
          method: "POST",
        },
      );
    });
  });

  it("does not refresh when lifecycle mutation fails", async () => {
    let collectionCalls = 0;

    mocks.authenticatedFetch.mockImplementation(async (url: string) => {
      if (url === "/api/intelligence/artifacts") {
        collectionCalls += 1;

        return createResponse({
          artifacts: [artifact],
        });
      }

      if (url === "/api/intelligence/artifacts/artifact-1/publish") {
        return createResponse(
          {
            error: "Intelligence artifact publication failed.",
          },
          500,
        );
      }

      return createResponse(artifact);
    });

    await renderHistory();
    await selectArtifact();

    const publishButton = Array.from(
      container.querySelectorAll("button"),
    ).find((button) => button.textContent === "Published");

    expect(publishButton).toBeDefined();

    await act(async () => {
      publishButton?.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
        }),
      );
    });

    await vi.waitFor(() => {
      expect(container.textContent).toContain(
        "Intelligence artifact publication failed.",
      );
    });

    expect(collectionCalls).toBe(1);
  });
});
