"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useSyncExternalStore } from "react";

import {
  getResearchLineageIntegrityCategory,
  subscribeToResearch,
  validateResearchLineage,
} from "@/lib/research";

import type {
  ResearchLineageIntegrityCategory,
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityResult,
} from "@/types/research";

interface ResearchLineageIntegrityProps {
  investigationId: string;
  onSelectNode?: (nodeId: string | null) => void;
}

const EMPTY_RESULT: ResearchLineageIntegrityResult = {
  investigationId: "",
  valid: true,
  checkedNodeCount: 0,
  checkedEdgeCount: 0,
  issueCount: 0,
  issues: [],
};

const cache = new Map<
  string,
  {
    raw: string | null;
    result: ResearchLineageIntegrityResult;
  }
>();

function getSnapshot(
  investigationId: string,
): ResearchLineageIntegrityResult {
  if (typeof window === "undefined") {
    return EMPTY_RESULT;
  }

  const raw =
    localStorage.getItem(
      "titan:research-provenance-events",
    );

  const cached = cache.get(
    investigationId,
  );

  if (
    cached &&
    cached.raw === raw
  ) {
    return cached.result;
  }

  const result =
    validateResearchLineage(
      investigationId,
    );

  cache.set(
    investigationId,
    {
      raw,
      result,
    },
  );

  return result;
}

function IssueCard({
  issue,
  onSelectNode,
}: {
  issue: ResearchLineageIntegrityIssue;
  onSelectNode?: (nodeId: string | null) => void;
}) {
  const targetNodeId =
    issue.nodeId ??
    (
      issue.code === "SOURCE_NODE_NOT_FOUND"
        ? issue.targetId
        : issue.code === "TARGET_NODE_NOT_FOUND"
          ? issue.sourceId
          : issue.sourceId ?? issue.targetId
    ) ??
    null;

  const category:
    ResearchLineageIntegrityCategory =
    getResearchLineageIntegrityCategory(
      issue.code,
    );
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.05] p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              {issue.code}
            </p>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {category}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {issue.message}
          </p>

          {issue.nodeId ? (
            <p className="mt-2 break-all font-mono text-xs text-zinc-600">
              Node: {issue.nodeId}
            </p>
          ) : null}

          {issue.edgeId ? (
            <p className="mt-1 break-all font-mono text-xs text-zinc-600">
              Edge: {issue.edgeId}
            </p>
          ) : null}

          {issue.sourceId &&
            issue.targetId ? (
            <p className="mt-1 break-all font-mono text-xs text-zinc-600">
              {issue.sourceId} → {issue.targetId}
            </p>
          ) : null}

          {targetNodeId && onSelectNode ? (
            <button
              type="button"
              onClick={() => onSelectNode(targetNodeId)}
              className="mt-4 inline-flex items-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/15"
            >
              <ArrowUpRight className="mr-2 h-3.5 w-3.5" />
              Inspect in lineage
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

export function ResearchLineageIntegrity({
  investigationId,
  onSelectNode,
}: ResearchLineageIntegrityProps) {
  const result =
    useSyncExternalStore(
      subscribeToResearch,
      () => getSnapshot(
        investigationId,
      ),
      () => EMPTY_RESULT,
    );

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5">
            <ShieldAlert className="mr-2 h-4 w-4 text-cyan-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Lineage Integrity
            </span>
          </div>

          <h3 className="mt-4 text-xl font-bold text-white">
            Research Graph Integrity
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
            Structural validation of research lineage nodes,
            relationships, and underlying provenance.
          </p>
        </div>

        <div
          className={
            result.valid
              ? "inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"
              : "inline-flex items-center rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300"
          }
        >
          {result.valid ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <AlertTriangle className="mr-2 h-4 w-4" />
          )}

          {result.valid
            ? "Lineage Valid"
            : `${result.issueCount} Issue${result.issueCount === 1
              ? ""
              : "s"
            } Detected`}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Nodes Checked"
          value={result.checkedNodeCount}
        />

        <Metric
          label="Edges Checked"
          value={result.checkedEdgeCount}
        />

        <Metric
          label="Issues"
          value={result.issueCount}
        />
      </div>

      {result.issues.length > 0 ? (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-300" />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Integrity Findings
            </p>
          </div>

          {result.issues.map(
            (issue, index) => (
              <IssueCard
                key={`${issue.code}-${issue.nodeId ?? issue.edgeId ?? index}`}
                issue={issue}
                onSelectNode={onSelectNode}
              />
            ),
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.05] p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />

            <div>
              <p className="font-semibold text-emerald-300">
                Lineage structure is valid.
              </p>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                All checked nodes and relationships satisfy
                the current research lineage integrity rules.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
