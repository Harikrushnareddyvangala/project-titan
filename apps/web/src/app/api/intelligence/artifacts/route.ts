import { NextResponse } from "next/server";

import type { IntelligenceArtifact } from "@/types/intelligence";

import {
  createServerIntelligenceArtifact,
  getServerIntelligenceArtifacts,
} from "@/lib/intelligence/serverArtifactRepository";

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIntelligenceArtifact(
  value: unknown,
): value is IntelligenceArtifact {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.artifactId === "string" &&
    typeof value.artifactType === "string" &&
    typeof value.repository === "string" &&
    typeof value.sourceSnapshotId === "string" &&
    typeof value.author === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.generatedAt === "string" &&
    typeof value.version === "string" &&
    typeof value.format === "string" &&
    typeof value.source === "string" &&
    typeof value.status === "string" &&
    isObject(value.metadata) &&
    (value.previousArtifactId === undefined ||
      typeof value.previousArtifactId === "string") &&
    (value.integrity === undefined || isObject(value.integrity)) &&
    (value.signature === undefined || isObject(value.signature))
  );
}

export async function GET(request: Request) {
  try {
    await authenticateRequest(request);

    const artifacts = await getServerIntelligenceArtifacts();

    return NextResponse.json({ artifacts });
  } catch (error: unknown) {
    if (error instanceof UnauthenticatedRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Intelligence artifact retrieval API error:", error);

    return NextResponse.json(
      { error: "Intelligence artifact retrieval failed." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await authenticateRequest(request);

    const body: unknown = await request.json();

    if (!isObject(body) || !isIntelligenceArtifact(body.artifact)) {
      return NextResponse.json(
        { error: "Invalid intelligence artifact." },
        { status: 400 },
      );
    }

    const artifact = await createServerIntelligenceArtifact(body.artifact);

    return NextResponse.json(artifact, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof UnauthenticatedRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Intelligence artifact creation API error:", error);

    return NextResponse.json(
      { error: "Intelligence artifact creation failed." },
      { status: 500 },
    );
  }
}
