import { NextResponse } from "next/server";

import { activateResearchReconciliationObligationOnServer } from "@/lib/research/reconciliationObligation/activation";
import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      obligationId: string;
    }>;
  },
) {
  try {
    await authenticateRequest(request);

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
    if (error instanceof UnauthenticatedRequestError) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

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
