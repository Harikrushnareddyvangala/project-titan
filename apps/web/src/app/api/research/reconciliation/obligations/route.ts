import { NextResponse } from "next/server";

import { getResearchReconciliationObligationsByInvestigation } from "@/lib/research/reconciliationObligation/serverRepository";

export async function GET(request: Request) {
  try {
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
