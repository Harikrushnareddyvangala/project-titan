"use client";

import {
  CheckCircle2,
  Clock3,
  History,
  Plus,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createResearchEvidenceAssessment,
  createResearchFindingValidation,
  getResearchEvidence,
  getResearchFindingValidationHistory,
  getResearchFindingValidations,
  getResearchFindings,
  saveResearchFinding,
  transitionResearchFindingValidation,
} from "@/lib/research";

import {
  evaluateFindingValidationEligibility,
  summarizeEvidenceAssessments,
} from "@/lib/research/evidence/assessmentAnalysis";

import type {
  ResearchEvidenceAssessmentType,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchFindingValidationHistoryEvent,
  ResearchInvestigation,
  ResearchValidationStatus,
} from "@/types/research";

/* -------------------------------------------------------------------------- */
/*                         Component Props                                    */
/* -------------------------------------------------------------------------- */

interface ResearchFindingPanelProps {
  investigation: ResearchInvestigation;

  onInvestigationUpdated?: (
    investigation: ResearchInvestigation,
  ) => void;

  focusedArtifactId?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                         Assessment Draft                                   */
/* -------------------------------------------------------------------------- */

interface AssessmentDraft {
  evidenceId: string;

  type: ResearchEvidenceAssessmentType;

  relevance: number;

  supportStrength: number;

  reliability: number;

  independence: number;

  rationale: string;
}

/* -------------------------------------------------------------------------- */
/*                         Main Component                                     */
/* -------------------------------------------------------------------------- */

export function ResearchFindingPanel({
  investigation,
  onInvestigationUpdated,
  focusedArtifactId,
}: ResearchFindingPanelProps) {
  useEffect(() => {
    if (!focusedArtifactId) {
      return;
    }

    const element = document.querySelector(
      `[data-research-artifact-id="${focusedArtifactId}"]`,
    );

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedArtifactId]);

  const [statement, setStatement] =
    useState("");

  const [assessments, setAssessments] =
    useState<AssessmentDraft[]>([]);

  const [saving, setSaving] =
    useState(false);

  /*
   * Forces the component to re-read localStorage after
   * validation operations that do not modify the
   * investigation itself.
   */
  const [refreshKey, setRefreshKey] =
    useState(0);

  /* ---------------------------------------------------------------------- */
  /* Existing Findings                                                      */
  /* ---------------------------------------------------------------------- */

  const findings = useMemo(() => {
    return getResearchFindings().filter(
      (finding) =>
        investigation.findingIds.includes(
          finding.id,
        ),
    );
  }, [
    investigation.findingIds,
    refreshKey,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Available Evidence                                                     */
  /* ---------------------------------------------------------------------- */

  const availableEvidence = useMemo(() => {
    return getResearchEvidence().filter(
      (evidence) =>
        investigation.evidenceIds.includes(
          evidence.id,
        ),
    );
  }, [
    investigation.evidenceIds,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Add Evidence Assessment                                                */
  /* ---------------------------------------------------------------------- */

  function addEvidenceAssessment(
    evidenceId: string,
  ) {
    setAssessments((current) => {
      if (
        current.some(
          (item) =>
            item.evidenceId ===
            evidenceId,
        )
      ) {
        return current;
      }

      return [
        ...current,
        {
          evidenceId,
          type: "Supporting",
          relevance: 0.8,
          supportStrength: 0.8,
          reliability: 0.8,
          independence: 0.8,
          rationale: "",
        },
      ];
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Remove Evidence Assessment                                             */
  /* ---------------------------------------------------------------------- */

  function removeEvidenceAssessment(
    evidenceId: string,
  ) {
    setAssessments((current) =>
      current.filter(
        (item) =>
          item.evidenceId !==
          evidenceId,
      ),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Update Evidence Assessment                                             */
  /* ---------------------------------------------------------------------- */

  function updateAssessment(
    evidenceId: string,
    patch: Partial<AssessmentDraft>,
  ) {
    setAssessments((current) =>
      current.map((item) =>
        item.evidenceId === evidenceId
          ? {
            ...item,
            ...patch,
          }
          : item,
      ),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Create Finding                                                          */
  /* ---------------------------------------------------------------------- */

  function createFinding() {
    const cleanStatement =
      statement.trim();

    if (!cleanStatement) {
      return;
    }

    setSaving(true);

    try {
      const now =
        new Date().toISOString();

      const evidenceAssessments =
        assessments.map(
          (draft) =>
            createResearchEvidenceAssessment(
              {
                evidenceId:
                  draft.evidenceId,

                type:
                  draft.type,

                relevance:
                  clampScore(
                    draft.relevance,
                  ),

                supportStrength:
                  clampScore(
                    draft.supportStrength,
                  ),

                reliability:
                  clampScore(
                    draft.reliability,
                  ),

                independence:
                  clampScore(
                    draft.independence,
                  ),

                rationale:
                  draft.rationale.trim() ||
                  undefined,
              },
            ),
        );

      const summary =
        summarizeEvidenceAssessments(
          evidenceAssessments,
        );

      /*
       * No evidence means confidence is intentionally
       * undefined. This is different from confidence = 0.
       */
      const confidence =
        evidenceAssessments.length > 0
          ? summary.derivedConfidence
          : undefined;

      const finding:
        ResearchFinding = {
        id:
          `finding-${Date.now()}`,

        statement:
          cleanStatement,

        evidenceAssessments,

        confidence,

        validationIds: [],

        createdAt: now,

        updatedAt: now,
      };

      saveResearchFinding(
        finding,
      );

      const alreadyAttached =
        investigation.findingIds.includes(
          finding.id,
        );

      const updatedInvestigation:
        ResearchInvestigation = {
        ...investigation,

        findingIds:
          alreadyAttached
            ? investigation.findingIds
            : [
              ...investigation.findingIds,
              finding.id,
            ],

        updatedAt: now,
      };

      onInvestigationUpdated?.(
        updatedInvestigation,
      );

      setStatement("");

      setAssessments([]);

      setRefreshKey(
        (value) => value + 1,
      );
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Remove Finding                                                         */
  /* ---------------------------------------------------------------------- */

  function removeFinding(
    findingId: string,
  ) {
    const updatedInvestigation:
      ResearchInvestigation = {
      ...investigation,

      findingIds:
        investigation.findingIds.filter(
          (id) =>
            id !== findingId,
        ),

      updatedAt:
        new Date().toISOString(),
    };

    onInvestigationUpdated?.(
      updatedInvestigation,
    );

    setRefreshKey(
      (value) => value + 1,
    );
  }

  return (
    <section className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-5">
      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Findings
          </p>

          <h4 className="mt-1 text-lg font-bold text-white">
            Investigation Findings
          </h4>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Finding Statement                                                  */}
      {/* ================================================================== */}

      <div className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Finding Statement
        </label>

        <textarea
          value={statement}
          onChange={(event) =>
            setStatement(
              event.target.value,
            )
          }
          rows={3}
          placeholder="State the technical finding, observation, or research hypothesis..."
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/40"
        />

        {!statement.trim() && (
          <p className="mt-2 text-xs text-zinc-600">
            Enter a finding statement to
            enable Create Finding.
          </p>
        )}
      </div>

      {/* ================================================================== */}
      {/* Evidence Assessment                                                */}
      {/* ================================================================== */}

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Evidence Assessment
          </p>

          <p className="mt-2 text-xs leading-5 text-zinc-600">
            Assess each evidence item
            independently. A finding may
            contain supporting,
            contradicting, and neutral
            evidence.
          </p>
        </div>

        {availableEvidence.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-5">
            <p className="text-sm text-zinc-500">
              No evidence is currently
              attached to this
              investigation.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {availableEvidence.map(
              (evidence) => {
                const selected =
                  assessments.some(
                    (item) =>
                      item.evidenceId ===
                      evidence.id,
                  );

                const assessment =
                  assessments.find(
                    (item) =>
                      item.evidenceId ===
                      evidence.id,
                  );

                return (
                  <div
                    key={
                      evidence.id
                    }
                    className={`rounded-2xl border p-4 transition ${selected
                      ? "border-emerald-400/30 bg-emerald-500/[0.04]"
                      : "border-white/10 bg-black/20"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {evidence.title}
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                          {evidence.type}
                        </p>

                        {evidence.description && (
                          <p className="mt-2 text-xs leading-5 text-zinc-500">
                            {
                              evidence.description
                            }
                          </p>
                        )}

                        {evidence.reference && (
                          <p className="mt-2 break-all text-xs text-zinc-700">
                            Reference:{" "}
                            {
                              evidence.reference
                            }
                          </p>
                        )}
                      </div>

                      {!selected ? (
                        <button
                          type="button"
                          onClick={() =>
                            addEvidenceAssessment(
                              evidence.id,
                            )
                          }
                          className="inline-flex shrink-0 items-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                        >
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Assess
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            removeEvidenceAssessment(
                              evidence.id,
                            )
                          }
                          aria-label={`Remove assessment for ${evidence.title}`}
                          className="rounded-xl border border-white/10 p-2 text-zinc-500 transition hover:border-red-400/30 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {selected &&
                      assessment && (
                        <EvidenceAssessmentEditor
                          assessment={
                            assessment
                          }
                          onChange={(
                            patch,
                          ) =>
                            updateAssessment(
                              evidence.id,
                              patch,
                            )
                          }
                        />
                      )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* Create Finding                                                     */}
      {/* ================================================================== */}

      <button
        type="button"
        disabled={
          saving ||
          !statement.trim()
        }
        onClick={
          createFinding
        }
        className="mt-5 inline-flex items-center rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="mr-2 h-4 w-4" />

        {saving
          ? "Creating..."
          : "Create Finding"}
      </button>

      {/* ================================================================== */}
      {/* Existing Findings                                                  */}
      {/* ================================================================== */}

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Recorded Findings
        </p>

        {findings.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-white/10 p-5 text-center">
            <p className="text-sm text-zinc-600">
              No findings recorded for
              this investigation.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            {findings.map(
              (finding) => (
                <FindingCard
                  key={
                    finding.id
                  }
                  finding={
                    finding
                  }
                  focused={
                    focusedArtifactId ===
                    finding.id
                  }
                  onDelete={() =>
                    removeFinding(
                      finding.id,
                    )
                  }
                  onChanged={() =>
                    setRefreshKey(
                      (value) =>
                        value + 1,
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
/*                         Finding Card                                       */
/* -------------------------------------------------------------------------- */

interface FindingCardProps {
  finding: ResearchFinding;

  focused?: boolean;

  onDelete: () => void;

  onChanged: () => void;
}

function FindingCard({
  finding,
  focused,
  onDelete,
  onChanged,
}: FindingCardProps) {
  const [reviewing, setReviewing] =
    useState(false);

  const [reviewReason, setReviewReason] =
    useState("");

  const validations =
    useMemo(
      () =>
        getResearchFindingValidations().filter(
          (validation) =>
            validation.findingId ===
            finding.id,
        ),
      [finding.id, reviewing],
    );

  const latestValidation =
    resolveLatestValidation(
      finding,
      validations,
    );

  const history =
    useMemo(() => {
      if (!latestValidation) {
        return [];
      }

      return getResearchFindingValidationHistory()
        .filter(
          (event) =>
            event.validationId ===
            latestValidation.id,
        )
        .sort(
          (a, b) =>
            new Date(
              a.timestamp,
            ).getTime() -
            new Date(
              b.timestamp,
            ).getTime(),
        );
    }, [
      latestValidation,
      reviewing,
    ]);

  const eligibility =
    evaluateFindingValidationEligibility(
      finding.evidenceAssessments,
      finding.confidence,
    );

  const activeReview =
    latestValidation &&
    (
      latestValidation.status ===
      "Pending" ||
      latestValidation.status ===
      "In Review"
    );

  function requestValidation() {
    const result =
      createResearchFindingValidation(
        finding.id,
        {
          status: "Pending",
          validator:
            "TITAN Research Review",
        },
      );

    if (!result.success) {
      return;
    }

    setReviewReason("");

    setReviewing(true);

    onChanged();
  }

  function moveToReview() {
    if (!latestValidation) {
      return;
    }

    const result =
      transitionResearchFindingValidation(
        latestValidation.id,
        "In Review",
      );

    if (!result) {
      return;
    }

    onChanged();
  }

  function completeReview(
    status:
      | "Validated"
      | "Rejected"
      | "Needs Revision",
  ) {
    const reason =
      reviewReason.trim();

    if (!latestValidation) {
      return;
    }

    if (!reason) {
      return;
    }

    const result =
      transitionResearchFindingValidation(
        latestValidation.id,
        status,
        reason,
      );

    if (!result) {
      return;
    }

    setReviewReason("");

    setReviewing(false);

    onChanged();
  }

  const confidenceLabel =
    finding.confidence ===
      undefined
      ? "Not available"
      : `${Math.round(
        finding.confidence * 100,
      )}%`;

  return (
    <article
      data-research-artifact-id={finding.id}
      className={`rounded-2xl border p-5 transition ${focused
          ? "border-cyan-400/60 bg-cyan-500/[0.08] ring-1 ring-cyan-400/30"
          : "border-white/10 bg-white/[0.02]"
        }`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Finding Header                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 text-white">
            {finding.statement}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
              Confidence:{" "}
              {confidenceLabel}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500">
              Evidence:{" "}
              {
                finding
                  .evidenceAssessments
                  .length
              }
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500">
              Supporting:{" "}
              {
                eligibility.supportingEvidenceCount
              }
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500">
              Contradicting:{" "}
              {
                eligibility.contradictingEvidenceCount
              }
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Remove ${finding.statement}`}
          className="rounded-xl border border-white/10 p-2 text-zinc-600 transition hover:border-red-400/30 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Validation Review                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Validation Review
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                Research Validation
              </p>
            </div>
          </div>

          {latestValidation && (
            <ValidationStatusBadge
              status={
                latestValidation.status
              }
            />
          )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Eligibility                                                     */}
        {/* -------------------------------------------------------------- */}

        <div
          className={`mt-4 rounded-2xl border p-4 ${eligibility.eligible
            ? "border-emerald-400/20 bg-emerald-500/[0.04]"
            : "border-amber-400/20 bg-amber-500/[0.04]"
            }`}
        >
          <div className="flex items-center gap-2">
            {eligibility.eligible ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <XCircle className="h-4 w-4 text-amber-400" />
            )}

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Validation Eligibility
            </p>
          </div>

          {eligibility.eligible ? (
            <p className="mt-2 text-sm text-emerald-300">
              This finding satisfies the
              current validation
              eligibility policy.
            </p>
          ) : (
            <div className="mt-2 space-y-1.5">
              {eligibility.reasons.map(
                (reason) => (
                  <p
                    key={reason}
                    className="text-xs leading-5 text-amber-300"
                  >
                    • {reason}
                  </p>
                ),
              )}
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Review Controls                                                 */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-4">
          {!latestValidation ? (
            <button
              type="button"
              disabled={
                !eligibility.eligible
              }
              onClick={
                requestValidation
              }
              className="inline-flex items-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />

              Request Validation
            </button>
          ) : activeReview ? (
            <div className="space-y-3">
              {latestValidation.status ===
                "Pending" && (
                  <button
                    type="button"
                    onClick={
                      moveToReview
                    }
                    className="inline-flex items-center rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
                  >
                    <Clock3 className="mr-2 h-4 w-4" />

                    Begin Review
                  </button>
                )}

              {latestValidation.status ===
                "In Review" && (
                  <>
                    <textarea
                      value={
                        reviewReason
                      }
                      onChange={(
                        event,
                      ) =>
                        setReviewReason(
                          event.target
                            .value,
                        )
                      }
                      rows={3}
                      placeholder="Explain the validation decision..."
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
                    />

                    <p className="text-[11px] text-zinc-600">
                      A rationale is required
                      for every terminal
                      validation decision.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={
                          !reviewReason.trim()
                        }
                        onClick={() =>
                          completeReview(
                            "Validated",
                          )
                        }
                        className="inline-flex items-center rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />

                        Accept
                      </button>

                      <button
                        type="button"
                        disabled={
                          !reviewReason.trim()
                        }
                        onClick={() =>
                          completeReview(
                            "Rejected",
                          )
                        }
                        className="inline-flex items-center rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <XCircle className="mr-1.5 h-4 w-4" />

                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={
                          !reviewReason.trim()
                        }
                        onClick={() =>
                          completeReview(
                            "Needs Revision",
                          )
                        }
                        className="inline-flex items-center rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Clock3 className="mr-1.5 h-4 w-4" />

                        Needs Revision
                      </button>
                    </div>
                  </>
                )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-zinc-500" />

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Review Decision
                  </p>
                </div>

                {latestValidation.decision && (
                  <p className="mt-2 text-sm font-semibold text-white">
                    {
                      latestValidation.decision
                    }
                  </p>
                )}

                {latestValidation.rationale && (
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {
                      latestValidation.rationale
                    }
                  </p>
                )}
              </div>

              {latestValidation.status ===
                "Needs Revision" && (
                  <button
                    type="button"
                    disabled={
                      !eligibility.eligible
                    }
                    onClick={
                      requestValidation
                    }
                    className="inline-flex items-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />

                    Start New Validation
                  </button>
                )}

              {latestValidation.status ===
                "Rejected" && (
                  <button
                    type="button"
                    disabled={
                      !eligibility.eligible
                    }
                    onClick={
                      requestValidation
                    }
                    className="inline-flex items-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />

                    Re-submit for Validation
                  </button>
                )}
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Validation Snapshot                                             */}
        {/* -------------------------------------------------------------- */}

        {latestValidation && (
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <ValidationMetric
              label="Evidence Considered"
              value={
                latestValidation
                  .evidenceAssessmentCount
              }
            />

            <ValidationMetric
              label="Supporting"
              value={
                latestValidation
                  .supportingEvidenceCount
              }
            />

            <ValidationMetric
              label="Contradicting"
              value={
                latestValidation
                  .contradictingEvidenceCount
              }
            />
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* Audit History                                                  */}
        {/* -------------------------------------------------------------- */}

        {latestValidation &&
          history.length > 0 && (
            <ValidationHistory
              history={history}
            />
          )}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Validation Status Badge                            */
/* -------------------------------------------------------------------------- */

function ValidationStatusBadge({
  status,
}: {
  status: ResearchValidationStatus;
}) {
  const styles =
    getValidationStatusStyles(
      status,
    );

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}

function getValidationStatusStyles(
  status: ResearchValidationStatus,
) {
  switch (status) {
    case "Validated":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";

    case "Rejected":
      return "border-red-400/20 bg-red-500/10 text-red-300";

    case "Needs Revision":
      return "border-amber-400/20 bg-amber-500/10 text-amber-300";

    case "In Review":
      return "border-violet-400/20 bg-violet-500/10 text-violet-300";

    case "Pending":
    default:
      return "border-cyan-400/20 bg-cyan-500/10 text-cyan-300";
  }
}

/* -------------------------------------------------------------------------- */
/*                         Validation Metric                                  */
/* -------------------------------------------------------------------------- */

function ValidationMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-white">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Validation History                                 */
/* -------------------------------------------------------------------------- */

function ValidationHistory({
  history,
}: {
  history:
  ResearchFindingValidationHistoryEvent[];
}) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-zinc-500" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Validation History
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {history.map(
          (event) => (
            <div
              key={event.id}
              className="relative border-l border-white/10 pl-4"
            >
              <div className="absolute -left-[4px] top-1 h-2 w-2 rounded-full bg-cyan-400" />

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  {event.from}
                </span>

                <span className="text-xs text-zinc-700">
                  →
                </span>

                <span
                  className={`text-xs font-semibold ${getHistoryTargetColor(
                    event.to,
                  )
                    }`}
                >
                  {event.to}
                </span>
              </div>

              {event.decision && (
                <p className="mt-1 text-[11px] text-zinc-500">
                  Decision:{" "}
                  {event.decision}
                </p>
              )}

              {event.reason && (
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {event.reason}
                </p>
              )}

              <p className="mt-1 text-[10px] text-zinc-700">
                {formatTimestamp(
                  event.timestamp,
                )}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function getHistoryTargetColor(
  status: ResearchValidationStatus,
) {
  switch (status) {
    case "Validated":
      return "text-emerald-300";

    case "Rejected":
      return "text-red-300";

    case "Needs Revision":
      return "text-amber-300";

    case "In Review":
      return "text-violet-300";

    default:
      return "text-cyan-300";
  }
}

/* -------------------------------------------------------------------------- */
/*                         Evidence Assessment Editor                         */
/* -------------------------------------------------------------------------- */

interface EvidenceAssessmentEditorProps {
  assessment: AssessmentDraft;

  onChange: (
    patch: Partial<AssessmentDraft>,
  ) => void;
}

function EvidenceAssessmentEditor({
  assessment,
  onChange,
}: EvidenceAssessmentEditorProps) {
  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
            Assessment
          </span>

          <select
            value={
              assessment.type
            }
            onChange={(event) =>
              onChange({
                type:
                  event.target
                    .value as ResearchEvidenceAssessmentType,
              })
            }
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400/40"
          >
            <option value="Supporting">
              Supporting
            </option>

            <option value="Contradicting">
              Contradicting
            </option>

            <option value="Neutral">
              Neutral
            </option>
          </select>
        </label>

        <ScoreInput
          label="Relevance"
          value={
            assessment.relevance
          }
          onChange={(value) =>
            onChange({
              relevance: value,
            })
          }
        />

        <ScoreInput
          label="Support Strength"
          value={
            assessment.supportStrength
          }
          onChange={(value) =>
            onChange({
              supportStrength:
                value,
            })
          }
        />

        <ScoreInput
          label="Reliability"
          value={
            assessment.reliability
          }
          onChange={(value) =>
            onChange({
              reliability:
                value,
            })
          }
        />

        <ScoreInput
          label="Independence"
          value={
            assessment.independence
          }
          onChange={(value) =>
            onChange({
              independence:
                value,
            })
          }
        />
      </div>

      <label className="mt-3 block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
          Assessment Rationale
        </span>

        <textarea
          value={
            assessment.rationale
          }
          onChange={(event) =>
            onChange({
              rationale:
                event.target.value,
            })
          }
          rows={2}
          placeholder="Explain why this evidence supports, contradicts, or contextualizes the finding..."
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs leading-5 text-white outline-none placeholder:text-zinc-700 focus:border-cyan-400/40"
        />
      </label>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Score Input                                        */
/* -------------------------------------------------------------------------- */

function ScoreInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (
    value: number,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
        {label}
      </span>

      <input
        type="number"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400/40"
      />
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Helpers                                            */
/* -------------------------------------------------------------------------- */

function clampScore(
  value: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(0, value),
  );
}

function resolveLatestValidation(
  finding: ResearchFinding,
  validations:
    ResearchFindingValidation[],
): ResearchFindingValidation | null {
  if (
    validations.length === 0
  ) {
    return null;
  }

  /*
   * validationIds are appended when a validation
   * is attached to the finding. Therefore the last
   * known ID is the newest relationship.
   */
  for (
    let index =
      finding.validationIds.length -
      1;
    index >= 0;
    index -= 1
  ) {
    const validation =
      validations.find(
        (item) =>
          item.id ===
          finding.validationIds[
          index
          ],
      );

    if (validation) {
      return validation;
    }
  }

  /*
   * Backward-compatible fallback for validation
   * records that exist but are not yet represented
   * in validationIds.
   */
  return [...validations].sort(
    (a, b) =>
      new Date(
        b.createdAt,
      ).getTime() -
      new Date(
        a.createdAt,
      ).getTime(),
  )[0] ?? null;
}

function formatTimestamp(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleString();
}