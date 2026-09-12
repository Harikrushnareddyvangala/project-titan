import { NextResponse } from "next/server";

import { confirmResearchReconciliationObligationRecoveryOnServer } from "@/lib/research/reconciliationObligation/confirmation";

export async function POST(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      obligationId: string;
    }>;
  },
) {
  try {
    const { obligationId } = await params;

    if (!obligationId) {
      return NextResponse.json(
        {
          error: "Invalid reconciliation obligation.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await confirmResearchReconciliationObligationRecoveryOnServer(
        obligationId,
      );

    if (!result) {
      return NextResponse.json(
        {
          error: "Reconciliation obligation not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(
      "Research reconciliation recovery confirmation API error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Research reconciliation recovery confirmation failed.",
      },
      {
        status: 500,
      },
    );
  }
}
