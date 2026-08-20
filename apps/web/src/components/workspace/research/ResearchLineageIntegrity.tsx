"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import {
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  getResearchLineage,
  getResearchLineageIntegrityIssueAction,
  getResearchLineageIntegrityIssueExplanation,
  getResearchLineageIntegrityAssessment,
  getResearchLineageIntegrityAssessmentExplanation,
  getResearchLineageIntegrityInspectionNodeId,
  getResearchLineageIntegrityCategory,
  getResearchLineageIntegrityPriority,
  getResearchLineageIntegrityPrioritySummary,
  subscribeToResearch,
  validateResearchLineage,
} from "@/lib/research";

import type {
  ResearchLineage,
  ResearchLineageIntegrityCategory,
  ResearchLineageIntegrityIssue,
  ResearchLineageIntegrityPriority,
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
  lineage,
  onSelectNode,
}: {
  issue: ResearchLineageIntegrityIssue;
  lineage: ResearchLineage;
  onSelectNode?: (nodeId: string | null) => void;
}) {
  const priority =
    getResearchLineageIntegrityPriority(
      issue.code,
    );

  const explanation =
    getResearchLineageIntegrityIssueExplanation(
      issue.code,
    );

  const action =
    getResearchLineageIntegrityIssueAction(
      issue,
    );

  const inspectionNodeId =
    getResearchLineageIntegrityInspectionNodeId(
      issue,
      lineage,
    );

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
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                {issue.code}
              </p>

              <span
                className={
                  priority === "Critical"
                    ? "rounded-full border border-red-400/30 bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-300"
                    : priority === "High"
                      ? "rounded-full border border-orange-400/30 bg-orange-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-300"
                      : priority === "Medium"
                        ? "rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-300"
                        : "rounded-full border border-zinc-400/20 bg-zinc-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400"
                }
              >
                {priority}
              </span>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {category}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {issue.message}
          </p>

          <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3">
            <p className="text-sm font-semibold text-zinc-200">
              {explanation.title}
            </p>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              {explanation.description}
            </p>

            <p className="mt-2 text-xs leading-5 text-cyan-200/80">
              <span className="font-semibold">
                Recommended action:
              </span>{" "}
              {explanation.recommendation}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Next action
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  {action.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (inspectionNodeId && onSelectNode) {
                    onSelectNode(inspectionNodeId);
                  }
                }}
                disabled={!inspectionNodeId || !onSelectNode}
                className="inline-flex items-center rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {inspectionNodeId
                  ? action.action === "Inspect"
                    ? action.label
                    : "Inspect in lineage"
                  : "No target available"}
                {inspectionNodeId && action.requiresConfirmation
                  ? " · Confirmation required"
                  : ""}
              </button>
            </div>
          </div>

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

  const lineage = getResearchLineage(
    investigationId,
  );

  const [activeCategory, setActiveCategory] =
    useState<ResearchLineageIntegrityCategory | "All">(
      "All",
    );

  const [activePriority, setActivePriority] =
    useState<ResearchLineageIntegrityPriority | "All">(
      "All",
    );

  const prioritySummary =
    useMemo(
      () =>
        getResearchLineageIntegrityPrioritySummary(
          result.issues,
        ),
      [result.issues],
    );

  const assessment =
    getResearchLineageIntegrityAssessment(
      prioritySummary,
    );

  const assessmentExplanation =
    getResearchLineageIntegrityAssessmentExplanation(
      prioritySummary,
    );

  const priorityCounts = {
    Critical: prioritySummary.critical,
    High: prioritySummary.high,
    Medium: prioritySummary.medium,
    Low: prioritySummary.low,
  };

  const categoryCounts =
    useMemo(() => {
      const counts =
        new Map<
          ResearchLineageIntegrityCategory,
          number
        >();

      for (const issue of result.issues) {
        const category =
          getResearchLineageIntegrityCategory(
            issue.code,
          );

        counts.set(
          category,
          (counts.get(category) ?? 0) + 1,
        );
      }

      return counts;
    }, [result.issues]);

  const visibleIssues =
    useMemo(() => {
      const priorityRank: Record<
        ResearchLineageIntegrityPriority,
        number
      > = {
        Critical: 0,
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return result.issues
        .filter(
          (issue) => {
            const category =
              getResearchLineageIntegrityCategory(
                issue.code,
              );

            const priority =
              getResearchLineageIntegrityPriority(
                issue.code,
              );

            const categoryMatches =
              activeCategory === "All" ||
              category === activeCategory;

            const priorityMatches =
              activePriority === "All" ||
              priority === activePriority;

            return (
              categoryMatches &&
              priorityMatches
            );
          },
        )
        .sort(
          (a, b) =>
            priorityRank[
            getResearchLineageIntegrityPriority(
              a.code,
            )
            ] -
            priorityRank[
            getResearchLineageIntegrityPriority(
              b.code,
            )
            ],
        );
    }, [
      activeCategory,
      activePriority,
      result.issues,
    ]);

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
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Metric
          label="Critical"
          value={prioritySummary.critical}
        />

        <Metric
          label="High"
          value={prioritySummary.high}
        />

        <Metric
          label="Medium"
          value={prioritySummary.medium}
        />

        <Metric
          label="Low"
          value={prioritySummary.low}
        />
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Highest Priority
          </span>

          <span className="text-sm font-bold text-white">
            {prioritySummary.highestPriority ?? "None"}
          </span>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Assessment
          </span>

          <span className="text-sm font-bold text-white">
            {assessment}
          </span>
        </div>

        <div className="mt-3">
          <p className="text-sm font-semibold text-zinc-200">
            {assessmentExplanation.title}
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {assessmentExplanation.description}
          </p>

          <div className="mt-3 rounded-xl border border-cyan-400/10 bg-cyan-500/[0.04] px-3 py-2">
            <p className="text-xs leading-5 text-cyan-200/80">
              <span className="font-semibold">
                Recommended action:
              </span>{" "}
              {assessmentExplanation.recommendation}
            </p>
          </div>
        </div>
      </div>
      {result.issues.length > 0 ? (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-300" />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Integrity Findings
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                "All",
                "Investigation",
                "Node",
                "Edge",
                "Scope",
                "Reference",
                "Provenance",
              ] as const
            ).map((category) => {
              const count =
                category === "All"
                  ? result.issues.length
                  : categoryCounts.get(
                    category,
                  ) ?? 0;

              if (
                category !== "All" &&
                count === 0
              ) {
                return null;
              }

              const active =
                activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category,
                    )
                  }
                  className={
                    active
                      ? "rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-300"
                      : "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
                  }
                >
                  {category}
                  <span className="ml-2 text-zinc-600">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                "All",
                "Critical",
                "High",
                "Medium",
                "Low",
              ] as const
            ).map((priority) => {
              const count =
                priority === "All"
                  ? result.issues.length
                  : priorityCounts[priority];

              if (
                priority !== "All" &&
                count === 0
              ) {
                return null;
              }

              const active =
                activePriority === priority;

              return (
                <button
                  key={priority}
                  type="button"
                  onClick={() =>
                    setActivePriority(
                      priority,
                    )
                  }
                  className={
                    active
                      ? "rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-300"
                      : "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
                  }
                >
                  {priority}
                  <span className="ml-2 text-zinc-600">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-300" />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Integrity Findings
            </p>
          </div>

          {visibleIssues.map(
            (issue, index) => (
              <IssueCard
                key={`${issue.code}-${issue.nodeId ?? issue.edgeId ?? index}`}
                issue={issue}
                lineage={lineage}
                onSelectNode={onSelectNode}
              />
            ),
          )}
          {visibleIssues.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-zinc-500">
                No integrity findings match the
                selected filters.
              </p>
            </div>
          ) : null}
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
