"use client";

import {
  Activity,
  CheckCircle2,
  Clock3,
  GitBranch,
  Link2,
  ShieldCheck,
} from "lucide-react";

import {
  getResearchProvenanceTimeline,
  getResearchProvenanceTimelineByInvestigation,
  subscribeToResearch,
} from "@/lib/research";

import type {
  ResearchProvenanceEventType,
  ResearchProvenanceTimelineItem,
} from "@/types/research";

import { useSyncExternalStore } from "react";
function getEventIcon(
  eventType: ResearchProvenanceEventType,
) {
  switch (eventType) {
    case "Validated":
    case "Accepted":
      return CheckCircle2;

    case "Linked":
    case "Unlinked":
      return Link2;

    case "StatusChanged":
      return GitBranch;

    case "Rejected":
    case "RevisionRequested":
      return ShieldCheck;

    default:
      return Activity;
  }
}

function formatTimestamp(
  timestamp: string,
): string {
  return new Date(
    timestamp,
  ).toLocaleString();
}

const EMPTY_PROVENANCE_TIMELINE:
  ResearchProvenanceTimelineItem[] = [];

interface ProvenanceTimelineSnapshotCache {
  raw: string | null;
  snapshot: ResearchProvenanceTimelineItem[];
}

const provenanceTimelineSnapshotCache =
  new Map<
    string,
    ProvenanceTimelineSnapshotCache
  >();

function getResearchProvenanceTimelineSnapshot(
  investigationId?: string,
): ResearchProvenanceTimelineItem[] {
  if (typeof window === "undefined") {
    return EMPTY_PROVENANCE_TIMELINE;
  }

  const raw =
    localStorage.getItem(
      "titan:research-provenance-events",
    );

  const cacheKey =
    investigationId ?? "all";

  const cached =
    provenanceTimelineSnapshotCache.get(
      cacheKey,
    );

  if (
    cached &&
    cached.raw === raw
  ) {
    return cached.snapshot;
  }

  const snapshot =
    investigationId
      ? getResearchProvenanceTimelineByInvestigation(
          investigationId,
        )
      : getResearchProvenanceTimeline();

  provenanceTimelineSnapshotCache.set(
    cacheKey,
    {
      raw,
      snapshot,
    },
  );

  return snapshot;
}
interface ResearchProvenanceTimelineProps {
  investigationId?: string;
}

export function ResearchProvenanceTimeline({
  investigationId,
}: ResearchProvenanceTimelineProps) {
  const timeline =
  useSyncExternalStore(
    subscribeToResearch,
    () =>
      getResearchProvenanceTimelineSnapshot(
        investigationId,
      ),
    () => EMPTY_PROVENANCE_TIMELINE,
  );

  return (
    <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
            <Clock3 className="mr-2 h-4 w-4 text-cyan-300" />

            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Provenance
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-black text-white">
            Research Timeline
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            Chronological record of research lifecycle events,
            validation decisions, and evidence-linked changes.
          </p>
        </div>

        <div className="hidden rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right md:block">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Events
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {timeline.length}
          </p>
        </div>
      </div>

      {timeline.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
          <p className="text-zinc-400">
            No provenance events recorded yet.
          </p>
        </div>
      ) : (
        <div className="relative mt-10">
          <div className="absolute bottom-0 left-[17px] top-0 w-px bg-white/10" />

          <div className="space-y-8">
            {timeline.map((item) => {
              const Icon =
                getEventIcon(
                  item.eventType,
                );

              return (
                <article
                  key={item.eventId}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-zinc-950">
                    <Icon className="h-4 w-4 text-cyan-300" />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-400">
                          {item.description}
                        </p>
                      </div>

                      <time
                        className="shrink-0 text-xs text-zinc-500"
                        dateTime={item.timestamp}
                      >
                        {formatTimestamp(
                          item.timestamp,
                        )}
                      </time>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                        {item.entityType}
                      </span>

                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                        {item.eventType}
                      </span>

                      {item.fromStatus &&
                        item.toStatus ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
                          {item.fromStatus}
                          {" → "}
                          {item.toStatus}
                        </span>
                      ) : null}
                    </div>
                    {item.findingStatement ? (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                          Finding
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                          {item.findingStatement}
                        </p>
                      </div>
                    ) : null}
                    {item.validationId ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.decision ? (
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                            Decision: {item.decision}
                          </span>
                        ) : null}

                        {item.validator ? (
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
                            Validator: {item.validator}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    {item.reason ? (
                      <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-zinc-500">
                        {item.reason}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
