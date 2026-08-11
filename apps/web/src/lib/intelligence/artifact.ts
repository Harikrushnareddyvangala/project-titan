import type {
  IntelligenceArtifact,
  IntelligenceArtifactFormat,
  IntelligenceArtifactSource,
  IntelligenceArtifactStatus,
  IntelligenceArtifactType,
  IntelligenceArtifactVersion,
  IntelligenceArtifactVersionBump,
  IntelligenceArtifactVersionInfo,
  IntelligenceSnapshot,
} from "@/types/intelligence";

/* -------------------------------------------------------------------------- */
/*                              Defaults                                      */
/* -------------------------------------------------------------------------- */

const DEFAULT_ARTIFACT_VERSION:
  IntelligenceArtifactVersion = "1.0.0";

const DEFAULT_ARTIFACT_STATUS:
  IntelligenceArtifactStatus = "Registered";

const DEFAULT_AUTHOR =
  "Harikrushnareddy Vangala";

/* -------------------------------------------------------------------------- */
/*                         Artifact Creation Options                           */
/* -------------------------------------------------------------------------- */

export interface CreateIntelligenceArtifactOptions {
  artifactType?: IntelligenceArtifactType;

  format?: IntelligenceArtifactFormat;

  source?: IntelligenceArtifactSource;

  author?: string;

  version?: IntelligenceArtifactVersion;

  status?: IntelligenceArtifactStatus;

  previousArtifactId?: string;
}

/* -------------------------------------------------------------------------- */
/*                         Artifact Creation                                  */
/* -------------------------------------------------------------------------- */

export function createIntelligenceArtifact(
  snapshot: IntelligenceSnapshot,
  options: CreateIntelligenceArtifactOptions = {},
): IntelligenceArtifact {
  const artifactType =
    options.artifactType ??
    "Snapshot";

  const format =
    options.format ??
    "JSON";

  const source =
    options.source ??
    "Intelligence Snapshot";

  const author =
    options.author ??
    DEFAULT_AUTHOR;

  const version =
    options.version ??
    DEFAULT_ARTIFACT_VERSION;

  const status =
    options.status ??
    DEFAULT_ARTIFACT_STATUS;

  const generatedAt =
    new Date().toISOString();

  const artifactId =
    createArtifactId(
      artifactType,
      snapshot,
      generatedAt,
    );

  return {
    artifactId,

    artifactType,

    repository:
      snapshot.repository,

    sourceSnapshotId:
      snapshot.id,

    author,

    createdAt:
      snapshot.createdAt,

    generatedAt,

    version,

    format,

    source,

    status,

    ...(options.previousArtifactId
      ? {
          previousArtifactId:
            options.previousArtifactId,
        }
      : {}),

    metadata: {
      title:
        `${artifactType} — ${snapshot.repository}`,

      description:
        `TITAN ${artifactType.toLowerCase()} generated from repository intelligence snapshot ${snapshot.id}.`,

      tags: [
        "titan",
        "intelligence",
        artifactType.toLowerCase(),
      ],

      repository:
        snapshot.repository,

      snapshotCreatedAt:
        snapshot.createdAt,

      generatedAt,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                         Artifact Identity                                  */
/* -------------------------------------------------------------------------- */

function createArtifactId(
  artifactType: IntelligenceArtifactType,
  snapshot: IntelligenceSnapshot,
  generatedAt: string,
): string {
  const type =
    artifactType
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const repository =
    snapshot.repository
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const timestamp =
    generatedAt
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

  return [
    "titan",
    type,
    repository,
    timestamp,
  ].join("-");
}

/* -------------------------------------------------------------------------- */
/*                         Version Parsing                                    */
/* -------------------------------------------------------------------------- */

export function parseIntelligenceArtifactVersion(
  version: IntelligenceArtifactVersion,
): IntelligenceArtifactVersionInfo {
  const [major, minor, patch] =
    version.split(".").map(Number);

  return {
    version,
    major,
    minor,
    patch,
  };
}

/* -------------------------------------------------------------------------- */
/*                         Version Increment                                  */
/* -------------------------------------------------------------------------- */

export function incrementArtifactPatchVersion(
  version: IntelligenceArtifactVersion,
): IntelligenceArtifactVersion {
  const parsed =
    parseIntelligenceArtifactVersion(
      version,
    );

  return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
}

export function incrementArtifactMinorVersion(
  version: IntelligenceArtifactVersion,
): IntelligenceArtifactVersion {
  const parsed =
    parseIntelligenceArtifactVersion(
      version,
    );

  return `${parsed.major}.${parsed.minor + 1}.0`;
}

export function incrementArtifactMajorVersion(
  version: IntelligenceArtifactVersion,
): IntelligenceArtifactVersion {
  const parsed =
    parseIntelligenceArtifactVersion(
      version,
    );

  return `${parsed.major + 1}.0.0`;
}

/* -------------------------------------------------------------------------- */
/*                    Controlled Version Transition                           */
/* -------------------------------------------------------------------------- */

export function incrementArtifactVersion(
  version: IntelligenceArtifactVersion,
  bump: IntelligenceArtifactVersionBump,
): IntelligenceArtifactVersion {
  switch (bump) {
    case "patch":
      return incrementArtifactPatchVersion(
        version,
      );

    case "minor":
      return incrementArtifactMinorVersion(
        version,
      );

    case "major":
      return incrementArtifactMajorVersion(
        version,
      );

    default:
      return version;
  }
}