"use client";

import {
  Download,
  FileJson,
  FileText,
} from "lucide-react";

import {
  serializeArtifactAsJSON,
  serializeArtifactAsMarkdown,
} from "@/lib/intelligence/artifactProvenance";

interface IntelligenceArtifactExportButtonsProps {
  artifactId: string;
}

function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob =
    new Blob(
      [content],
      {
        type: mimeType,
      },
    );

  const url =
    URL.createObjectURL(
      blob,
    );

  const anchor =
    document.createElement(
      "a",
    );

  anchor.href = url;
  anchor.download =
    filename;

  document.body.appendChild(
    anchor,
  );

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(
    url,
  );
}

export function IntelligenceArtifactExportButtons({
  artifactId,
}: IntelligenceArtifactExportButtonsProps) {
  function handleJSONExport(): void {
    const content =
      serializeArtifactAsJSON(
        artifactId,
      );

    if (!content) {
      return;
    }

    downloadTextFile(
      content,
      `${artifactId}.json`,
      "application/json",
    );
  }

  function handleMarkdownExport(): void {
    const content =
      serializeArtifactAsMarkdown(
        artifactId,
      );

    if (!content) {
      return;
    }

    downloadTextFile(
      content,
      `${artifactId}.md`,
      "text/markdown",
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Export
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          Export this artifact together
          with its provenance metadata.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={
            handleJSONExport
          }
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] hover:text-white"
        >
          <FileJson className="h-4 w-4" />

          Export JSON

          <Download className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={
            handleMarkdownExport
          }
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] hover:text-white"
        >
          <FileText className="h-4 w-4" />

          Export Markdown

          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}