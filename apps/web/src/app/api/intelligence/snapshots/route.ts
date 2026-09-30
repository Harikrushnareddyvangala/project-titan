import { NextResponse } from "next/server";

import type { IntelligenceSnapshot } from "@/types/intelligence";
import { createIntelligenceSnapshot, getIntelligenceSnapshots } from "@/lib/intelligence/serverSnapshotRepository";
import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIntelligenceSnapshot(
  value: unknown,
): value is IntelligenceSnapshot {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.repository === "string" &&
    typeof value.createdAt === "string" &&
    isObject(value.analytics)
  );
}

export async function GET(request: Request) {
  try {
    await authenticateRequest(request);

    const snapshots = await getIntelligenceSnapshots();

    return NextResponse.json({ snapshots });
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

export async function POST(request: Request) {
  try {
    await authenticateRequest(request);

    const body: unknown = await request.json();

    if (!isObject(body) || !isIntelligenceSnapshot(body.snapshot)) {
      return NextResponse.json(
        { error: "Invalid intelligence snapshot." },
        { status: 400 },
      );
    }

    const snapshot = await createIntelligenceSnapshot(body.snapshot);

    return NextResponse.json(snapshot, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof UnauthenticatedRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Intelligence snapshot creation API error:", error);

    return NextResponse.json(
      { error: "Intelligence snapshot creation failed." },
      { status: 500 },
    );
  }
}
