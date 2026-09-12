import { NextResponse } from "next/server";

import { activateResearchReconciliationObligationOnServer } from "@/lib/research/reconciliationObligation/activation";

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
      await activateResearchReconciliationObligationOnServer(obligationId);

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
      "Research reconciliation obligation activation API error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Research reconciliation obligation activation failed.",
      },
      {
        status: 500,
      },
    );
  }
}
