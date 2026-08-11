import type {
  IntelligenceArtifact,
  IntelligenceArtifactTrustAssessment,
} from "@/types/intelligence";

import {
  assessArtifactTrust,
} from "./artifactTrustService";

import {
  canPublishArtifact,
  canExportArtifact,
} from "./artifactTrustPolicy";

export async function evaluateArtifactForPublish(
  artifact:
    IntelligenceArtifact,
): Promise<{
  allowed: boolean;

  assessment:
    IntelligenceArtifactTrustAssessment;
}> {
  const assessment =
    await assessArtifactTrust(
      artifact,
    );

  return {
    allowed:
      canPublishArtifact(
        assessment,
      ),

    assessment,
  };
}

export async function evaluateArtifactForExport(
  artifact:
    IntelligenceArtifact,
): Promise<{
  allowed: boolean;

  assessment:
    IntelligenceArtifactTrustAssessment;
}> {
  const assessment =
    await assessArtifactTrust(
      artifact,
    );

  return {
    allowed:
      canExportArtifact(
        assessment,
      ),

    assessment,
  };
}