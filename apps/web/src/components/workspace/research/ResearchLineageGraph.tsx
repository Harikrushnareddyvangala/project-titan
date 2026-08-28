"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  GitBranch,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { useSyncExternalStore, useState, } from "react";

import {
  getResearchLineage,
  getResearchPersistenceSnapshot,
  subscribeToResearch,
} from "@/lib/research";

import type {
  ResearchLineageEdge,
  ResearchLineageNode,
  ResearchLineageNodeType,
} from "@/types/research";

interface ResearchLineageGraphProps {
  investigationId: string;
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
}

const EMPTY_LINEAGE = {
  investigationId: "",
  nodes: [],
  edges: [],
  valid: true,
  issueCount: 0,
};

const snapshotCache = new Map<
  string,
  {
    raw: string | null;
    snapshot: ReturnType<typeof getResearchLineage>;
  }
>();

function getSnapshot(
  investigationId: string,
) {
  if (typeof window === "undefined") {
    return EMPTY_LINEAGE;
  }

  const raw = getResearchPersistenceSnapshot();

  const cached =
    snapshotCache.get(investigationId);

  if (cached && cached.raw === raw) {
    return cached.snapshot;
  }

  const snapshot =
    getResearchLineage(
      investigationId,
    );

  snapshotCache.set(
    investigationId,
    {
      raw,
      snapshot,
    },
  );

  return snapshot;
}

function getNodeIcon(
  type: ResearchLineageNodeType,
) {
  switch (type) {
    case "Investigation":
      return (
        <GitBranch className="h-4 w-4 text-cyan-300" />
      );

    case "Experiment":
      return (
        <CircleDot className="h-4 w-4 text-cyan-300" />
      );

    case "Evidence":
      return (
        <Link2 className="h-4 w-4 text-cyan-300" />
      );

    case "Finding":
      return (
        <ShieldCheck className="h-4 w-4 text-cyan-300" />
      );

    case "FindingValidation":
      return (
        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
      );

    case "Conclusion":
      return (
        <GitBranch className="h-4 w-4 text-cyan-300" />
      );

    default:
      return (
        <CircleDot className="h-4 w-4 text-cyan-300" />
      );
  }
}

function getNodeLabel(
  type: ResearchLineageNodeType,
) {
  switch (type) {
    case "FindingValidation":
      return "Validation";

    default:
      return type;
  }
}

function LineageNode({
  node,
  selected,
  onSelect,
}: {
  node: ResearchLineageNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        selected
          ? "w-full rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4 text-left shadow-[0_0_30px_rgba(34,211,238,0.08)]"
          : "w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-950">
          {getNodeIcon(node.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                {getNodeLabel(node.type)}
              </p>

              <h4 className="mt-1 truncate text-sm font-bold text-white">
                {node.title}
              </h4>
            </div>

            {node.valid ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
            )}
          </div>

          {node.description ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
              {node.description}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {node.status ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-400">
                {node.status}
              </span>
            ) : null}

            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] text-cyan-300">
              {node.provenanceEventCount} provenance
            </span>

            {node.issueCount > 0 ? (
              <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-300">
                {node.issueCount} issue
                {node.issueCount === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function EdgeRow({
  edge,
  source,
  target,
}: {
  edge: ResearchLineageEdge;
  source?: ResearchLineageNode;
  target?: ResearchLineageNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="min-w-0 flex-1 truncate text-xs text-zinc-400">
        {source?.title ?? edge.sourceId}
      </span>

      <div className="flex shrink-0 items-center gap-2">
        <div className="h-px w-5 bg-white/20" />

        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">
          {edge.label}
        </span>

        <div className="h-px w-5 bg-white/20" />
      </div>

      <span className="min-w-0 flex-1 truncate text-right text-xs text-zinc-400">
        {target?.title ?? edge.targetId}
      </span>
    </div>
  );
}

export function ResearchLineageGraph({
  investigationId,
  selectedNodeId,
  onNodeSelect,
}: ResearchLineageGraphProps) {
  const lineage =
    useSyncExternalStore(
      subscribeToResearch,
      () => getSnapshot(investigationId),
      () => EMPTY_LINEAGE,
    );

  const [internalSelectedNodeId, setInternalSelectedNodeId] =
    useState<string | null>(null);

  const activeSelectedNodeId =
    selectedNodeId !== undefined
      ? selectedNodeId
      : internalSelectedNodeId;

  const selectNode = (nodeId: string | null) => {
    if (selectedNodeId === undefined) {
      setInternalSelectedNodeId(nodeId);
    }

    onNodeSelect?.(nodeId);
  };

  const selectedNode =
    lineage.nodes.find(
      (node) =>
        node.id === activeSelectedNodeId,
    );

  const nodeGroups =
    [
      "Investigation",
      "Experiment",
      "Evidence",
      "Finding",
      "FindingValidation",
      "Conclusion",
    ] as ResearchLineageNodeType[];

  return (
    <section className="mt-6 rounded-[34px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
            <GitBranch className="mr-2 h-4 w-4 text-cyan-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Research Lineage
            </span>
          </div>

          <h3 className="mt-5 text-2xl font-black text-white">
            Evidence → Finding → Validation → Conclusion
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
            Structural view of how this investigation&apos;s
            research artifacts connect and evolve.
          </p>
        </div>

        <div
          className={
            lineage.valid
              ? "inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"
              : "inline-flex items-center rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300"
          }
        >
          {lineage.valid ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <AlertTriangle className="mr-2 h-4 w-4" />
          )}

          {lineage.valid
            ? "Lineage Valid"
            : `${lineage.issueCount} Lineage Issue${
                lineage.issueCount === 1
                  ? ""
                  : "s"
              }`}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Nodes
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {lineage.nodes.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Relationships
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {lineage.edges.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Integrity
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {lineage.valid
              ? "Valid"
              : "Review"}
          </p>
        </div>
      </div>

      {lineage.nodes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
          <p className="text-sm text-zinc-500">
            No lineage nodes are available for this
            investigation.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {nodeGroups.map((type) => {
              const nodes =
                lineage.nodes.filter(
                  (node) =>
                    node.type === type,
                );

              if (nodes.length === 0) {
                return null;
              }

              return (
                <div key={type}>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {getNodeLabel(type)}
                    </h4>

                    <span className="text-xs text-zinc-600">
                      {nodes.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {nodes.map((node) => (
                      <LineageNode
                        key={node.id}
                        node={node}
                        selected={
                          activeSelectedNodeId ===
                          node.id
                        }
                        onSelect={() =>
                          selectNode(
                            node.id,
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Relationships
              </h4>

              <span className="text-xs text-zinc-600">
                {lineage.edges.length}
              </span>
            </div>

            <div className="space-y-2">
              {lineage.edges.map((edge) => (
                <EdgeRow
                  key={edge.id}
                  edge={edge}
                  source={lineage.nodes.find(
                    (node) =>
                      node.id ===
                      edge.sourceId,
                  )}
                  target={lineage.nodes.find(
                    (node) =>
                      node.id ===
                      edge.targetId,
                  )}
                />
              ))}
            </div>
          </div>

          {selectedNode ? (
            <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.04] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Selected Node
                  </p>

                  <h4 className="mt-2 text-lg font-bold text-white">
                    {selectedNode.title}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    selectNode(null)
                  }
                  className="text-xs text-zinc-500 transition hover:text-white"
                >
                  Clear
                </button>
              </div>

              {selectedNode.description ? (
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {selectedNode.description}
                </p>
              ) : null}

              {selectedNode.missingLinks.length > 0 ? (
                <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/[0.05] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                    Missing Links
                  </p>

                  <ul className="mt-2 space-y-1 text-sm text-amber-200/70">
                    {selectedNode.missingLinks.map(
                      (link) => (
                        <li key={link}>
                          • {link}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
