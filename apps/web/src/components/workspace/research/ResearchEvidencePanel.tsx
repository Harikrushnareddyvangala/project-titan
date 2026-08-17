"use client";

import {
  FileSearch,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getResearchEvidence,
  saveResearchEvidence,
} from "@/lib/research";

import type {
  ResearchEvidence,
  ResearchEvidenceType,
  ResearchInvestigation,
} from "@/types/research";

const evidenceTypes: ResearchEvidenceType[] = [
  "Repository",
  "Commit",
  "File",
  "Metric",
  "Analysis",
  "Experiment",
  "Artifact",
  "External Reference",
];

interface ResearchEvidencePanelProps {
  investigation: ResearchInvestigation;

  onInvestigationUpdated?: (
    investigation: ResearchInvestigation,
  ) => void;

  focusedArtifactId?: string | null;
}

export function ResearchEvidencePanel({
  investigation,
  onInvestigationUpdated,
  focusedArtifactId,
}: ResearchEvidencePanelProps) {
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
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [reference, setReference] =
    useState("");
  const [type, setType] =
    useState<ResearchEvidenceType>(
      "Repository",
    );

  const evidence = useMemo(() => {
    const allEvidence =
      getResearchEvidence();

    return allEvidence.filter((item) =>
      investigation.evidenceIds.includes(
        item.id,
      ),
    );
  }, [investigation.evidenceIds]);

  function addEvidence() {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const evidenceItem: ResearchEvidence = {
      id: `evidence-${Date.now()}`,
      type,
      title: cleanTitle,
      description:
        description.trim() || undefined,
      reference:
        reference.trim() || undefined,
      createdAt:
        new Date().toISOString(),
    };

    saveResearchEvidence(evidenceItem);

    const updatedInvestigation: ResearchInvestigation =
    {
      ...investigation,
      evidenceIds: [
        ...investigation.evidenceIds,
        evidenceItem.id,
      ],
      updatedAt:
        new Date().toISOString(),
    };

    onInvestigationUpdated?.(
      updatedInvestigation,
    );

    setTitle("");
    setDescription("");
    setReference("");
    setType("Repository");
  }

  function removeEvidence(
    evidenceId: string,
  ) {
    const updatedInvestigation: ResearchInvestigation =
    {
      ...investigation,
      evidenceIds:
        investigation.evidenceIds.filter(
          (id) => id !== evidenceId,
        ),
      updatedAt:
        new Date().toISOString(),
    };

    onInvestigationUpdated?.(
      updatedInvestigation,
    );
  }

  return (
    <section className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center gap-3">
        <FileSearch className="h-5 w-5 text-cyan-400" />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Evidence
          </p>

          <h4 className="mt-1 text-lg font-bold text-white">
            Investigation Evidence
          </h4>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <select
          value={type}
          onChange={(event) =>
            setType(
              event.target
                .value as ResearchEvidenceType,
            )
          }
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
        >
          {evidenceTypes.map(
            (evidenceType) => (
              <option
                key={evidenceType}
                value={evidenceType}
              >
                {evidenceType}
              </option>
            ),
          )}
        </select>

        <input
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Evidence title"
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
        />

        <input
          value={reference}
          onChange={(event) =>
            setReference(event.target.value)
          }
          placeholder="Reference"
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40 lg:col-span-2"
        />

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value,
            )
          }
          placeholder="Evidence description"
          rows={3}
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40 lg:col-span-2"
        />
      </div>

      <button
        type="button"
        onClick={addEvidence}
        className="mt-4 inline-flex items-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Evidence
      </button>

      <div className="mt-5 space-y-3">
        {evidence.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-center">
            <p className="text-sm text-zinc-500">
              No evidence attached to this
              investigation.
            </p>
          </div>
        ) : (
          evidence.map((item) => (
            <article
              key={item.id}
              data-research-artifact-id={item.id}
              className={`rounded-2xl border p-4 transition ${focusedArtifactId === item.id
                  ? "border-cyan-400/60 bg-cyan-500/[0.08] ring-1 ring-cyan-400/30"
                  : "border-white/10 bg-white/[0.02]"
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="font-semibold text-white">
                      {item.title}
                    </h5>

                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">
                      {item.type}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {item.description}
                    </p>
                  )}

                  {item.reference && (
                    <p className="mt-2 break-all text-xs text-zinc-600">
                      Reference:{" "}
                      {item.reference}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeEvidence(item.id)
                  }
                  aria-label="Remove evidence"
                  className="rounded-xl border border-white/10 p-2 text-zinc-500 transition hover:border-red-400/30 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
