"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  History,
  ShieldAlert,
} from "lucide-react";

import { useResearchReconciliationObligations } from "@/hooks/useResearchReconciliationObligations";
import type {
  ResearchReconciliationObligation,
  ResearchReconciliationObligationStatus,
} from "@/types/research";

interface ResearchReconciliationPanelProps {
  investigationId: string;
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

function ObligationCard({
  obligation,
}: {
  obligation: ResearchReconciliationObligation;
}) {
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
}: ResearchReconciliationPanelProps) {
  const { obligations, loading, error } =
    useResearchReconciliationObligations(investigationId);

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
            />
          ))}
        </div>
      )}
    </section>
  );
}
