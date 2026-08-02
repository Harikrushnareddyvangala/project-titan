"use client";
import type { DeveloperDNA } from "@/types/github";

import {
  BookOpen,
  Brain,
  Cpu,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricGrid } from "@/components/dashboard/MetricGrid";

interface DeveloperDashboardProps {
  developer: DeveloperDNA;
}

export function DeveloperDashboard({
  developer,
}: DeveloperDashboardProps) {
  return (
    <section className="space-y-8">
      <DashboardHeader
        title="Developer DNA"
        description="AI-generated engineering personality based on repository intelligence."
        icon={<Brain className="h-8 w-8 text-cyan-400" />}
      />

      <MetricGrid>
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
      </MetricGrid>

      <DashboardSection title="Developer Archetype">
        <p className="text-xl font-semibold text-cyan-400">
          {developer.archetype}
        </p>

        <p className="mt-4 leading-8 text-zinc-300">
          {developer.dnaSummary}
        </p>
      </DashboardSection>

      <DashboardSection title="Engineering Strengths">
        <div className="grid gap-4">
          {developer.strengths.map((strength) => (
            <div
              key={strength}
              className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4"
            >
              {strength}
            </div>
          ))}
        </div>
      </DashboardSection>
    </section>
  );
}