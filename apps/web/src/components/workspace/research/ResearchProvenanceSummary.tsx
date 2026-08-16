"use client";

import {
  Activity,
  CheckCircle2,
  Clock3,
  ShieldAlert,
} from "lucide-react";
import { useSyncExternalStore } from "react";

import {
  getResearchProvenanceInvestigationSummary,
  subscribeToResearch,
} from "@/lib/research";

import type {
  ResearchProvenanceInvestigationSummary,
} from "@/types/research";

interface ResearchProvenanceSummaryProps {
  investigationId: string;
}

const EMPTY_SUMMARY: ResearchProvenanceInvestigationSummary = {
  investigationId: "",
  eventCount: 0,
  validationEventCount: 0,
  statusChangeEventCount: 0,
  valid: true,
};

const snapshotCache = new Map<
  string,
  {
    raw: string | null;
    snapshot: ResearchProvenanceInvestigationSummary;
  }
>();

function getSnapshot(
  investigationId: string,
): ResearchProvenanceInvestigationSummary {
  if (typeof window === "undefined") {
    return EMPTY_SUMMARY;
  }

  const raw = localStorage.getItem(
    "titan:research-provenance-events",
  );

  const cached = snapshotCache.get(
    investigationId,
  );

  if (cached && cached.raw === raw) {
    return cached.snapshot;
  }

  const snapshot =
    getResearchProvenanceInvestigationSummary(
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

function formatTimestamp(
  timestamp?: string,
): string {
  if (!timestamp) {
    return "—";
  }

  return new Date(
    timestamp,
  ).toLocaleString();
}

function SummaryMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-cyan-300" />

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

export function ResearchProvenanceSummary({
  investigationId,
}: ResearchProvenanceSummaryProps) {
  const summary =
    useSyncExternalStore(
      subscribeToResearch,
      () => getSnapshot(investigationId),
      () => EMPTY_SUMMARY,
    );

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5">
            <Activity className="mr-2 h-4 w-4 text-cyan-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Provenance Health
            </span>
          </div>

          <h3 className="mt-4 text-xl font-bold text-white">
            Investigation Summary
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Compact view of provenance activity and lifecycle
            integrity for this investigation.
          </p>
        </div>

        <div
          className={
            summary.valid
              ? "inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"
              : "inline-flex items-center rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300"
          }
        >
          {summary.valid ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <ShieldAlert className="mr-2 h-4 w-4" />
          )}

          {summary.valid
            ? "Provenance Valid"
            : "Provenance Issues"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <SummaryMetric
          label="Events"
          value={summary.eventCount}
          icon={Activity}
        />

        <SummaryMetric
          label="Validation Events"
          value={summary.validationEventCount}
          icon={CheckCircle2}
        />

        <SummaryMetric
          label="Status Changes"
          value={summary.statusChangeEventCount}
          icon={Clock3}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            First Event
          </p>

          <p className="mt-2 text-sm text-zinc-300">
            {formatTimestamp(
              summary.firstEventTimestamp,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Latest Event
          </p>

          <p className="mt-2 text-sm text-zinc-300">
            {formatTimestamp(
              summary.latestEventTimestamp,
            )}
          </p>

          {summary.latestEventType ? (
            <p className="mt-1 text-xs text-zinc-600">
              {summary.latestEntityType}{" "}
              {summary.latestEventType}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}