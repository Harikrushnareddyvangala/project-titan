import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRepairExecutionResult,
} from "@/types/research";

const {
  executeResearchLineageIntegrityRemediationOnServer,
  authenticateRequest,
  UnauthenticatedRequestError,
  ResearchRemediationStalePlanError,
} = vi.hoisted(() => ({
  executeResearchLineageIntegrityRemediationOnServer: vi.fn(),
  authenticateRequest: vi.fn(),
  UnauthenticatedRequestError: class UnauthenticatedRequestError extends Error {
    readonly status = 401;

    constructor(message = "Authentication required.") {
      super(message);
      this.name = "UnauthenticatedRequestError";
    }
  },
  ResearchRemediationStalePlanError: class ResearchRemediationStalePlanError extends Error {
    readonly code = "RESEARCH_REMEDIATION_STALE_PLAN";

    constructor(conclusionId: string) {
      super(
        `Research remediation rejected because the conclusion changed after the remediation plan was created: ${conclusionId}`,
      );
      this.name = "ResearchRemediationStalePlanError";
    }
  },
}));

vi.mock("@/lib/research/lineage/remediation/serverExecutor", () => ({
  executeResearchLineageIntegrityRemediationOnServer,
}));

vi.mock("@/lib/server/auth/principal", () => ({
  authenticateRequest,
  UnauthenticatedRequestError,
}));

vi.mock("@titan/database", () => ({
  ResearchRemediationStalePlanError,
}));

import { POST } from "./route";

const plan: ResearchLineageIntegrityRemediationPlan = {
  investigationId: "investigation-001",
  action: "RepairReference",
  issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
  target: {
    targetId: "conclusion-001",
    sourceId: "finding-invalid",
  },
  confirmed: true,
  status: "Validated",
  description: "Replace an invalid finding reference.",
};

const executionResult: ResearchLineageIntegrityRemediationRepairExecutionResult = {
  investigationId: "investigation-001",
  action: "RepairReference",
  issueCode: "CONCLUSION_FINDING_REFERENCE_INVALID",
  executed: true,
  mutationType: "ReferenceReplacement",
  message: "Remediation executed successfully.",
  provenanceEventId: "research-provenance-001",
};

describe("POST /api/research/lineage/remediation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    authenticateRequest.mockResolvedValue({
      provider: "cognito",
      subject: "test-subject",
    });
  });

  it("rejects an unauthenticated request before reaching the server executor", async () => {
    authenticateRequest.mockRejectedValue(
      new UnauthenticatedRequestError(),
    );

    const request = new Request(
      "http://localhost/api/research/lineage/remediation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(
      executeResearchLineageIntegrityRemediationOnServer,
    ).not.toHaveBeenCalled();

    await expect(response.json()).resolves.toEqual({
      error: "Authentication required.",
    });
  });

  it("executes a valid remediation plan through the server boundary", async () => {
    executeResearchLineageIntegrityRemediationOnServer.mockResolvedValue(
      executionResult,
    );

    const request = new Request(
      "http://localhost/api/research/lineage/remediation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(
      executeResearchLineageIntegrityRemediationOnServer,
    ).toHaveBeenCalledTimes(1);
    expect(
      executeResearchLineageIntegrityRemediationOnServer,
    ).toHaveBeenCalledWith(plan);

    await expect(response.json()).resolves.toEqual(executionResult);
  });

  it("returns 409 when remediation is rejected because the conclusion is stale", async () => {
    const stalePlanError = new ResearchRemediationStalePlanError(
      "conclusion-001",
    );

    executeResearchLineageIntegrityRemediationOnServer.mockRejectedValue(
      stalePlanError,
    );

    const request = new Request(
      "http://localhost/api/research/lineage/remediation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error:
        "Research remediation rejected because the conclusion changed after the remediation plan was created: conclusion-001",
    });
  });

  it("returns 500 for unexpected remediation execution failures", async () => {
    executeResearchLineageIntegrityRemediationOnServer.mockRejectedValue(
      new Error("unexpected database failure"),
    );

    const request = new Request(
      "http://localhost/api/research/lineage/remediation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Research lineage remediation execution failed.",
    });
  });

  it("rejects an invalid remediation plan before reaching the server executor", async () => {
    const request = new Request(
      "http://localhost/api/research/lineage/remediation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: {
            ...plan,
            action: "Inspect",
          },
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(
      executeResearchLineageIntegrityRemediationOnServer,
    ).not.toHaveBeenCalled();

    await expect(response.json()).resolves.toEqual({
      error: "Invalid research lineage remediation plan.",
    });
  });

  it("rejects a validated remediation plan when explicit confirmation is false", async () => {
    const request = new Request(
      "http://localhost/api/research/lineage/remediation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: {
            ...plan,
            confirmed: false,
            status: "Validated",
          },
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(
      executeResearchLineageIntegrityRemediationOnServer,
    ).not.toHaveBeenCalled();

    await expect(response.json()).resolves.toEqual({
      error: "Invalid research lineage remediation plan.",
    });
  });

  it("rejects a planned remediation plan when explicit confirmation is true", async () => {
    const request = new Request(
      "http://localhost/api/research/lineage/remediation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: {
            ...plan,
            confirmed: true,
            status: "Planned",
          },
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(
      executeResearchLineageIntegrityRemediationOnServer,
    ).not.toHaveBeenCalled();

    await expect(response.json()).resolves.toEqual({
      error: "Invalid research lineage remediation plan.",
    });
  });
});
