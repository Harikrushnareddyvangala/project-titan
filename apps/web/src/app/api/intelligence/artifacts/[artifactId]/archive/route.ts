import { NextResponse } from "next/server";

import { archiveServerIntelligenceArtifact } from "@/lib/intelligence/serverArtifactRepository";

import {
  authenticateRequest,
  UnauthenticatedRequestError,
} from "@/lib/server/auth/principal";

export async function POST(
  request: Request,
  context: { params: Promise<{ artifactId: string }> },
) {
  try {
    await authenticateRequest(request);

    const { artifactId } = await context.params;
    const id = artifactId.trim();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid intelligence artifact." },
        { status: 400 },
      );
    }

    const artifact = await archiveServerIntelligenceArtifact(id);

    if (!artifact) {
      return NextResponse.json(
        { error: "Intelligence artifact could not be archived." },
        { status: 404 },
      );
    }

    return NextResponse.json(artifact);
  } catch (error: unknown) {
    if (error instanceof UnauthenticatedRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Intelligence artifact archive API error:", error);

    return NextResponse.json(
      { error: "Intelligence artifact archival failed." },
      { status: 500 },
    );
  }
}
