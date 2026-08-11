import type {
  IntelligenceArtifact,
  IntelligenceArtifactFormat,
  IntelligenceArtifactSource,
  IntelligenceArtifactType,
  IntelligenceArtifactVersion,
  IntelligenceArtifactStatus,
  IntelligenceSnapshot,
} from "@/types/intelligence";

import {
  createIntelligenceArtifact,
} from "./artifact";

import {
  saveIntelligenceArtifact,
} from "./artifactRegistry";

export interface CreateAndSaveArtifactOptions {
  artifactType?: IntelligenceArtifactType;
  format?: IntelligenceArtifactFormat;
  source?: IntelligenceArtifactSource;
  author?: string;
  version?: IntelligenceArtifactVersion;
  status?: IntelligenceArtifactStatus;
  previousArtifactId?: string;
}

export function createAndSaveIntelligenceArtifact(
  snapshot: IntelligenceSnapshot,
  options: CreateAndSaveArtifactOptions = {},
): IntelligenceArtifact {
  const artifact =
    createIntelligenceArtifact(
      snapshot,
      options,
    );

  saveIntelligenceArtifact(artifact);

  return artifact;
}

export function createAndSaveReportArtifact(
  snapshot: IntelligenceSnapshot,
): IntelligenceArtifact {
  return createAndSaveIntelligenceArtifact(
    snapshot,
    {
      artifactType: "Report",
      format: "PDF",
      source: "Intelligence Snapshot",
      author: "Harikrushnareddy Vangala",
      version: "1.0.0",
    },
  );
}