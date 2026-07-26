"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Layers3,
  Code2,
} from "lucide-react";

export function DeveloperWorkspace() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

        <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
            <Layers3 className="mr-2 h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Project TITAN
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-black">
            Developer DNA
          </h1>

          <p className="mt-6 max-w-4xl text-zinc-400 leading-8">
            Analyze engineering behaviour, architectural thinking,
            technology expertise and long-term software craftsmanship.
          </p>

        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          <ModuleCard title="Engineering Personality" />
          <ModuleCard title="Architecture Thinking" />
          <ModuleCard title="Coding Style" />
          <ModuleCard title="Technology Expertise" />
          <ModuleCard title="Growth Timeline" />
          <ModuleCard title="Developer DNA Report" />

        </section>

        <WorkspaceFooter
          href="/workspace/portfolio"
          label="Open Portfolio Intelligence"
        />

      </div>
    </main>
  );
}

function ModuleCard({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <Brain className="h-6 w-6 text-cyan-400" />
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-7 text-zinc-400">
        This capability will be powered by the Developer DNA engine.
      </p>
    </div>
  );
}

function WorkspaceFooter({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
            Next
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            Connect Developer Intelligence
          </h2>
        </div>

        <Link
          href={href}
          className="inline-flex items-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 text-cyan-300"
        >
          {label}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}