"use client";

import type { RankedRepository } from "@/types/github";

interface RepositoryScoreBreakdownCardProps {
  repository: RankedRepository;
}

const SCORE_WEIGHTS = [
  { label: "Engineering", weight: "30%" },
  { label: "Security", weight: "20%" },
  { label: "Production", weight: "20%" },
  { label: "Enterprise", weight: "20%" },
  { label: "Hiring", weight: "10%" },
];

export function RepositoryScoreBreakdownCard({
  repository,
}: RepositoryScoreBreakdownCardProps) {
  return (
    <div className="rounded-[34px] border border-cyan-400/20 bg-cyan-500/5 p-8 backdrop-blur-3xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Repository Score Breakdown
          </p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {repository.medal} {repository.repositoryName}
          </h3>

          <p className="mt-2 text-zinc-400">
            Detailed engineering intelligence for the selected repository.
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">
            Overall Score
          </p>

          <p className="mt-2 text-5xl font-bold text-cyan-300">
            {repository.overallScore.toFixed(1)}
          </p>

          <p className="mt-3 text-white">
            Grade{" "}
            <span className="font-bold">
              {repository.repositoryGrade}
            </span>
          </p>

          <p className="mt-1 text-zinc-400">
            Rank #{repository.rank}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Metric
          label="Engineering"
          value={repository.engineeringScore}
        />

        <Metric
          label="Security"
          value={repository.securityScore}
        />

        <Metric
          label="Production"
          value={repository.productionScore}
        />

        <Metric
          label="Enterprise"
          value={repository.enterpriseReadiness}
        />

        <Metric
          label="Hiring"
          value={repository.hiringScore}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-6">
        <h4 className="text-lg font-semibold text-white">
          TITAN Weighted Scoring Model
        </h4>

        <p className="mt-2 text-zinc-400">
          Overall repository rankings are calculated using weighted engineering
          intelligence metrics.
        </p>

        <div className="mt-6 space-y-4">
          {SCORE_WEIGHTS.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between border-b border-white/5 pb-3 last:border-none last:pb-0"
            >
              <span className="text-zinc-300">
                {metric.label}
              </span>

              <span className="font-semibold text-cyan-300">
                {metric.weight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: number;
}

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}