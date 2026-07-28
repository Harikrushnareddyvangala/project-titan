"use client";

import type { RepositoryTechnologyAnalysis } from "@/types/github";
import { MetricCard } from "./MetricCard";

interface RepositoryTechnologyDashboardProps {
  technology: RepositoryTechnologyAnalysis;
}

export function RepositoryTechnologyDashboard({
  technology,
}: RepositoryTechnologyDashboardProps) {
  return (
    <section className="space-y-8">

      <div className="rounded-[34px] border border-cyan-400/20 bg-cyan-500/5 p-8 backdrop-blur-3xl">

        <h2 className="text-2xl font-bold text-cyan-300">
          Portfolio Technology Intelligence
        </h2>

        <p className="mt-3 text-zinc-400">
          Aggregated technology analysis across all compared repositories.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Technologies"
          value={technology.totalTechnologies.toString()}
        />

        <MetricCard
          title="Languages"
          value={technology.languageCount.toString()}
        />

        <MetricCard
          title="Frameworks"
          value={technology.frameworkCount.toString()}
        />

        <MetricCard
          title="Diversity"
          value={`${technology.diversityScore}%`}
        />

      </div>
      {/* Technology Categories */}

<div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

  <h3 className="text-xl font-bold text-white">
    Technology Categories
  </h3>

  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

    {technology.categories.map((category) => (
      <div
        key={category.category}
        className="rounded-2xl border border-white/10 bg-black/20 p-5"
      >
        <h4 className="font-semibold text-cyan-300">
          {category.category}
        </h4>

        <div className="mt-3 space-y-2 text-sm text-zinc-300">

          <p>
            Technologies: {category.technologyCount}
          </p>

          <p>
            Repositories: {category.repositoryCount}
          </p>

          <p>
            Adoption: {category.adoptionPercentage}%
          </p>

        </div>
      </div>
    ))}

  </div>

</div>
{/* Technology Insights */}

<div className="rounded-[34px] border border-amber-400/20 bg-amber-500/5 p-8 backdrop-blur-3xl">

  <h3 className="text-xl font-bold text-amber-300">
    Technology Insights
  </h3>

  <div className="mt-6 space-y-5">

    {technology.insights.map((insight) => (

      <div
        key={insight.title}
        className="rounded-2xl border border-white/10 bg-black/20 p-5"
      >

        <h4 className="font-semibold text-white">
          {insight.title}
        </h4>

        <p className="mt-2 text-zinc-300">
          {insight.description}
        </p>

        <span
          className="
            mt-4
            inline-flex
            rounded-full
            border
            border-amber-400/30
            px-3
            py-1
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-amber-300
          "
        >
          {insight.severity}
        </span>

      </div>

    ))}

  </div>

</div>
{/* Technology Recommendations */}

<div className="rounded-[34px] border border-cyan-400/20 bg-cyan-500/5 p-8 backdrop-blur-3xl">

  <h3 className="text-xl font-bold text-cyan-300">
    Technology Recommendations
  </h3>

  <div className="mt-6 space-y-5">

    {technology.recommendations.map((recommendation) => (

      <div
        key={recommendation.title}
        className="rounded-2xl border border-white/10 bg-black/20 p-5"
      >

        <h4 className="font-semibold text-white">
          {recommendation.title}
        </h4>

        <p className="mt-2 text-zinc-300">
          {recommendation.description}
        </p>

        <span
          className="
            mt-4
            inline-flex
            rounded-full
            border
            border-cyan-400/30
            px-3
            py-1
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-cyan-300
          "
        >
          {recommendation.priority}
        </span>

      </div>

    ))}

  </div>

</div>
{/* Portfolio Technology Matrix */}

<div className="rounded-[34px] border border-violet-400/20 bg-violet-500/5 p-8 backdrop-blur-3xl">

  <h3 className="text-xl font-bold text-violet-300">
    Portfolio Technology Matrix
  </h3>

  <p className="mt-2 text-zinc-400">
    Technologies detected across all compared repositories.
  </p>

  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

    {technology.technologies.map((item) => (

      <div
        key={`${item.category}-${item.name}`}
        className="rounded-2xl border border-white/10 bg-black/20 p-5"
      >

        <h4 className="font-semibold text-white">
          {item.name}
        </h4>

        <p className="mt-2 text-sm text-zinc-400">
          {item.category}
        </p>

        <div className="mt-4 space-y-2 text-sm">

          <div className="flex justify-between">
            <span className="text-zinc-400">
              Repositories
            </span>

            <span className="text-cyan-300">
              {item.repositoryCount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">
              Adoption
            </span>

            <span className="text-emerald-300">
              {item.adoptionPercentage}%
            </span>
          </div>

        </div>

      </div>

    ))}

  </div>

</div>

    </section>
  );
}