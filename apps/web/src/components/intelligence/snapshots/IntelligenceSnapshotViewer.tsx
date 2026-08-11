"use client";

import {
  Download,
  Share2,
  X,
  FileText,
  FilePlus2,
} from "lucide-react";

import type { IntelligenceSnapshot } from "@/types/intelligence";

import {
  useIntelligenceShare,
} from "@/hooks/useIntelligenceShare";

import {
  exportIntelligenceSnapshot,
} from "@/lib/intelligence/export";

import {
  IntelligenceReport,
} from "../reports";
import { useState, } from "react";

import {
  createAndSaveIntelligenceArtifact,
} from "@/lib/intelligence/artifactService";

interface IntelligenceSnapshotViewerProps {
  snapshot: IntelligenceSnapshot;
  onClose: () => void;
}

export function IntelligenceSnapshotViewer({
  snapshot,
  onClose,
}: IntelligenceSnapshotViewerProps) {
  const {
    shareSnapshot,
    shared,
  } = useIntelligenceShare();

  const [
    showReport,
    setShowReport,
  ] = useState(false);
  const handleCreateArtifact = () => {
    const artifact =
      createAndSaveIntelligenceArtifact(
        snapshot,
      );

    setArtifactCreated(true);

  window.setTimeout(() => {
    setArtifactCreated(false);
  }, 2500);
  };
  const [artifactCreated, setArtifactCreated] =
  useState(false);


  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.03] p-6">
      {/* =====================================================
          Header
      ====================================================== */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Intelligence Snapshot
          </p>

          <h3 className="mt-2 break-words text-2xl font-black text-white">
            {snapshot.repository}
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Created{" "}
            {new Date(
              snapshot.createdAt,
            ).toLocaleString()}
          </p>
        </div>

        {/* =====================================================
            Actions
        ====================================================== */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setShowReport(true)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >
            <FileText className="h-4 w-4" />

            <span className="hidden sm:inline">
              Report
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              shareSnapshot(snapshot)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              Share
            </span>
          </button>
          <button
            type="button"
            onClick={handleCreateArtifact}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >
            <FilePlus2 className="h-4 w-4" />
            Create Artifact
          </button>

          <button
            type="button"
            onClick={() =>
              exportIntelligenceSnapshot(
                snapshot,
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">
              Export
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              const artifact =
                createAndSaveIntelligenceArtifact(
                  snapshot,
                );

              console.log(
                "Intelligence artifact created:",
                artifact,
              );
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
          >
            Create Artifact
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close snapshot"
            className="rounded-xl border border-white/10 p-2 text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =====================================================
          Share confirmation
      ====================================================== */}
      {shared ? (
        <p
          role="status"
          className="mt-4 text-xs font-medium text-cyan-300"
        >
          Snapshot link copied.
        </p>
      ) : null}
      {artifactCreated ? (
  <p
    role="status"
    className="mt-3 text-sm font-medium text-cyan-300"
  >
    Intelligence artifact created and saved.
  </p>
) : null}

      {/* =====================================================
          Snapshot Metrics
      ====================================================== */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SnapshotMetric
          label="Enterprise Readiness"
          value={
            snapshot.analytics
              .enterpriseReadiness
          }
        />

        <SnapshotMetric
          label="Security Score"
          value={
            snapshot.analytics
              .securityScore
          }
        />

        <SnapshotMetric
          label="Dependency Risk"
          value={
            snapshot.analytics
              .dependencyRisk
          }
        />

        <SnapshotMetric
          label="Production Score"
          value={
            snapshot.analytics
              .productionScore
          }
        />
      </div>
      {showReport ? (
        <div className="mt-8">
          <IntelligenceReport
            snapshot={snapshot}
            onClose={() =>
              setShowReport(false)
            }
          />
        </div>
      ) : null}
    </div>
  );
}

interface SnapshotMetricProps {
  label: string;
  value: unknown;
}

function SnapshotMetric({
  label,
  value,
}: SnapshotMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value == null
          ? "—"
          : String(value)}
      </p>
    </div>
  );
}