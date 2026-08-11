import type {
  IntelligenceArtifactExport,
} from "@/lib/intelligence/artifactProvenance";

import {
  buildArtifactExport,
  serializeArtifactAsJSON,
  serializeArtifactAsMarkdown,
} from "@/lib/intelligence/artifactProvenance";

export interface ArtifactExportResult {
  format:
    | "JSON"
    | "Markdown";

  content: string;

  filename: string;

  mimeType: string;
}

export function exportIntelligenceArtifact(
  artifactId: string,
  format:
    | "JSON"
    | "Markdown",
):
  ArtifactExportResult | null {
  const payload:
    IntelligenceArtifactExport | null =
    buildArtifactExport(
      artifactId,
    );

  if (!payload) {
    return null;
  }

  if (format === "JSON") {
    const content =
      serializeArtifactAsJSON(
        artifactId,
      );

    if (!content) {
      return null;
    }

    return {
      format: "JSON",

      content,

      filename:
        `${artifactId}.json`,

      mimeType:
        "application/json",
    };
  }

  const content =
    serializeArtifactAsMarkdown(
      artifactId,
    );

  if (!content) {
    return null;
  }

  return {
    format: "Markdown",

    content,

    filename:
      `${artifactId}.md`,

    mimeType:
      "text/markdown",
  };
}