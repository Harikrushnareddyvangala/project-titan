"use client";

import {
  ClipboardList,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  useResearchInvestigations,
} from "@/hooks/useResearchInvestigations";

import type {
  ResearchInvestigation,
  ResearchLineageNode,
} from "@/types/research";

import {
  getResearchLineage,
  getResearchEvidence,
  getResearchExperiments,
  getResearchFindings,
  getResearchFindingValidations,
  getResearchInvestigationConclusions,
} from "@/lib/research";

import { ResearchEvidencePanel } from "./ResearchEvidencePanel";
import { ResearchFindingPanel } from "./ResearchFindingPanel";
import { ResearchExperimentPanel } from "./ResearchExperimentPanel";
import { ResearchConclusionPanel } from "./ResearchConclusionPanel";
import { ResearchProvenanceSummary } from "./ResearchProvenanceSummary";
import { ResearchProvenanceTimeline } from "./ResearchProvenanceTimeline";
import { ResearchLineageIntegrity } from "./ResearchLineageIntegrity";
import { ResearchLineageGraph } from "./ResearchLineageGraph";
import { ResearchLineageNodeInspector } from "./ResearchLineageNodeInspector";

type ResearchArtifactFocus = {
  type:
  | "Investigation"
  | "Experiment"
  | "Evidence"
  | "Finding"
  | "FindingValidation"
  | "Conclusion";
  id: string;
};

type ResearchLineageInspectionContext = {
  source: "Integrity";
  action:
  | "Inspect"
  | "RepairReference"
  | "RepairScope"
  | "RepairRelationship"
  | "ReviewProvenance";
  label: string;
};

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
  const [selectedLineageNodeId, setSelectedLineageNodeId] =
    useState<string | null>(null);

  const [provenanceInspectionEventId, setProvenanceInspectionEventId] =
  useState<string | null>(null);

  const [lineageInspectionContext, setLineageInspectionContext] =
    useState<ResearchLineageInspectionContext | null>(null);

  const [artifactFocus, setArtifactFocus] =
    useState<ResearchArtifactFocus | null>(null);

  const lineage =
    getResearchLineage(investigation.id);

  const selectedLineageNode =
    lineage.nodes.find(
      (node) =>
        node.id === selectedLineageNodeId,
    ) ?? null;

  const handleLineageNodeSelect = (
    nodeId: string | null,
  ) => {
    setSelectedLineageNodeId(nodeId);
    setLineageInspectionContext(null);
    setProvenanceInspectionEventId(null);

    if (nodeId !== selectedLineageNodeId) {
      setArtifactFocus(null);
    }
  };

  const handleIntegrityNodeSelect = (
    nodeId: string | null,
  ) => {
    setSelectedLineageNodeId(nodeId);
    setLineageInspectionContext(
      nodeId ? {
        source: "Integrity",
        action: "Inspect",
        label: "Integrity finding",
      }
        : null,
    );
    setProvenanceInspectionEventId(null);

    if (nodeId !== selectedLineageNodeId) {
      setArtifactFocus(null);
    }
  };

  const activeArtifactFocus =
    artifactFocus &&
      lineage.nodes.some(
        (node) =>
          node.type === artifactFocus.type &&
          node.id === artifactFocus.id,
      )
      ? artifactFocus
      : null;

  useEffect(() => {
    if (
      activeArtifactFocus?.type !==
      "Investigation"
    ) {
      return;
    }

    const element =
      document.querySelector(
        `[data-research-artifact-id="${activeArtifactFocus.id}"]`,
      );

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeArtifactFocus]);

  const handleOpenLineageArtifact = (
    node: ResearchLineageNode,
  ) => {
    switch (node.type) {
      case "Investigation":
        setArtifactFocus({
          type: "Investigation",
          id: node.id,
        });
        break;

      case "Experiment": {
        const experiment =
          getResearchExperiments().find(
            (item) => item.id === node.id,
          );

        if (!experiment) {
          return;
        }

        setArtifactFocus({
          type: "Experiment",
          id: node.id,
        });
        break;
      }

      case "Evidence": {
        const evidence =
          getResearchEvidence().find(
            (item) => item.id === node.id,
          );

        if (!evidence) {
          return;
        }

        setArtifactFocus({
          type: "Evidence",
          id: node.id,
        });
        break;
      }

      case "Finding": {
        const finding =
          getResearchFindings().find(
            (item) => item.id === node.id,
          );

        if (!finding) {
          return;
        }

        setArtifactFocus({
          type: "Finding",
          id: node.id,
        });
        break;
      }

      case "FindingValidation": {
        const validation =
          getResearchFindingValidations().find(
            (item) => item.id === node.id,
          );

        if (!validation) {
          return;
        }

        const finding =
          getResearchFindings().find(
            (item) =>
              item.id === validation.findingId,
          );

        if (!finding) {
          return;
        }

        setArtifactFocus({
          type: "Finding",
          id: finding.id,
        });

        break;
      }

      case "Conclusion": {
        const conclusion =
          getResearchInvestigationConclusions().find(
            (item) => item.id === node.id,
          );

        if (!conclusion) {
          return;
        }

        setArtifactFocus({
          type: "Conclusion",
          id: node.id,
        });
        break;
      }
    }
  };
  return (
    <article
      data-research-artifact-id={
        investigation.id
      }
      className={`rounded-3xl border p-6 transition ${activeArtifactFocus?.type ===
        "Investigation"
        ? "border-cyan-400/60 bg-cyan-500/[0.08] ring-1 ring-cyan-400/30"
        : "border-white/10 bg-black/30"
        }`}
    >
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
        focusedArtifactId={
          activeArtifactFocus?.type === "Experiment"
            ? activeArtifactFocus.id
            : null
        }
      />

      <ResearchEvidencePanel
        investigation={investigation}
        onInvestigationUpdated={
          onInvestigationUpdated
        }
        focusedArtifactId={
          activeArtifactFocus?.type === "Evidence"
            ? activeArtifactFocus.id
            : null
        }
      />

      <ResearchFindingPanel
        investigation={investigation}
        onInvestigationUpdated={
          onInvestigationUpdated
        }
        focusedArtifactId={
          activeArtifactFocus?.type === "Finding"
            ? activeArtifactFocus.id
            : null
        }
      />

      <ResearchConclusionPanel
        investigation={investigation}
        onInvestigationUpdated={
          onInvestigationUpdated
        }
        focusedArtifactId={
          activeArtifactFocus?.type === "Conclusion"
            ? activeArtifactFocus.id
            : null
        }
      />

      <ResearchLineageGraph
        investigationId={investigation.id}
        selectedNodeId={selectedLineageNodeId}
        onNodeSelect={
          handleLineageNodeSelect
        }
      />

      <ResearchLineageNodeInspector
        node={selectedLineageNode}
        inspectionContext={
          lineageInspectionContext
        }
        onOpenArtifact={
          handleOpenLineageArtifact
        }
      />

      <ResearchProvenanceSummary
        investigationId={investigation.id}
      />

      <ResearchProvenanceTimeline
        investigationId={investigation.id}
        focusedEventId={provenanceInspectionEventId}
      />
      <ResearchLineageIntegrity
        investigationId={investigation.id}
        onSelectNode={
          handleIntegrityNodeSelect
        }
      />
    </article>
  );
}
