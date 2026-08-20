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

import {
  useEffect,
  useMemo,
  useSyncExternalStore,
  useState,
} from "react";
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
  focusedEventId?: string | null;
}

type ProvenanceTimelineFilter =
  | "All"
  | "StatusChanged"
  | "Validation"
  | "Linked"
  | "Other";

export function ResearchProvenanceTimeline({
  investigationId,
  focusedEventId,
}: ResearchProvenanceTimelineProps) {
  const [filter, setFilter] =
    useState<ProvenanceTimelineFilter>(
      "All",
    );

  const [expandedEventId, setExpandedEventId] =
    useState<string | null>(null);
  useEffect(() => {
    if (!focusedEventId) {
      return;
    }

    const element =
      document.querySelector(
        `[data-research-provenance-event-id="${focusedEventId}"]`,
      );

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedEventId]);
  const timeline =
    useSyncExternalStore(
      subscribeToResearch,
      () =>
        getResearchProvenanceTimelineSnapshot(
          investigationId,
        ),
      () => EMPTY_PROVENANCE_TIMELINE,
    );

  const focusedEventExists = useMemo(
    () =>
      focusedEventId
        ? timeline.some(
          (item) =>
            item.eventId === focusedEventId,
        )
        : false,
    [focusedEventId, timeline],
  );

  const effectiveFilter =
    focusedEventId && focusedEventExists
      ? "All"
      : filter;

  const filteredTimeline =
    useMemo(() => {
      switch (effectiveFilter) {
        case "StatusChanged":
          return timeline.filter(
            (item) =>
              item.eventType ===
              "StatusChanged",
          );

        case "Validation":
          return timeline.filter(
            (item) =>
              item.entityType ===
              "FindingValidation" ||
              item.eventType ===
              "Validated" ||
              item.eventType ===
              "Rejected" ||
              item.eventType ===
              "RevisionRequested" ||
              item.eventType ===
              "Accepted",
          );

        case "Linked":
          return timeline.filter(
            (item) =>
              item.eventType ===
              "Linked" ||
              item.eventType ===
              "Unlinked",
          );

        case "Other":
          return timeline.filter(
            (item) =>
              item.eventType !==
              "StatusChanged" &&
              item.entityType !==
              "FindingValidation" &&
              item.eventType !==
              "Validated" &&
              item.eventType !==
              "Rejected" &&
              item.eventType !==
              "RevisionRequested" &&
              item.eventType !==
              "Accepted" &&
              item.eventType !==
              "Linked" &&
              item.eventType !==
              "Unlinked",
          );

        case "All":
        default:
          return timeline;
      }
    }, [effectiveFilter, timeline]);

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
            {filteredTimeline.length}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["All", "All"],
            ["StatusChanged", "Status Changes"],
            ["Validation", "Validation"],
            ["Linked", "Evidence / Links"],
            ["Other", "Other"],
          ] as const
        ).map(([value, label]) => {
          const active =
            filter === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() =>
                setFilter(value)
              }
              className={
                active
                  ? "rounded-full border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-xs font-semibold text-cyan-300"
                  : "rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold text-zinc-400 transition hover:border-white/20 hover:text-zinc-200"
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {focusedEventId &&
        focusedEventExists &&
        filter !== "All" ? (
        <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-500/[0.05] px-3 py-2 text-xs text-cyan-200">
          Showing all provenance events to reveal the selected integrity finding.
        </div>
      ) : null}
      {focusedEventId &&
        focusedEventExists ? (
        <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/[0.05] px-3 py-2 text-xs text-amber-200">
          This provenance event was selected from a lineage integrity finding.
        </div>
      ) : null}
      {filteredTimeline.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
          <p className="text-zinc-400">
            {timeline.length === 0
              ? "No provenance events recorded yet."
              : "No provenance events match this filter."}
          </p>
        </div>
      ) : (
        <div className="relative mt-10">
          <div className="absolute bottom-0 left-[17px] top-0 w-px bg-white/10" />

          <div className="space-y-8">
            {filteredTimeline.map((item) => {
              const Icon =
                getEventIcon(
                  item.eventType,
                );

              return (
                <article
                  key={item.eventId}
                  data-research-provenance-event-id={item.eventId}
                  className={
                    item.eventId === focusedEventId
                      ? "relative rounded-2xl bg-cyan-500/[0.05] pl-12 ring-1 ring-cyan-400/30"
                      : "relative pl-12"
                  }
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

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedEventId(
                            expandedEventId === item.eventId
                              ? null
                              : item.eventId,
                          )
                        }
                        className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300 transition hover:text-cyan-200"
                      >
                        {expandedEventId === item.eventId
                          ? "Hide event details"
                          : "View event details"}
                      </button>
                    </div>

                    {expandedEventId === item.eventId ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-5">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Event ID
                            </p>

                            <p className="mt-2 break-all font-mono text-xs text-zinc-300">
                              {item.eventId}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Investigation ID
                            </p>

                            <p className="mt-2 break-all font-mono text-xs text-zinc-300">
                              {item.investigationId}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Entity Type
                            </p>

                            <p className="mt-2 text-sm text-zinc-300">
                              {item.entityType}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Entity ID
                            </p>

                            <p className="mt-2 break-all font-mono text-xs text-zinc-300">
                              {item.entityId}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Event Type
                            </p>

                            <p className="mt-2 text-sm text-cyan-300">
                              {item.eventType}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Timestamp
                            </p>

                            <p className="mt-2 text-sm text-zinc-300">
                              {formatTimestamp(item.timestamp)}
                            </p>
                          </div>

                          {item.actor ? (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Actor
                              </p>

                              <p className="mt-2 text-sm text-zinc-300">
                                {item.actor}
                              </p>
                            </div>
                          ) : null}

                          {item.validationId ? (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Validation ID
                              </p>

                              <p className="mt-2 break-all font-mono text-xs text-zinc-300">
                                {item.validationId}
                              </p>
                            </div>
                          ) : null}
                        </div>

                        {item.metadata &&
                          Object.keys(item.metadata).length > 0 ? (
                          <div className="mt-5 border-t border-white/10 pt-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                              Metadata
                            </p>

                            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs leading-6 text-zinc-300">
                              {JSON.stringify(
                                item.metadata,
                                null,
                                2,
                              )}
                            </pre>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                        Provenance Event ID
                      </p>

                      <p className="mt-1 break-all font-mono text-xs text-zinc-500">
                        {item.eventId}
                      </p>
                    </div>
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
