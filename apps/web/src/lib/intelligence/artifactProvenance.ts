import type {
  IntelligenceArtifact,
} from "@/types/intelligence";

import {
  getArtifactLineage,
  getIntelligenceArtifact,
} from "./artifactRegistry";

/* -------------------------------------------------------------------------- */
/*                         Provenance Types                                   */
/* -------------------------------------------------------------------------- */

export interface IntelligenceArtifactProvenance {
  artifactId: string;

  artifactType:
    IntelligenceArtifact["artifactType"];

  repository: string;

  version:
    IntelligenceArtifact["version"];

  status:
    IntelligenceArtifact["status"];

  author: string;

  source:
    IntelligenceArtifact["source"];

  sourceSnapshotId: string;

  createdAt: string;

  generatedAt: string;

  previousArtifactId?:
    string;

  lineage: IntelligenceArtifact[];
}

/* -------------------------------------------------------------------------- */
/*                         Provenance Builder                                 */
/* -------------------------------------------------------------------------- */

export function buildArtifactProvenance(
  artifactId: string,
):
  IntelligenceArtifactProvenance | null {
  const artifact =
    getIntelligenceArtifact(
      artifactId,
    );

  if (!artifact) {
    return null;
  }

  const lineage =
    getArtifactLineage(
      artifactId,
    );

  return {
    artifactId:
      artifact.artifactId,

    artifactType:
      artifact.artifactType,

    repository:
      artifact.repository,

    version:
      artifact.version,

    status:
      artifact.status,

    author:
      artifact.author,

    source:
      artifact.source,

    sourceSnapshotId:
      artifact.sourceSnapshotId,

    createdAt:
      artifact.createdAt,

    generatedAt:
      artifact.generatedAt,

    ...(artifact.previousArtifactId
      ? {
          previousArtifactId:
            artifact.previousArtifactId,
        }
      : {}),

    lineage,
  };
}

/* -------------------------------------------------------------------------- */
/*                         Portable Export                                    */
/* -------------------------------------------------------------------------- */

export interface IntelligenceArtifactExport {
  schemaVersion:
    "1.0";

  exportedAt: string;

  artifact:
    IntelligenceArtifact;

  provenance:
    IntelligenceArtifactProvenance;
}

/* -------------------------------------------------------------------------- */
/*                         Export Builder                                     */
/* -------------------------------------------------------------------------- */

export function buildArtifactExport(
  artifactId: string,
):
  IntelligenceArtifactExport | null {
  const artifact =
    getIntelligenceArtifact(
      artifactId,
    );

  if (!artifact) {
    return null;
  }

  const provenance =
    buildArtifactProvenance(
      artifactId,
    );

  if (!provenance) {
    return null;
  }

  return {
    schemaVersion:
      "1.0",

    exportedAt:
      new Date().toISOString(),

    artifact,

    provenance,
  };
}

/* -------------------------------------------------------------------------- */
/*                         JSON Serialization                                  */
/* -------------------------------------------------------------------------- */

export function serializeArtifactAsJSON(
  artifactId: string,
): string | null {
  const payload =
    buildArtifactExport(
      artifactId,
    );

  if (!payload) {
    return null;
  }

  return JSON.stringify(
    payload,
    null,
    2,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Markdown Export                                    */
/* -------------------------------------------------------------------------- */

export function serializeArtifactAsMarkdown(
  artifactId: string,
): string | null {
  const payload =
    buildArtifactExport(
      artifactId,
    );

  if (!payload) {
    return null;
  }

  const {
    artifact,
    provenance,
  } = payload;

  const lineage =
    provenance.lineage
      .map(
        (
          item,
          index,
        ) =>
          `${index + 1}. **v${item.version}** — ${item.artifactId} — ${item.status}`,
      )
      .join("\n");

  const tags =
    artifact.metadata.tags
      ?.map(
        (tag) =>
          `\`${tag}\``,
      )
      .join(" ") ??
    "";

  return `# ${artifact.metadata.title ?? artifact.artifactType}

## Artifact

| Field | Value |
|---|---|
| Artifact ID | ${artifact.artifactId} |
| Type | ${artifact.artifactType} |
| Version | ${artifact.version} |
| Status | ${artifact.status} |
| Repository | ${artifact.repository} |
| Format | ${artifact.format} |
| Author | ${artifact.author} |
| Source | ${artifact.source} |
| Source Snapshot | ${artifact.sourceSnapshotId} |
| Created | ${artifact.createdAt} |
| Generated | ${artifact.generatedAt} |

## Description

${artifact.metadata.description ?? "No description provided."}

## Tags

${tags || "No tags."}

## Provenance

This artifact was generated from intelligence snapshot \`${artifact.sourceSnapshotId}\`.

### Lineage

${lineage}

## Integrity

| Field | Value |
|---|---|
| Algorithm | ${artifact.integrity?.algorithm ?? "Not fingerprinted"} |
| Hash | ${artifact.integrity?.hash ?? "Not fingerprinted"} |
| Canonical Version | ${artifact.integrity?.canonicalVersion ?? "—"} |
| Fingerprint Generated | ${artifact.integrity?.generatedAt ?? "—"} |

## Export

| Field | Value |
|---|---|
| Provenance Schema | ${payload.schemaVersion} |
| Exported At | ${payload.exportedAt} |
`;
}