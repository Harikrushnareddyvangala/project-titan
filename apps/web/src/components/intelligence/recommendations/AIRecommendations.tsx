"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { RecommendationCard } from "./RecommendationCard";

interface AIRecommendationsProps {
  analytics: RepositoryAnalytics;
}

export function AIRecommendations({
  analytics,
}: AIRecommendationsProps) {
  const recommendations =
    analytics.recommendations ?? [];

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          AI Recommendations
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Engineering Recommendations
        </h2>

        <p className="mt-3 max-w-3xl text-zinc-400">
          Actionable recommendations derived from the
          repository intelligence analysis.
        </p>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid gap-4">
          {recommendations.map(
            (recommendation, index) => (
              <RecommendationCard
                key={`${recommendation.title}-${index}`}
                recommendation={recommendation}
                index={index}
              />
            ),
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-zinc-500">
            No AI recommendations are available for
            this repository yet.
          </p>
        </div>
      )}
    </section>
  );
}