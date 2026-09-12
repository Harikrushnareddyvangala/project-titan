"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  History,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

import { useResearchReconciliationObligations } from "@/hooks/useResearchReconciliationObligations";
import type { ResearchReconciliationObligationRecoveryPlanningResult } from "@/lib/research/reconciliationObligation/recoveryPlanning";
import type { ResearchReconciliationObligationConfirmationResult } from "@/lib/research/reconciliationObligation/confirmation";
import type {
  ResearchLineageIntegrityRemediationPlan,
  ResearchReconciliationObligation,
  ResearchReconciliationObligationStatus,
} from "@/types/research";

interface ResearchReconciliationPanelProps {
  investigationId: string;
  onRecoveryPlanValidated: (
    plan: ResearchLineageIntegrityRemediationPlan,
  ) => void;
}

function getStatusPresentation(status: ResearchReconciliationObligationStatus) {
  switch (status) {
    case "Open":
      return {
        icon: AlertCircle,
        label: "Open",
        className:
          "border-amber-400/30 bg-amber-500/10 text-amber-300",
      };

    case "In Progress":
      return {
        icon: Clock3,
        label: "In Progress",
        className:
          "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
      };

    case "Resolved":
      return {
        icon: CheckCircle2,
        label: "Resolved",
        className:
          "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
      };

    case "Abandoned":
      return {
        icon: ShieldAlert,
        label: "Abandoned",
        className:
          "border-zinc-400/20 bg-zinc-500/10 text-zinc-400",
      };

    case "Superseded":
      return {
        icon: History,
        label: "Superseded",
        className:
          "border-violet-400/30 bg-violet-500/10 text-violet-300",
      };
  }
}

function formatTimestamp(timestamp?: string): string {
  if (!timestamp) {
    return "—";
  }

  return new Date(timestamp).toLocaleString();
}

interface ObligationCardProps {
  obligation: ResearchReconciliationObligation;
  activating: boolean;
  activationError: string | null;
  planning: boolean;
  planningResult: ResearchReconciliationObligationRecoveryPlanningResult | null;
  planningError: string | null;
  confirmation: boolean;
  confirmationResult: ResearchReconciliationObligationConfirmationResult | null;
  confirmationError: string | null;
  onActivate: (obligationId: string) => void;
  onPlanRecovery: (obligationId: string) => void;
  onConfirmRecovery: (obligationId: string) => void;
}

function ObligationCard({
  obligation,
  activating,
  activationError,
  planning,
  planningResult,
  planningError,
  confirmation,
  confirmationResult,
  confirmationError,
  onActivate,
  onPlanRecovery,
  onConfirmRecovery,
}: ObligationCardProps) {
  const status = getStatusPresentation(obligation.status);
  const StatusIcon = status.icon;

  return (
    <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
              {obligation.issueCode}
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {obligation.reason}
            </p>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${status.className}`}
          >
            <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
            {status.label}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              Target
            </p>
            <p className="mt-1 text-xs text-zinc-300">
              {obligation.targetEntityType}
            </p>
            <p className="mt-1 break-all text-[11px] text-zinc-500">
              {obligation.targetEntityId}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              Historical remediation
            </p>
            <p className="mt-1 text-xs text-zinc-300">
              {obligation.remediationAction}
            </p>
          </div>
        </div>

        {obligation.status === "Open" ? (
          <div className="rounded-xl border border-amber-400/20 bg-amber-500/[0.04] px-3 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
                  Recovery ownership
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Activate this obligation when an operator begins working on
                  the outstanding reconciliation responsibility.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onActivate(obligation.id)}
                disabled={activating}
                className="inline-flex w-fit items-center rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 transition hover:border-amber-400/50 hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {activating ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Activating…
                  </>
                ) : (
                  "Activate obligation"
                )}
              </button>
            </div>

            {activationError ? (
              <p className="mt-3 text-xs leading-5 text-red-300">
                {activationError}
              </p>
            ) : null}
          </div>
        ) : null}

        {obligation.status === "In Progress" ? (
          <div className="rounded-xl border border-sky-400/20 bg-sky-500/[0.04] px-3 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
                  Recovery planning
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Build a fresh recovery plan from the current lineage state.
                  Planning does not execute or confirm remediation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onPlanRecovery(obligation.id)}
                disabled={planning}
                className="inline-flex w-fit items-center rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:border-sky-400/50 hover:bg-sky-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {planning ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Planning…
                  </>
                ) : (
                  "Plan recovery"
                )}
              </button>
            </div>

            {planningError ? (
              <p className="mt-3 text-xs leading-5 text-red-300">
                {planningError}
              </p>
            ) : null}

            {planningResult ? (
              <div className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Planning result
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300">
                    {planningResult.status}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  {planningResult.reason}
                </p>

                {planningResult.plan ? (
                  <>
                    <div className="mt-3 rounded-lg border border-sky-400/20 bg-sky-500/[0.04] px-3 py-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
                            Recovery confirmation
                          </p>
                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Confirm the fresh recovery plan explicitly. Confirmation
                            does not execute remediation or resolve the obligation.
                          </p>
                        </div>

                        {planningResult.status === "Planned" ? (
                          <button
                            type="button"
                            onClick={() => onConfirmRecovery(obligation.id)}
                            disabled={confirmation}
                            className="inline-flex w-fit items-center rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:border-sky-400/50 hover:bg-sky-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {confirmation ? (
                              <>
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                Confirming…
                              </>
                            ) : (
                              "Confirm recovery"
                            )}
                          </button>
                        ) : null}
                      </div>

                      {confirmationError ? (
                        <p className="mt-3 text-xs leading-5 text-red-300">
                          {confirmationError}
                        </p>
                      ) : null}

                      {confirmationResult ? (
                        <div className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                              Confirmation result
                            </p>
                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300">
                              {confirmationResult.status}
                            </span>
                          </div>

                          <p className="mt-2 text-xs leading-5 text-zinc-400">
                            {confirmationResult.reason}
                          </p>

                          {confirmationResult.status === "Validated" &&
                          confirmationResult.plan ? (
                            <p className="mt-2 text-xs font-semibold leading-5 text-emerald-300">
                              Validated recovery plan is ready for execution handoff.
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                        Action
                      </p>
                      <p className="mt-1 text-xs text-zinc-300">
                        {planningResult.plan.action}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                        Issue
                      </p>
                      <p className="mt-1 text-xs text-zinc-300">
                        {planningResult.plan.issueCode}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                        Target
                      </p>
                      <p className="mt-1 break-all text-xs text-zinc-300">
                        {[
                          planningResult.plan.target.nodeId
                            ? `Node: ${planningResult.plan.target.nodeId}`
                            : null,
                          planningResult.plan.target.edgeId
                            ? `Edge: ${planningResult.plan.target.edgeId}`
                            : null,
                          planningResult.plan.target.sourceId
                            ? `Source: ${planningResult.plan.target.sourceId}`
                            : null,
                          planningResult.plan.target.targetId
                            ? `Target: ${planningResult.plan.target.targetId}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                        Description
                      </p>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">
                        {planningResult.plan.description}
                      </p>
                    </div>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-3 text-xs sm:grid-cols-3">
          <div>
            <p className="font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Created
            </p>
            <p className="mt-1 text-zinc-500">
              {formatTimestamp(obligation.createdAt)}
            </p>
          </div>

          <div>
            <p className="font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Updated
            </p>
            <p className="mt-1 text-zinc-500">
              {formatTimestamp(obligation.updatedAt)}
            </p>
          </div>

          <div>
            <p className="font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Resolved
            </p>
            <p className="mt-1 text-zinc-500">
              {formatTimestamp(obligation.resolvedAt)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ResearchReconciliationPanel({
  investigationId,
  onRecoveryPlanValidated,
}: ResearchReconciliationPanelProps) {
  const { obligations, loading, error, refresh } =
    useResearchReconciliationObligations(investigationId);

  const [activatingObligationId, setActivatingObligationId] = useState<
    string | null
  >(null);
  const [activationErrors, setActivationErrors] = useState<
    Record<string, string>
  >({});
  const [planningObligationId, setPlanningObligationId] = useState<
    string | null
  >(null);
  const [planningResults, setPlanningResults] = useState<
    Record<
      string,
      ResearchReconciliationObligationRecoveryPlanningResult
    >
  >({});
  const [planningErrors, setPlanningErrors] = useState<
    Record<string, string>
  >({});
  const [confirmationObligationId, setConfirmationObligationId] = useState<
    string | null
  >(null);
  const [confirmationResults, setConfirmationResults] = useState<
    Record<string, ResearchReconciliationObligationConfirmationResult>
  >({});
  const [confirmationErrors, setConfirmationErrors] = useState<
    Record<string, string>
  >({});

  async function handlePlanRecovery(obligationId: string) {
    setPlanningObligationId(obligationId);
    setPlanningErrors((current) => {
      const next = { ...current };
      delete next[obligationId];
      return next;
    });

    try {
      const response = await fetch(
        `/api/research/reconciliation/obligations/${encodeURIComponent(
          obligationId,
        )}/recovery`,
        {
          method: "POST",
        },
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Reconciliation recovery planning failed.";

        throw new Error(message);
      }

      setPlanningResults((current) => ({
        ...current,
        [obligationId]:
          data as ResearchReconciliationObligationRecoveryPlanningResult,
      }));
    } catch (err) {
      setPlanningErrors((current) => ({
        ...current,
        [obligationId]:
          err instanceof Error
            ? err.message
            : "Reconciliation recovery planning failed.",
      }));
    } finally {
      setPlanningObligationId(null);
    }
  }

  async function handleConfirmRecovery(obligationId: string) {
    setConfirmationObligationId(obligationId);
    setConfirmationErrors((current) => {
      const next = { ...current };
      delete next[obligationId];
      return next;
    });

    try {
      const response = await fetch(
        `/api/research/reconciliation/obligations/${encodeURIComponent(
          obligationId,
        )}/confirm`,
        {
          method: "POST",
        },
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Reconciliation recovery confirmation failed.";

        throw new Error(message);
      }

      const result =
        data as ResearchReconciliationObligationConfirmationResult;

      setConfirmationResults((current) => ({
        ...current,
        [obligationId]: result,
      }));

      if (result.status === "Validated" && result.plan) {
        onRecoveryPlanValidated(result.plan);
      }
    } catch (err) {
      setConfirmationErrors((current) => ({
        ...current,
        [obligationId]:
          err instanceof Error
            ? err.message
            : "Reconciliation recovery confirmation failed.",
      }));
    } finally {
      setConfirmationObligationId(null);
    }
  }

  async function handleActivate(obligationId: string) {
    setActivatingObligationId(obligationId);
    setActivationErrors((current) => {
      const next = { ...current };
      delete next[obligationId];
      return next;
    });

    try {
      const response = await fetch(
        `/api/research/reconciliation/obligations/${encodeURIComponent(
          obligationId,
        )}/activate`,
        {
          method: "POST",
        },
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Reconciliation obligation activation failed.";

        throw new Error(message);
      }

      refresh();
    } catch (err) {
      setActivationErrors((current) => ({
        ...current,
        [obligationId]:
          err instanceof Error
            ? err.message
            : "Reconciliation obligation activation failed.",
      }));
    } finally {
      setActivatingObligationId(null);
    }
  }

  const openCount = obligations.filter(
    (obligation) => obligation.status === "Open",
  ).length;

  const inProgressCount = obligations.filter(
    (obligation) => obligation.status === "In Progress",
  ).length;

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5">
            <ShieldAlert className="mr-2 h-4 w-4 text-violet-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
              Reconciliation Operations
            </span>
          </div>

          <h3 className="mt-4 text-xl font-bold text-white">
            Investigation Obligations
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Durable operational responsibilities created when committed
            remediation requires further reconciliation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.14em]">
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-zinc-400">
            Total {obligations.length}
          </span>

          <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-amber-300">
            Open {openCount}
          </span>

          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-cyan-300">
            Active {inProgressCount}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
          <p className="text-sm font-semibold text-zinc-400">
            Loading reconciliation obligations…
          </p>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/[0.05] p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />

            <div>
              <p className="text-sm font-semibold text-red-300">
                Reconciliation retrieval failed
              </p>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                {error}
              </p>
            </div>
          </div>
        </div>
      ) : obligations.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
          <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-300" />

          <p className="mt-3 text-sm font-semibold text-zinc-300">
            No reconciliation obligations
          </p>

          <p className="mt-2 text-xs leading-5 text-zinc-600">
            This investigation currently has no persisted reconciliation
            responsibilities.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {obligations.map((obligation) => (
            <ObligationCard
              key={obligation.id}
              obligation={obligation}
              activating={activatingObligationId === obligation.id}
              activationError={activationErrors[obligation.id] ?? null}
              planning={planningObligationId === obligation.id}
              planningResult={planningResults[obligation.id] ?? null}
              planningError={planningErrors[obligation.id] ?? null}
              confirmation={confirmationObligationId === obligation.id}
              confirmationResult={confirmationResults[obligation.id] ?? null}
              confirmationError={confirmationErrors[obligation.id] ?? null}
              onActivate={handleActivate}
              onPlanRecovery={handlePlanRecovery}
              onConfirmRecovery={handleConfirmRecovery}
            />
          ))}
        </div>
      )}
    </section>
  );
}
