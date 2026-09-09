import { NextResponse } from "next/server";

import type {
  ResearchLineageIntegrityRemediationPlan,
  ResearchLineageIntegrityRemediationRepairExecutionResult,
} from "@/types/research";

import { executeResearchLineageIntegrityRemediationOnServer } from "@/lib/research/lineage/remediation/serverExecutor";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRemediationPlan(
  value: unknown,
): value is ResearchLineageIntegrityRemediationPlan {
  if (!isObject(value)) {
    return false;
  }

  const validAction =
    value.action === "RepairReference" ||
    value.action === "RepairScope" ||
    value.action === "RepairRelationship";

  const validStatus =
    value.status === "Planned" ||
    value.status === "Validated";

  const validTarget =
    isObject(value.target) &&
    (value.target.nodeId === undefined ||
      typeof value.target.nodeId === "string") &&
    (value.target.edgeId === undefined ||
      typeof value.target.edgeId === "string") &&
    (value.target.sourceId === undefined ||
      typeof value.target.sourceId === "string") &&
    (value.target.targetId === undefined ||
      typeof value.target.targetId === "string");

  return (
    typeof value.investigationId === "string" &&
    validAction &&
    typeof value.issueCode === "string" &&
    validTarget &&
    typeof value.confirmed === "boolean" &&
    validStatus &&
    typeof value.description === "string" &&
    (value.targetUpdatedAt === undefined ||
      typeof value.targetUpdatedAt === "string") &&
    (value.replacementUpdatedAt === undefined ||
      typeof value.replacementUpdatedAt === "string") &&
    (value.replacementEntityId === undefined ||
      typeof value.replacementEntityId === "string")
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isObject(body) || !isRemediationPlan(body.plan)) {
      return NextResponse.json(
        {
          error: "Invalid research lineage remediation plan.",
        },
        {
          status: 400,
        },
      );
    }

    const result: ResearchLineageIntegrityRemediationRepairExecutionResult =
      await executeResearchLineageIntegrityRemediationOnServer(body.plan);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Research lineage remediation API error:", error);

    return NextResponse.json(
      {
        error: "Research lineage remediation execution failed.",
      },
      {
        status: 500,
      },
    );
  }
}
