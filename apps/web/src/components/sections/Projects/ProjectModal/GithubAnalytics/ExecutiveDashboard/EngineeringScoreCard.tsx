"use client";

import type { RepositoryAnalytics } from "@/types/github";
import {
  Activity,
  ShieldCheck,
  Gauge,
  Rocket,
} from "lucide-react";

interface Props {
  analytics: RepositoryAnalytics;
}

interface ScoreItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function ScoreItem({
  icon,
  label,
  value,
}: ScoreItemProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <div className="mb-3 flex items-center gap-2 text-cyan-400">
        {icon}
      </div>

      <p className="text-sm text-zinc-400">
        {label}
      </p>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">

        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

      <h3 className="mt-3 text-3xl font-bold">
        {value}%
      </h3>

    </div>
  );
}

export function EngineeringScoreCard({
  analytics,
}: Props) {

  return (

    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="mb-8">

        <h2 className="text-2xl font-bold">
          Engineering Scores
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          AI-generated engineering quality assessment
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <ScoreItem
          icon={<Activity size={20} />}
          label="Engineering Score"
          value={analytics.engineeringScore}
        />

        <ScoreItem
          icon={<ShieldCheck size={20} />}
          label="Repository Health"
          value={analytics.healthScore}
        />

        <ScoreItem
          icon={<Rocket size={20} />}
          label="Production Ready"
          value={analytics.productionScore}
        />

        <ScoreItem
          icon={<Gauge size={20} />}
          label="Enterprise Ready"
          value={analytics.enterpriseReadiness}
        />

      </div>

    </section>

  );

}