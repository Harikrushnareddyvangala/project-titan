"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, Layers3 } from "lucide-react";

const researchModules = [
  {
    title: "Active Research",
    description:
      "Track ongoing research initiatives, milestones, and current areas of investigation.",
  },
  {
    title: "Experiments",
    description:
      "Prototype and evaluate new AI models, algorithms, and engineering concepts.",
  },
  {
    title: "Architecture Studies",
    description:
      "Document architecture decisions, system evolution, and technical explorations.",
  },
  {
    title: "Publications",
    description:
      "Manage research papers, technical reports, white papers, and future publications.",
  },
  {
    title: "Unified Intelligence Systems",
    description:
      "Central hub for the long-term Unified Intelligence Systems research program.",
  },
  {
    title: "Research Roadmap",
    description:
      "Plan future milestones, experiments, and long-term engineering objectives.",
  },
];

export function ResearchWorkspace() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl md:p-10">
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
            <Layers3 className="mr-2 h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Project TITAN
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-black">
            Research Laboratory
          </h1>

          <p className="mt-6 max-w-4xl text-zinc-400 leading-8">
            Home for experimental intelligence systems, research prototypes,
            architecture studies, publications, and long-term AI initiatives.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {researchModules.map((module) => (
            <ModuleCard
              key={module.title}
              title={module.title}
              description={module.description}
            />
          ))}
        </section>

        <WorkspaceFooter
          href="/workspace"
          label="Return to Workspace"
        />
      </div>
    </main>
  );
}

interface ModuleCardProps {
  title: string;
  description: string;
}

function ModuleCard({
  title,
  description,
}: ModuleCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 transition-all duration-300 hover:border-cyan-400/30 hover:bg-black/40">
      <FlaskConical className="h-6 w-6 text-cyan-400" />

      <h3 className="mt-5 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-zinc-400">
        {description}
      </p>
    </div>
  );
}

interface WorkspaceFooterProps {
  href: string;
  label: string;
}

function WorkspaceFooter({
  href,
  label,
}: WorkspaceFooterProps) {
  return (
    <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
            Next
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white">
            Continue Research
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Expand Project TITAN through new intelligence engines, experimental
            AI systems, and long-term research initiatives.
          </p>
        </div>

        <Link
          href={href}
          className="inline-flex items-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
        >
          {label}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}