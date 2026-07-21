"use client";

import {
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics;
}

export function RiskAssessmentCard({
  analytics,
}: Props) {

  return (

    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="mb-6 flex items-center gap-3">

        <AlertTriangle
          className="text-orange-400"
          size={28}
        />

        <div>

          <h2 className="text-2xl font-bold">
            Risk Assessment
          </h2>

          <p className="text-sm text-zinc-400">
            AI detected engineering risks
          </p>

        </div>

      </div>

      <div className="mb-6">

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold
          ${
            analytics.riskLevel === "Low"
              ? "bg-emerald-500/20 text-emerald-400"
              : analytics.riskLevel === "Medium"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {analytics.riskLevel} Risk
        </span>

      </div>

      <div className="space-y-3">

        {analytics.risks.length === 0 ? (

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

            <div className="flex items-center gap-3">

              <ShieldAlert
                size={20}
                className="text-emerald-400"
              />

              <span>
                No major engineering risks detected.
              </span>

            </div>

          </div>

        ) : (

          analytics.risks.map((risk) => (

            <div
              key={risk}
              className="rounded-xl border border-red-500/20 bg-red-500/5 p-4"
            >

              <div className="flex gap-3">

                <AlertTriangle
                  size={18}
                  className="mt-1 text-red-400"
                />

                <span>{risk}</span>

              </div>

            </div>

          ))

        )}

      </div>

    </section>

  );

}