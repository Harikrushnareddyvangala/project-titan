import { NextResponse } from "next/server";

import {
  deleteIntelligenceSnapshot,
  getIntelligenceSnapshot,
} from "@/lib/intelligence/serverSnapshotRepository";
import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

export async function GET(
  request: Request,
  context: { params: Promise<{ snapshotId: string }> },
) {
  try {
    await authenticateRequest(request);

    const { snapshotId } = await context.params;
    const id = snapshotId.trim();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid intelligence snapshot." },
        { status: 400 },
      );
    }

    const snapshot = await getIntelligenceSnapshot(id);

    if (!snapshot) {
      return NextResponse.json(
        { error: "Intelligence snapshot not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(snapshot);
  } catch (error: unknown) {
    if (error instanceof UnauthenticatedRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Intelligence snapshot retrieval API error:", error);

    return NextResponse.json(
      { error: "Intelligence snapshot retrieval failed." },
      { status: 500 },
    );
  }
}


export async function DELETE(
  request: Request,
  context: { params: Promise<{ snapshotId: string }> },
) {
  try {
    await authenticateRequest(request);

    const { snapshotId } = await context.params;
    const id = snapshotId.trim();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid intelligence snapshot." },
        { status: 400 },
      );
    }

    const deleted = await deleteIntelligenceSnapshot(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Intelligence snapshot not found." },
        { status: 404 },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof UnauthenticatedRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Intelligence snapshot deletion API error:", error);

    return NextResponse.json(
      { error: "Intelligence snapshot deletion failed." },
      { status: 500 },
    );
  }
}
