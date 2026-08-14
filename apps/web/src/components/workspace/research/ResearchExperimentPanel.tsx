"use client";

import {
  FlaskConical,
  Link2,
  Plus,
  Trash2,
  Unlink,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  canTransitionResearchExperiment,
  getResearchEvidence,
  getResearchExperiments,
  getResearchFindings,
  saveResearchExperiment,
  transitionResearchExperiment,
} from "@/lib/research";

import type {
  ResearchEvidence,
  ResearchExperiment,
  ResearchFinding,
  ResearchInvestigation,
  ResearchStatus,
} from "@/types/research";

interface ResearchExperimentPanelProps {
  investigation: ResearchInvestigation;

  onInvestigationUpdated?: (
    investigation: ResearchInvestigation,
  ) => void;
}

const statuses: ResearchStatus[] = [
  "Draft",
  "Investigating",
  "Evidence Collected",
  "Finding Produced",
  "Validated",
  "Published",
];

const nextStatusMap: Record<
  ResearchStatus,
  ResearchStatus[]
> = {
  Draft: [
    "Investigating",
  ],

  Investigating: [
    "Evidence Collected",
  ],

  "Evidence Collected": [
    "Finding Produced",
  ],

  "Finding Produced": [
    "Validated",
  ],

  Validated: [
    "Published",
  ],

  Published: [],
};

export function ResearchExperimentPanel({
  investigation,
  onInvestigationUpdated,
}: ResearchExperimentPanelProps) {
  const [title, setTitle] =
    useState("");

  const [objective, setObjective] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState<ResearchStatus>("Draft");

  const [experiments, setExperiments] =
    useState<ResearchExperiment[]>(() =>
      getResearchExperiments().filter(
        (experiment) =>
          experiment.investigationId ===
          investigation.id,
      ),
    );

  const investigationEvidence =
    useMemo(() => {
      return getResearchEvidence().filter(
        (evidence) =>
          investigation.evidenceIds.includes(
            evidence.id,
          ),
      );
    }, [
      investigation.evidenceIds,
    ]);

  const investigationFindings =
    useMemo(() => {
      return getResearchFindings().filter(
        (finding) =>
          investigation.findingIds.includes(
            finding.id,
          ),
      );
    }, [
      investigation.findingIds,
    ]);

  function createExperiment() {
    const cleanTitle =
      title.trim();

    const cleanObjective =
      objective.trim();

    const cleanDescription =
      description.trim();

    if (
      !cleanTitle ||
      !cleanObjective
    ) {
      return;
    }

    const now =
      new Date().toISOString();

    const experiment:
      ResearchExperiment = {
        id: `experiment-${Date.now()}`,

        investigationId:
          investigation.id,

        title:
          cleanTitle,

        objective:
          cleanObjective,

        status,

        description:
          cleanDescription ||
          undefined,

        evidenceIds: [],

        findingIds: [],

        lifecycle: [],

        createdAt: now,

        updatedAt: now,
      };

    saveResearchExperiment(
      experiment,
    );

    setExperiments((current) => [
      experiment,
      ...current,
    ]);

    const updatedInvestigation:
      ResearchInvestigation = {
        ...investigation,

        experimentIds: [
          ...investigation.experimentIds,
          experiment.id,
        ],

        updatedAt: now,
      };

    onInvestigationUpdated?.(
      updatedInvestigation,
    );

    setTitle("");
    setObjective("");
    setDescription("");
    setStatus("Draft");
  }

  function removeExperiment(
    experiment: ResearchExperiment,
  ) {
    const now =
      new Date().toISOString();

    setExperiments((current) =>
      current.filter(
        (item) =>
          item.id !== experiment.id,
      ),
    );

    const updatedInvestigation:
      ResearchInvestigation = {
        ...investigation,

        experimentIds:
          investigation.experimentIds.filter(
            (id) =>
              id !== experiment.id,
          ),

        updatedAt: now,
      };

    onInvestigationUpdated?.(
      updatedInvestigation,
    );
  }

  function updateExperiment(
    experiment: ResearchExperiment,
    patch: Partial<ResearchExperiment>,
  ) {
    const updatedExperiment:
      ResearchExperiment = {
        ...experiment,
        ...patch,
        updatedAt:
          new Date().toISOString(),
      };

    saveResearchExperiment(
      updatedExperiment,
    );

    setExperiments((current) =>
      current.map((item) =>
        item.id ===
        experiment.id
          ? updatedExperiment
          : item,
      ),
    );
  }

  function transitionExperiment(
    experiment: ResearchExperiment,
    to: ResearchStatus,
  ) {
    if (
      !canTransitionResearchExperiment(
        experiment.status,
        to,
      )
    ) {
      return;
    }

    const updatedExperiment =
      transitionResearchExperiment(
        experiment,
        to,
        `Experiment transitioned from ${experiment.status} to ${to}.`,
      );

    if (!updatedExperiment) {
      return;
    }

    setExperiments((current) =>
      current.map((item) =>
        item.id ===
        updatedExperiment.id
          ? updatedExperiment
          : item,
      ),
    );
  }

  function toggleEvidence(
    experiment: ResearchExperiment,
    evidenceId: string,
  ) {
    const attached =
      experiment.evidenceIds.includes(
        evidenceId,
      );

    const evidenceIds = attached
      ? experiment.evidenceIds.filter(
          (id) =>
            id !== evidenceId,
        )
      : [
          ...experiment.evidenceIds,
          evidenceId,
        ];

    updateExperiment(
      experiment,
      {
        evidenceIds,
      },
    );
  }

  function toggleFinding(
    experiment: ResearchExperiment,
    findingId: string,
  ) {
    const attached =
      experiment.findingIds.includes(
        findingId,
      );

    const findingIds = attached
      ? experiment.findingIds.filter(
          (id) =>
            id !== findingId,
        )
      : [
          ...experiment.findingIds,
          findingId,
        ];

    updateExperiment(
      experiment,
      {
        findingIds,
      },
    );
  }

  return (
    <section className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-5 w-5 text-violet-400" />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
            Research Experimentation
          </p>

          <h4 className="mt-1 text-lg font-bold text-white">
            Experiments
          </h4>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Design, record, and connect engineering
        experiments with the evidence and findings
        produced by an investigation.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* Create Experiment                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
          New Experiment
        </p>

        <div className="mt-4 grid gap-3">
          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            placeholder="Experiment title"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-violet-400/40"
          />

          <input
            value={objective}
            onChange={(event) =>
              setObjective(
                event.target.value,
              )
            }
            placeholder="Experiment objective"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-violet-400/40"
          />

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            rows={3}
            placeholder="Describe the experiment, methodology, variables, or expected outcome..."
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-violet-400/40"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as ResearchStatus,
              )
            }
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-violet-400/40"
          >
            {statuses.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-zinc-950"
                >
                  {item}
                </option>
              ),
            )}
          </select>
        </div>

        <button
          type="button"
          disabled={
            !title.trim() ||
            !objective.trim()
          }
          onClick={
            createExperiment
          }
          className="mt-4 inline-flex items-center rounded-2xl border border-violet-400/40 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Experiment
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Recorded Experiments                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Recorded Experiments
        </p>

        {experiments.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-white/10 p-5 text-center">
            <p className="text-sm text-zinc-600">
              No experiments recorded for
              this investigation.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {experiments.map(
              (experiment) => (
                <ExperimentCard
                  key={experiment.id}
                  experiment={
                    experiment
                  }
                  evidence={
                    investigationEvidence
                  }
                  findings={
                    investigationFindings
                  }
                  onEvidenceToggle={
                    toggleEvidence
                  }
                  onFindingToggle={
                    toggleFinding
                  }
                  onTransition={
                    transitionExperiment
                  }
                  onDelete={() =>
                    removeExperiment(
                      experiment,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Experiment Card                                    */
/* -------------------------------------------------------------------------- */

interface ExperimentCardProps {
  experiment: ResearchExperiment;

  evidence: ResearchEvidence[];

  findings: ResearchFinding[];

  onEvidenceToggle: (
    experiment: ResearchExperiment,
    evidenceId: string,
  ) => void;

  onFindingToggle: (
    experiment: ResearchExperiment,
    findingId: string,
  ) => void;

  onTransition: (
    experiment: ResearchExperiment,
    to: ResearchStatus,
  ) => void;

  onDelete: () => void;
}

function ExperimentCard({
  experiment,
  evidence,
  findings,
  onEvidenceToggle,
  onFindingToggle,
  onTransition,
  onDelete,
}: ExperimentCardProps) {
  const nextStatuses =
    nextStatusMap[
      experiment.status
    ];

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-base font-bold text-white">
              {experiment.title}
            </h5>

            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-300">
              {experiment.status}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {experiment.objective}
          </p>

          {experiment.description && (
            <p className="mt-2 text-xs leading-5 text-zinc-600">
              {experiment.description}
            </p>
          )}

          {/* -------------------------------------------------------------- */}
          {/* Lifecycle                                                       */}
          {/* -------------------------------------------------------------- */}

          <div className="mt-4 rounded-2xl border border-violet-400/10 bg-violet-500/[0.03] p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Experiment Lifecycle
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Current state:{" "}
                  {experiment.status}
                </p>
              </div>

              {nextStatuses.length >
                0 && (
                <select
                  value=""
                  onChange={(event) => {
                    const next =
                      event.target
                        .value as ResearchStatus;

                    if (next) {
                      onTransition(
                        experiment,
                        next,
                      );
                    }
                  }}
                  className="rounded-xl border border-violet-400/20 bg-black/40 px-3 py-2 text-xs font-semibold text-violet-300 outline-none focus:border-violet-400/40"
                >
                  <option
                    value=""
                    className="bg-zinc-950"
                  >
                    Advance lifecycle
                  </option>

                  {nextStatuses.map(
                    (next) => (
                      <option
                        key={next}
                        value={next}
                        className="bg-zinc-950"
                      >
                        → {next}
                      </option>
                    ),
                  )}
                </select>
              )}

              {nextStatuses.length ===
                0 && (
                <span className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold text-zinc-600">
                  Lifecycle complete
                </span>
              )}
            </div>

            {experiment.lifecycle.length >
              0 && (
              <div className="mt-3 space-y-2">
                {experiment.lifecycle.map(
                  (event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-semibold text-zinc-500">
                          {event.from}
                        </span>

                        <span className="text-[10px] text-violet-400">
                          →
                        </span>

                        <span className="text-[10px] font-semibold text-violet-300">
                          {event.to}
                        </span>

                        <span className="text-[10px] text-zinc-700">
                          {new Date(
                            event.timestamp,
                          ).toLocaleString()}
                        </span>
                      </div>

                      {event.reason && (
                        <p className="mt-1 text-[10px] text-zinc-600">
                          {event.reason}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Experiment Evidence                                            */}
          {/* -------------------------------------------------------------- */}

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-cyan-400" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Experiment Evidence
              </p>
            </div>

            {evidence.length === 0 ? (
              <p className="mt-3 text-xs text-zinc-600">
                No investigation evidence is
                available to attach.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {evidence.map(
                  (item) => {
                    const attached =
                      experiment.evidenceIds.includes(
                        item.id,
                      );

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {item.title}
                          </p>

                          <p className="mt-0.5 text-[10px] text-zinc-600">
                            {item.type}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onEvidenceToggle(
                              experiment,
                              item.id,
                            )
                          }
                          className={
                            attached
                              ? "inline-flex shrink-0 items-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                              : "inline-flex shrink-0 items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-500 transition hover:border-cyan-400/30 hover:text-cyan-300"
                          }
                        >
                          {attached ? (
                            <>
                              <Unlink className="mr-1.5 h-3.5 w-3.5" />
                              Attached
                            </>
                          ) : (
                            <>
                              <Link2 className="mr-1.5 h-3.5 w-3.5" />
                              Attach
                            </>
                          )}
                        </button>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Experiment Findings                                            */}
          {/* -------------------------------------------------------------- */}

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-emerald-400" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Experiment Findings
              </p>
            </div>

            {findings.length === 0 ? (
              <p className="mt-3 text-xs text-zinc-600">
                No investigation findings are
                available to attach.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {findings.map(
                  (finding) => {
                    const attached =
                      experiment.findingIds.includes(
                        finding.id,
                      );

                    return (
                      <div
                        key={finding.id}
                        className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-5 text-white">
                              {finding.statement}
                            </p>

                            {finding.confidence !==
                              undefined && (
                              <p className="mt-1 text-[10px] text-zinc-600">
                                Confidence:{" "}
                                {Math.round(
                                  finding.confidence *
                                    100,
                                )}
                                %
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onFindingToggle(
                                experiment,
                                finding.id,
                              )
                            }
                            className={
                              attached
                                ? "inline-flex shrink-0 items-center rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                                : "inline-flex shrink-0 items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-500 transition hover:border-emerald-400/30 hover:text-emerald-300"
                            }
                          >
                            {attached ? (
                              <>
                                <Unlink className="mr-1.5 h-3.5 w-3.5" />
                                Attached
                              </>
                            ) : (
                              <>
                                <Link2 className="mr-1.5 h-3.5 w-3.5" />
                                Attach
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Metrics                                                        */}
          {/* -------------------------------------------------------------- */}

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500">
              Evidence:{" "}
              {
                experiment
                  .evidenceIds
                  .length
              }
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500">
              Findings:{" "}
              {
                experiment
                  .findingIds
                  .length
              }
            </span>

            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-300">
              Lifecycle:{" "}
              {
                experiment
                  .lifecycle
                  .length
              }
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Remove ${experiment.title}`}
          className="rounded-xl border border-white/10 p-2 text-zinc-600 transition hover:border-red-400/30 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}