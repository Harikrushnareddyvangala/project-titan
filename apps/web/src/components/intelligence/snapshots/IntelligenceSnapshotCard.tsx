"use client";

import {
    Eye,
    Share2,
    Trash2,
    Download
} from "lucide-react";

import type { IntelligenceSnapshot } from "@/types/intelligence";

import {
    exportIntelligenceSnapshot,
} from "@/lib/intelligence/export";

import {
    useIntelligenceShare,
} from "@/hooks/useIntelligenceShare";

interface IntelligenceSnapshotCardProps {
    snapshot: IntelligenceSnapshot;
    onView: () => void;
    onDelete: () => void;
}

export function IntelligenceSnapshotCard({
    snapshot,
    onView,
    onDelete,
}: IntelligenceSnapshotCardProps) {
    const createdAt = new Date(
        snapshot.createdAt,
    );
    const {
        shareSnapshot,
        shared,
    } = useIntelligenceShare();

    return (
        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.04]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                        {snapshot.repository}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        {createdAt.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                        Snapshot ID: {snapshot.id}
                    </p>
                </div>

                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={onView}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                    >
                        <Eye className="h-4 w-4" />
                        View
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            shareSnapshot(snapshot)
                        }
                        aria-label={`Share snapshot ${snapshot.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-zinc-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                    >
                        <Share2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            exportIntelligenceSnapshot(snapshot)
                        }
                        aria-label={`Export snapshot ${snapshot.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-zinc-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                    >
                        <Download className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        aria-label={`Delete snapshot ${snapshot.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.03] p-2.5 text-red-400 transition hover:border-red-400/30 hover:bg-red-400/[0.08] hover:text-red-300"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
                {shared ? (
                    <p
                        role="status"
                        className="mt-2 text-xs font-medium text-cyan-300"
                    >
                        Snapshot link copied.
                    </p>
                ) : null}
            </div>
        </article>
    );
}