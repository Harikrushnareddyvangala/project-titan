"use client";

import { Layers3, Sparkles } from "lucide-react";

import { workspaceNavigation } from "@/lib/constants/workspaceNavigation";

export function WorkspaceHeader() {
  const liveModules = workspaceNavigation.filter(
    (module) => module.status === "Available",
  ).length;

  return (
    <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl md:p-10">
      <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
        <Layers3 className="mr-2 h-4 w-4 text-cyan-300" />
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Project TITAN
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            AI Workspace
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-zinc-400 md:text-xl">
            Unified engineering intelligence platform for repository analytics,
            portfolio analysis, recruiter evaluation, developer profiling, and
            future AI research.
          </p>
        </div>

        <div className="inline-flex items-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
          <Sparkles className="mr-2 h-4 w-4 text-cyan-300" />
          <span className="text-sm font-semibold text-cyan-200">
            {liveModules} live modules
          </span>
        </div>
      </div>
    </section>
  );
}