"use client";

import type { DeveloperDNA } from "@/types/github";

import {
  Brain,
  Cpu,
  Rocket,
  Users,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface DeveloperDashboardProps {
  developer: DeveloperDNA;
}

export function DeveloperDashboard({
  developer,
}: DeveloperDashboardProps) {
  return (
    <section className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">

        <div className="flex items-center gap-3">

          <Brain className="h-8 w-8 text-cyan-400" />

          <div>

            <h2 className="text-3xl font-bold">
              Developer DNA
            </h2>

            <p className="mt-2 text-zinc-400">
              AI-generated engineering personality based on repository intelligence.
            </p>

          </div>

        </div>

      </div>

      {/* Metrics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <MetricCard
          title="Innovation"
          value={`${developer.innovationScore}%`}
          icon={<Sparkles className="h-6 w-6" />}
        />

        <MetricCard
          title="Architecture"
          value={`${developer.architectureScore}%`}
          icon={<Cpu className="h-6 w-6" />}
        />

        <MetricCard
          title="Execution"
          value={`${developer.executionScore}%`}
          icon={<Rocket className="h-6 w-6" />}
        />

        <MetricCard
          title="Collaboration"
          value={`${developer.collaborationScore}%`}
          icon={<Users className="h-6 w-6" />}
        />

        <MetricCard
          title="Learning"
          value={`${developer.learningScore}%`}
          icon={<BookOpen className="h-6 w-6" />}
        />

      </div>

      {/* DNA Summary */}

      <div className="rounded-3xl border border-white/10 bg-black/30 p-8">

        <h3 className="text-2xl font-bold">
          Developer Archetype
        </h3>

        <p className="mt-4 text-cyan-400 text-xl font-semibold">
          {developer.archetype}
        </p>

        <p className="mt-6 leading-8 text-zinc-300">
          {developer.dnaSummary}
        </p>

      </div>

      {/* Strengths */}

      <div className="rounded-3xl border border-white/10 bg-black/30 p-8">

        <h3 className="text-2xl font-bold">
          Engineering Strengths
        </h3>

        <div className="mt-6 grid gap-4">

          {developer.strengths.map((strength) => (

            <div
              key={strength}
              className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4"
            >
              {strength}
            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({
  title,
  value,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">

      <div className="flex items-center justify-between">

        {icon}

        <span className="text-sm text-zinc-500">
          {title}
        </span>

      </div>

      <div className="mt-6 text-3xl font-black">

        {value}

      </div>

    </div>
  );
}