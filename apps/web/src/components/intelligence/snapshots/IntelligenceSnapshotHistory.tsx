"use client";

import { useState } from "react";

import type { IntelligenceSnapshot } from "@/types/intelligence";

import { useIntelligenceSnapshots } from "@/hooks/useIntelligenceSnapshots";

import { IntelligenceSnapshotCard } from "./IntelligenceSnapshotCard";
import { IntelligenceSnapshotViewer } from "./IntelligenceSnapshotViewer";

export function IntelligenceSnapshotHistory() {
  const {
    snapshots,
    loading,
    error,
    refresh,
    deleteSnapshot,
  } = useIntelligenceSnapshots();

  const [selectedSnapshot, setSelectedSnapshot] = useState<IntelligenceSnapshot | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const handleDelete = async (snapshot: IntelligenceSnapshot) => {
    const confirmed = window.confirm("Delete this intelligence snapshot?");

    if (!confirmed) {
      return;
    }

    setMutationError(null);

    if (selectedSnapshot?.id === snapshot.id) {
      setSelectedSnapshot(null);
    }

    try {
      await deleteSnapshot(snapshot.id);
    } catch (err) {
      setMutationError(
        err instanceof Error
          ? err.message
          : "Intelligence snapshot deletion failed.",
      );
    }
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      "Delete all intelligence snapshots? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setIsClearing(true);
    setMutationError(null);
    setSelectedSnapshot(null);

    try {
      for (const snapshot of snapshots) {
        await deleteSnapshot(snapshot.id);
      }
    } catch (err) {
      setMutationError(
        err instanceof Error
          ? err.message
          : "Intelligence snapshot deletion failed.",
      );
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Snapshot History
        </p>

        <h3 className="mt-2 text-xl font-black text-white">Loading snapshots</h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Retrieving durable intelligence snapshots.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
          Snapshot History
        </p>

        <h3 className="mt-2 text-xl font-black text-white">
          Unable to load snapshots
        </h3>

        <p role="alert" className="mt-2 text-sm leading-6 text-red-300">
          {error}
        </p>

        <button
          type="button"
          onClick={refresh}
          className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          Retry
        </button>
      </section>
    );
  }

  if (snapshots.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Snapshot History
        </p>

        <h3 className="mt-2 text-xl font-black text-white">No snapshots yet</h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Create an intelligence snapshot to preserve the current repository intelligence state.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Snapshot History
          </p>

          <h3 className="mt-2 text-2xl font-black text-white">
            Intelligence Snapshots
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            {snapshots.length} {snapshots.length === 1 ? "snapshot" : "snapshots"} stored durably.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearAll}
          disabled={isClearing}
          className="inline-flex items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.03] px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:border-red-400/30 hover:bg-red-400/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear All
        </button>
      </div>

      {selectedSnapshot ? (
        <IntelligenceSnapshotViewer
          snapshot={selectedSnapshot}
          onClose={() => setSelectedSnapshot(null)}
        />
      ) : null}

      {mutationError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-400/10 bg-red-400/[0.03] px-4 py-3 text-sm text-red-300"
        >
          {mutationError}
        </p>
      ) : null}

      <div className="grid gap-3">
        {snapshots.map((snapshot) => (
          <IntelligenceSnapshotCard
            key={snapshot.id}
            snapshot={snapshot}
            onView={() => setSelectedSnapshot(snapshot)}
            onDelete={() => handleDelete(snapshot)}
          />
        ))}
      </div>
    </section>
  );
}
