import { NextResponse } from "next/server";

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

import { getResearchReconciliationObligationsByInvestigation } from "@/lib/research/reconciliationObligation/serverRepository";

export async function GET(request: Request) {
  try {
    await authenticateRequest(request);

    const { searchParams } = new URL(request.url);
    const investigationId = searchParams.get("investigationId")?.trim();

    if (!investigationId) {
      return NextResponse.json(
        {
          error: "Invalid research investigation.",
        },
        {
          status: 400,
        },
      );
    }

    const obligations =
      await getResearchReconciliationObligationsByInvestigation(
        investigationId,
      );

    return NextResponse.json({
      obligations,
    });
  } catch (error: unknown) {
    if (error instanceof UnauthenticatedRequestError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        },
      );
    }

    console.error(
      "Research reconciliation obligation retrieval API error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Research reconciliation obligation retrieval failed.",
      },
      {
        status: 500,
      },
    );
  }
}
