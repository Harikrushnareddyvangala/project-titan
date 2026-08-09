"use client";

import {
  Download,
  FileText,
  Share2,
  Camera,
} from "lucide-react";

interface IntelligenceActionBarProps {
  onSnapshot?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onReport?: () => void;
}

export function IntelligenceActionBar({
  onSnapshot,
  onExport,
  onShare,
  onReport,
}: IntelligenceActionBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        onClick={onSnapshot}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
      >
        <Camera className="h-4 w-4" />
        Snapshot
      </button>

      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
      >
        <Download className="h-4 w-4" />
        Export
      </button>

      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      <button
        type="button"
        onClick={onReport}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
      >
        <FileText className="h-4 w-4" />
        Report
      </button>
    </div>
  );
}