"use client";

import {
  Rocket,
  CheckCircle2,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics;
}

export function DeploymentReadinessCard({
  analytics,
}: Props) {

  const score =
    analytics.releaseReadiness;

  return (

    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="flex items-center gap-3">

        <Rocket
          size={28}
          className="text-cyan-400"
        />

        <div>

          <h2 className="text-2xl font-bold">
            Deployment Readiness
          </h2>

          <p className="text-sm text-zinc-400">
            AI production deployment assessment
          </p>

        </div>

      </div>

      <div className="mt-8">

        <div className="flex items-center justify-between">

          <span className="text-zinc-400">
            Release Readiness
          </span>

          <span className="text-3xl font-bold">
            {score}%
          </span>

        </div>

        <div className="mt-4 h-4 overflow-hidden rounded-full bg-zinc-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-700"
            style={{
              width: `${score}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

        <div className="flex gap-3">

          <CheckCircle2
            className="text-emerald-400"
            size={22}
          />

          <div>

            <h4 className="font-semibold">
              Production Status
            </h4>

            <p className="mt-2 text-zinc-300">

              {analytics.deploymentReady
                ? "Repository is suitable for enterprise deployment."
                : "Repository requires additional engineering work before production deployment."}

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}