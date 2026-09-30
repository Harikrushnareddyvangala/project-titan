import { act, createElement, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const authenticatedFetch = vi.fn();

vi.mock("@/hooks/useAuthenticatedFetch", () => ({
  useAuthenticatedFetch: () => authenticatedFetch,
}));

vi.mock("lucide-react", () => ({
  FileText: () => createElement("span"),
  Printer: () => createElement("span"),
}));

vi.mock("./IntelligenceReport", async () => {
  const actual = await vi.importActual<typeof import("./IntelligenceReport")>(
    "./IntelligenceReport",
  );
  return actual;
});

import { IntelligenceReport } from "./IntelligenceReport";

const snapshot = {
  id: "snapshot-001",
  repository: "titan-repository",
  createdAt: "2026-09-30T10:00:00.000Z",
  analytics: {
    enterpriseReadiness: 90,
    securityScore: 88,
    dependencyRisk: 12,
    productionScore: 91,
  },
} as any;

function renderReport() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  act(() => {
    root.render(
      createElement(IntelligenceReport, {
        snapshot,
        onClose: vi.fn(),
      }),
    );
  });

  return {
    container,
    root,
  };
}

function clickRegisterButton(container: HTMLElement) {
  const button = Array.from(container.querySelectorAll("button")).find(
    (element) => element.textContent?.includes("Register Artifact"),
  );

  expect(button).toBeTruthy();

  act(() => {
    button!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

describe("IntelligenceReport durable artifact registration", () => {
  beforeEach(() => {
    authenticatedFetch.mockReset();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("registers a Report artifact through the durable API", async () => {
    const persistedArtifact = {
      artifactId: "artifact-report-001",
      artifactType: "Report",
      repository: snapshot.repository,
      sourceSnapshotId: snapshot.id,
      author: "Harikrushnareddy Vangala",
      createdAt: "2026-09-30T10:00:00.000Z",
      generatedAt: "2026-09-30T10:01:00.000Z",
      version: "1.0.0",
      format: "PDF",
      source: "Intelligence Snapshot",
      status: "Registered",
      metadata: {},
    };

    authenticatedFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(persistedArtifact),
    });

    const { container, root } = renderReport();

    clickRegisterButton(container);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(authenticatedFetch).toHaveBeenCalledTimes(1);

    const [url, request] = authenticatedFetch.mock.calls[0];

    expect(url).toBe("/api/intelligence/artifacts");
    expect(request.method).toBe("POST");

    const body = JSON.parse(request.body);

    expect(body.artifact.artifactType).toBe("Report");
    expect(body.artifact.format).toBe("PDF");
    expect(body.artifact.source).toBe("Intelligence Snapshot");
    expect(body.artifact.sourceSnapshotId).toBe(snapshot.id);

    expect(container.textContent).toContain("Report artifact registered successfully.");
    expect(container.textContent).toContain("artifact-report-001");

    act(() => {
      root.unmount();
    });
  });

  it("shows the durable API error and does not display success", async () => {
    authenticatedFetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        error: "Artifact registration failed.",
      }),
    });

    const { container, root } = renderReport();

    clickRegisterButton(container);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.textContent).toContain("Artifact registration failed.");
    expect(container.textContent).not.toContain(
      "Report artifact registered successfully.",
    );

    act(() => {
      root.unmount();
    });
  });

  it("prevents duplicate registration while the request is pending", async () => {
    let resolveRequest!: (value: unknown) => void;

    authenticatedFetch.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { container, root } = renderReport();

    const button = Array.from(container.querySelectorAll("button")).find(
      (element) => element.textContent?.includes("Register Artifact"),
    );

    expect(button).toBeTruthy();

    act(() => {
      button!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(authenticatedFetch).toHaveBeenCalledTimes(1);
    expect(button!.disabled).toBe(true);

    act(() => {
      button!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(authenticatedFetch).toHaveBeenCalledTimes(1);

    resolveRequest({
      ok: true,
      json: vi.fn().mockResolvedValue({
        artifactId: "artifact-report-002",
        artifactType: "Report",
        repository: snapshot.repository,
        sourceSnapshotId: snapshot.id,
        author: "Harikrushnareddy Vangala",
        createdAt: "2026-09-30T10:00:00.000Z",
        generatedAt: "2026-09-30T10:01:00.000Z",
        version: "1.0.0",
        format: "PDF",
        source: "Intelligence Snapshot",
        status: "Registered",
        metadata: {},
      }),
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => {
      root.unmount();
    });
  });
});
