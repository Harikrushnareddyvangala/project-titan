"use client";

import {
  ClipboardList,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  useResearchInvestigations,
} from "@/hooks/useResearchInvestigations";

import type {
  ResearchInvestigation,
} from "@/types/research";

import { ResearchEvidencePanel } from "./ResearchEvidencePanel";
import { ResearchFindingPanel } from "./ResearchFindingPanel";
import { ResearchExperimentPanel } from "./ResearchExperimentPanel";
import { ResearchConclusionPanel } from "./ResearchConclusionPanel";
import { ResearchProvenanceSummary } from "./ResearchProvenanceSummary";
import { ResearchProvenanceTimeline } from "./ResearchProvenanceTimeline";
import { ResearchLineageGraph } from "./ResearchLineageGraph";

const statuses =
  [
    "Draft",
    "Investigating",
    "Evidence Collected",
    "Finding Produced",
    "Validated",
    "Published",
  ] as const;

export function ResearchInvestigationPanel() {
  const {
    investigations,
    save,
    updateStatus,
  } = useResearchInvestigations();

  const [title, setTitle] =
    useState("");

  const [objective, setObjective] =
    useState("");

  const [question, setQuestion] =
    useState("");

  const [search, setSearch] =
    useState("");

  const filteredInvestigations =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return investigations;
      }

      return investigations.filter(
        (investigation) =>
          investigation.title
            .toLowerCase()
            .includes(query) ||
          investigation.question
            .toLowerCase()
            .includes(query),
      );
    }, [
      investigations,
      search,
    ]);

  function createInvestigation() {
    const cleanTitle =
      title.trim();

    const cleanObjective =
      objective.trim();

    const cleanQuestion =
      question.trim();

    if (
      !cleanTitle ||
      !cleanObjective ||
      !cleanQuestion
    ) {
      return;
    }

    const now =
      new Date().toISOString();

    const investigation:
      ResearchInvestigation = {
      id: `investigation-${Date.now()}`,
      title: cleanTitle,
      objective:
        cleanObjective,
      question:
        cleanQuestion,
      status: "Draft",
      experimentIds: [],
      evidenceIds: [],
      findingIds: [],
      artifactIds: [],
      conclusionIds: [],
      createdAt: now,
      updatedAt: now,
    };

    save(investigation);

    setTitle("");
    setObjective("");
    setQuestion("");
  }

  return (
    <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-cyan-400" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Research Management
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Active Investigations
              </h2>
            </div>
          </div>

          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
            Create and manage structured engineering
            investigations inside Project TITAN.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            placeholder="Investigation title"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
          />

          <input
            value={objective}
            onChange={(event) =>
              setObjective(
                event.target.value,
              )
            }
            placeholder="Investigation objective"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
          />

          <input
            value={question}
            onChange={(event) =>
              setQuestion(
                event.target.value,
              )
            }
            placeholder="Research question"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
          />
        </div>

        <button
          type="button"
          onClick={
            createInvestigation
          }
          className="inline-flex w-fit items-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Investigation
        </button>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search investigations"
            className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
          />
        </div>

        <div className="grid gap-4">
          {filteredInvestigations.length ===
            0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
              <p className="text-sm font-semibold text-zinc-400">
                No investigations yet.
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                Create your first engineering
                investigation above.
              </p>
            </div>
          ) : (
            filteredInvestigations.map(
              (investigation) => (
                <InvestigationCard
                  key={
                    investigation.id
                  }
                  investigation={
                    investigation
                  }
                  onStatusChange={(
                    status,
                  ) =>
                    updateStatus(
                      investigation,
                      status,
                    )
                  }
                  onInvestigationUpdated={save}
                />
              ),
            )
          )}
        </div>
      </div>
    </section>
  );
}

interface InvestigationCardProps {
  investigation:
  ResearchInvestigation;

  onStatusChange: (
    status: ResearchInvestigation["status"],
  ) => void;

  onInvestigationUpdated: (
    investigation: ResearchInvestigation,
  ) => void;
}

function InvestigationCard({
  investigation,
  onStatusChange,
  onInvestigationUpdated,
}: InvestigationCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">
            {investigation.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {investigation.question}
          </p>

          <p className="mt-3 text-xs leading-5 text-zinc-600">
            Objective:{" "}
            {investigation.objective}
          </p>
        </div>

        <select
          value={
            investigation.status
          }
          onChange={(event) =>
            onStatusChange(
              event.target
                .value as ResearchInvestigation["status"],
            )
          }
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-zinc-300 outline-none focus:border-cyan-400/40"
        >
          {statuses.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          {investigation.status}
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-500">
          Experimets:{" "}
          {investigation.experimentIds.length}
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-500">
          Evidence:{" "}
          {investigation.evidenceIds.length}
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-500">
          Findings:{" "}
          {investigation.findingIds.length}
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-500">
          Conclusions:{" "}
          {investigation.conclusionIds.length}
        </span>
      </div>
      <ResearchExperimentPanel
        investigation={investigation}
        onInvestigationUpdated={
          onInvestigationUpdated
        }
      />
      <ResearchEvidencePanel
        investigation={investigation}
        onInvestigationUpdated={
          onInvestigationUpdated
        }
      />
      <ResearchFindingPanel
        investigation={investigation}
        onInvestigationUpdated={
          onInvestigationUpdated
        }
      />
      <ResearchConclusionPanel
        investigation={investigation}
        onInvestigationUpdated={
          onInvestigationUpdated
        }
      />
      <ResearchProvenanceSummary
        investigationId={investigation.id}
      />

      <ResearchLineageGraph
        investigationId={investigation.id}
      />

      <ResearchProvenanceTimeline
        investigationId={investigation.id}
      />
    </article>
  );
}
