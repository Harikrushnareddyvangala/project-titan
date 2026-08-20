"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Link2,
  ShieldAlert,
} from "lucide-react";

import { useState } from "react";

import type {
  ResearchLineageNode,
} from "@/types/research";

interface ResearchLineageNodeInspectorProps {
  node: ResearchLineageNode | null;

  inspectionContext?: string | null;

  onOpenArtifact?: (
    node: ResearchLineageNode,
  ) => void;
}

function getNodeTypeLabel(
  type: ResearchLineageNode["type"],
): string {
  switch (type) {
    case "Investigation":
      return "Investigation";

    case "Experiment":
      return "Experiment";

    case "Evidence":
      return "Evidence";

    case "Finding":
      return "Finding";

    case "FindingValidation":
      return "Finding Validation";

    case "Conclusion":
      return "Conclusion";

    default:
      return type;
  }
}

export function ResearchLineageNodeInspector({
  node,
  inspectionContext,
  onOpenArtifact,
}: ResearchLineageNodeInspectorProps) {
  const [openedArtifactKey, setOpenedArtifactKey] =
    useState<string | null>(null);

  const currentNodeKey =
    node
      ? `${node.type}:${node.id}`
      : null;

  if (!node) {
    return (
      <section className="mt-6 rounded-3xl border border-dashed border-white/10 bg-black/20 p-6">
        <div className="flex items-center gap-3">
          <CircleDot className="h-5 w-5 text-zinc-500" />

          <div>
            <h3 className="font-bold text-white">
              Lineage Node Inspector
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Select a node in the lineage graph to inspect its
              research context.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-500/[0.04] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5">
            <CircleDot className="mr-2 h-4 w-4 text-cyan-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Selected Node
            </span>
          </div>

          <h3 className="mt-4 break-words text-xl font-bold text-white">
            {node.title}
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            {getNodeTypeLabel(node.type)}
          </p>
          {inspectionContext ? (
            <div className="mt-3 inline-flex items-center rounded-full border border-amber-400/20 bg-amber-500/[0.06] px-3 py-1.5">
              <ShieldAlert className="mr-2 h-3.5 w-3.5 text-amber-300" />

              <span className="text-xs font-semibold text-amber-200">
                {inspectionContext}
              </span>
            </div>
          ) : null}
        </div>

        <div
          className={
            node.valid
              ? "inline-flex shrink-0 items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"
              : "inline-flex shrink-0 items-center rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300"
          }
        >
          {node.valid ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <ShieldAlert className="mr-2 h-4 w-4" />
          )}

          {node.valid
            ? "Lineage Valid"
            : "Integrity Issues"}
        </div>
      </div>

      {node.description ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Description
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {node.description}
          </p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Type
          </p>

          <p className="mt-2 text-sm font-semibold text-white">
            {getNodeTypeLabel(node.type)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Status
          </p>

          <p className="mt-2 text-sm font-semibold text-white">
            {node.status ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Provenance Events
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {node.provenanceEventCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Integrity Issues
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {node.issueCount}
          </p>
        </div>
      </div>

      {node.missingLinks.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/[0.05] p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-300" />

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Missing Links
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {node.missingLinks.map((link) => (
              <div
                key={link}
                className="flex items-start gap-2 text-sm leading-6 text-zinc-300"
              >
                <Link2 className="mt-1 h-4 w-4 shrink-0 text-amber-300" />

                <span>{link}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {onOpenArtifact ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              onOpenArtifact(node);
              setOpenedArtifactKey(
                currentNodeKey,
              );
            }}
            className="inline-flex items-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/15 hover:text-cyan-200"
          >
            Open artifact
          </button>

          {openedArtifactKey ===
            currentNodeKey ? (
            <p className="mt-2 text-xs font-medium text-emerald-300">
              ✓ Artifact opened from lineage
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Node ID
        </p>

        <p className="mt-2 break-all font-mono text-xs text-zinc-300">
          {node.id}
        </p>
      </div>
    </section>
  );
}
