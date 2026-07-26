"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Layers3,
} from "lucide-react";

export function OrganizationWorkspace() {
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
            Organization Intelligence
          </h1>

          <p className="mt-6 max-w-4xl text-zinc-400 leading-8">
            Aggregate engineering insights across repositories,
            portfolios and development teams.
          </p>

        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          <ModuleCard title="Engineering Overview" />
          <ModuleCard title="Repository Health" />
          <ModuleCard title="Technology Landscape" />
          <ModuleCard title="Risk Assessment" />
          <ModuleCard title="Delivery Metrics" />
          <ModuleCard title="Executive Dashboard" />

        </section>

        <WorkspaceFooter
          href="/workspace/repository"
          label="Open Repository Intelligence"
        />

      </div>
    </main>
  );
}

function ModuleCard({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <Building2 className="h-6 w-6 text-cyan-400" />
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-7 text-zinc-400">
        Organization-wide engineering analytics will appear here.
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
            Enterprise Intelligence
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