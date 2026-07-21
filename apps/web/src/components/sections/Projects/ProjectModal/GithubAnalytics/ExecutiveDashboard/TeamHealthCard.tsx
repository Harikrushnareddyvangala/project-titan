"use client";

import {
  Users,
  GitBranch,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics;
}

export function TeamHealthCard({
  analytics,
}: Props) {

  return (

    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="flex items-center gap-3">

        <Users
          size={28}
          className="text-violet-400"
        />

        <div>

          <h2 className="text-2xl font-bold">
            Team Health
          </h2>

          <p className="text-sm text-zinc-400">
            Contributor ecosystem analysis
          </p>

        </div>

      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <Metric
          title="Team Health"
          value={`${analytics.teamHealth}%`}
        />

        <Metric
          title="Bus Factor"
          value={analytics.busFactor.toString()}
        />

        <Metric
          title="Collaboration"
          value={`${analytics.collaborationIndex}%`}
        />

        <Metric
          title="Top Contributor"
          value={`${analytics.topContributorShare}%`}
        />

      </div>

      <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">

        <div className="flex gap-3">

          <GitBranch
            className="text-violet-400"
            size={22}
          />

          <div>

            <h4 className="font-semibold">
              Contributor Distribution
            </h4>

            <p className="mt-2 text-zinc-300">
              {analytics.contributorDistribution}
            </p>

          </div>

        </div>

      </div>

    </section>

  );

}

interface MetricProps {
  title: string;
  value: string;
}

function Metric({
  title,
  value,
}: MetricProps) {

  return (

    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold">
        {value}
      </h3>

    </div>

  );

}