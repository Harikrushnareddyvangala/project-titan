"use client";

import type {
  RepositorySimilarity,
  RepositorySimilarityAnalysis,
} from "@/types/github";

import { MetricCard } from "@/components/workspace/comparison/MetricCard";

interface RepositorySimilarityDashboardProps {
  analysis: RepositorySimilarityAnalysis;
}

function formatPair(pair?: RepositorySimilarity): string {
  if (!pair) {
    return "-";
  }

  return `${pair.repositoryA} ↔ ${pair.repositoryB}`;
}
function relationshipColor(
  relationship: RepositorySimilarity["relationship"],
): string {
  switch (relationship) {
    case "Nearly Identical":
      return "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";

    case "Highly Similar":
      return "text-cyan-300 bg-cyan-500/10 border-cyan-500/20";

    case "Moderately Similar":
      return "text-amber-300 bg-amber-500/10 border-amber-500/20";

    case "Different":
      return "text-orange-300 bg-orange-500/10 border-orange-500/20";

    default:
      return "text-red-300 bg-red-500/10 border-red-500/20";
  }
}


function progressBarColor(
  relationship: RepositorySimilarity["relationship"],
): string {
  switch (relationship) {
    case "Nearly Identical": return "bg-emerald-400";
    case "Highly Similar": return "bg-cyan-400";
    case "Moderately Similar": return "bg-amber-400";
    case "Different": return "bg-orange-400";
    default: return "bg-red-400";
  }
}

export function RepositorySimilarityDashboard({
  analysis,
}: RepositorySimilarityDashboardProps) {
  if (analysis.similarities.length===0){
    return <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-12 text-center backdrop-blur-3xl"><h2 className="text-3xl font-bold text-white">Repository Similarity</h2><p className="mt-4 text-zinc-400">Analyze at least two repositories to generate similarity insights.</p></section>;
  }
  const sortedSimilarities=[...analysis.similarities].sort((a,b)=>b.overallSimilarity-a.overallSimilarity);
  const closestPair=analysis.closestRepositories[0];
  const mostDifferentPair=analysis.mostDifferentRepositories[0];

  return (
    <section className="space-y-8">

      {/* ------------------------------------------------ */}
      {/* Header                                           */}
      {/* ------------------------------------------------ */}

      <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

        <h2 className="text-3xl font-bold text-white">
          Repository Similarity
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-zinc-400">
          Analyze repository relationships across your engineering
          portfolio to identify architectural consistency,
          technology overlap, engineering alignment,
          and portfolio diversity.
        </p>

      </div>

      {/* ------------------------------------------------ */}
      {/* Portfolio Similarity Overview                    */}
      {/* ------------------------------------------------ */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Average Similarity"
          value={`${analysis.averageSimilarity.toFixed(1)}%`}
        />

        <MetricCard
          title="Repository Comparisons"
          value={analysis.similarities.length.toString()}
        />

        <MetricCard
          title="Closest Pair"
          value={formatPair(closestPair)}
        />

        <MetricCard
          title="Most Different"
          value={formatPair(mostDifferentPair)}
        />

      </div>
            {/* ------------------------------------------------ */}
      {/* Similarity Rankings                             */}
      {/* ------------------------------------------------ */}

      <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-bold text-white">
              Repository Similarity Rankings
            </h3>

            <p className="mt-2 text-zinc-400">
              Pairwise similarity analysis across the complete repository
              portfolio.
            </p>

          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">

            <span className="text-sm font-medium text-cyan-300">
              {analysis.similarities.length} Comparisons
            </span>

          </div>

        </div>

        <div className="mt-8 overflow-x-auto">

          <table className="min-w-full">

            <thead>
  <tr className="border-b border-white/10 text-left">
    <th className="pb-4 pr-6 text-sm font-semibold uppercase tracking-wide text-zinc-400">
      #
    </th>

    <th className="pb-4 pr-6 text-sm font-semibold uppercase tracking-wide text-zinc-400">
      Repository Pair
    </th>

    <th className="pb-4 pr-6 text-sm font-semibold uppercase tracking-wide text-zinc-400">
      Similarity
    </th>

    <th className="pb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
      Relationship
    </th>
  </tr>
</thead>

            <tbody>
  {sortedSimilarities.map((similarity, index) => (
    <tr
      key={`${similarity.repositoryA}-${similarity.repositoryB}`}
      className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
    >
      {/* Rank */}
      <td className="py-5 pr-6 align-middle">
        <span className="text-lg font-bold text-cyan-300">
          {index + 1}
        </span>
      </td>

      {/* Repository Pair */}
      <td className="py-5 pr-6 align-middle">
        <div className="space-y-1">
          <div className="font-semibold text-white">
            {similarity.repositoryA}
          </div>

          <div className="text-xs tracking-widest text-zinc-500">
            ↔
          </div>

          <div className="text-zinc-300">
            {similarity.repositoryB}
          </div>
        </div>
      </td>

      {/* Similarity */}
      <td className="py-5 pr-6 align-middle">
        <div className="flex items-center gap-4">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressBarColor(
                similarity.relationship,
              )}`}
              style={{
                width: `${similarity.overallSimilarity}%`,
              }}
            />
          </div>

          <span className="w-16 text-right font-semibold text-white">
            {similarity.overallSimilarity.toFixed(1)}%
          </span>
        </div>
      </td>

      {/* Relationship */}
      <td className="py-5 align-middle">
        <span
          className={`inline-flex rounded-full border px-4 py-1 text-sm font-medium ${relationshipColor(
            similarity.relationship,
          )}`}
        >
          {similarity.relationship}
        </span>
      </td>
    </tr>
  ))}
</tbody>

          </table>

        </div>

      </div>
            {/* ------------------------------------------------ */}
      {/* Executive Repository Pair Analysis               */}
      {/* ------------------------------------------------ */}

      <div className="grid gap-8 xl:grid-cols-2">

        {/* ================================================ */}
        {/* Closest Repository Pair                          */}
        {/* ================================================ */}

        <div className="rounded-[34px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 backdrop-blur-3xl">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-bold text-white">
                Closest Repository Pair
              </h3>

              <p className="mt-2 text-zinc-400">
                Highest engineering similarity detected.
              </p>

            </div>

            <div className="rounded-2xl bg-emerald-500/15 px-4 py-2">

              <span className="text-sm font-semibold text-emerald-300">
                {closestPair?.overallSimilarity.toFixed(1)}%
              </span>

            </div>

          </div>

          {closestPair && (

            <div className="mt-8 space-y-6">

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
  <div className="flex items-center justify-between gap-6">

    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
        Repository A
      </p>

      <p className="font-semibold text-white break-all">
        {closestPair.repositoryA}
      </p>
    </div>

    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xl text-emerald-300">
      ↔
    </div>

    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
        Repository B
      </p>

      <p className="font-semibold text-white break-all">
        {closestPair.repositoryB}
      </p>
    </div>

  </div>
</div>

             <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  <MetricCard
    title="Engineering"
    value={`${closestPair.engineeringSimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Security"
    value={`${closestPair.securitySimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Production"
    value={`${closestPair.productionSimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Enterprise"
    value={`${closestPair.enterpriseSimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Hiring"
    value={`${closestPair.hiringSimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Technology"
    value={`${closestPair.technologySimilarity.toFixed(1)}%`}
  />
</div>

            </div>

          )}

        </div>

        {/* ================================================ */}
        {/* Most Different Repository Pair                   */}
        {/* ================================================ */}

        <div className="rounded-[34px] border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-transparent p-8 backdrop-blur-3xl">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-bold text-white">
                Most Different Repository Pair
              </h3>

              <p className="mt-2 text-zinc-400">
                Greatest engineering diversity detected.
              </p>

            </div>

            <div className="rounded-2xl bg-rose-500/15 px-4 py-2">

              <span className="text-sm font-semibold text-rose-300">
                {mostDifferentPair?.overallSimilarity.toFixed(1)}%
              </span>

            </div>

          </div>

          {mostDifferentPair && (

            <div className="mt-8 space-y-6">

             <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
  <div className="flex items-center justify-between gap-6">

    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
        Repository A
      </p>

      <p className="break-all font-semibold text-white">
        {mostDifferentPair.repositoryA}
      </p>
    </div>

    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-xl text-rose-300">
      ↔
    </div>

    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
        Repository B
      </p>

      <p className="break-all font-semibold text-white">
        {mostDifferentPair.repositoryB}
      </p>
    </div>

  </div>
</div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  <MetricCard
    title="Engineering"
    value={`${mostDifferentPair.engineeringSimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Security"
    value={`${mostDifferentPair.securitySimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Production"
    value={`${mostDifferentPair.productionSimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Enterprise"
    value={`${mostDifferentPair.enterpriseSimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Hiring"
    value={`${mostDifferentPair.hiringSimilarity.toFixed(1)}%`}
  />

  <MetricCard
    title="Technology"
    value={`${mostDifferentPair.technologySimilarity.toFixed(1)}%`}
  />
</div>

            </div>

          )}

        </div>

      </div>
      {/* ------------------------------------------------ */}
      {/* Executive Intelligence                           */}
      {/* ------------------------------------------------ */}

      <div className="grid gap-8 xl:grid-cols-2">

        {/* ================================================ */}
        {/* Relationship Intelligence                       */}
        {/* ================================================ */}

        <div className="rounded-[34px] border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent p-8 backdrop-blur-3xl">

          <h3 className="text-2xl font-bold text-white">
            Relationship Intelligence
          </h3>

          <p className="mt-2 text-zinc-400">
            Executive portfolio assessment based on repository similarity.
          </p>

          <div className="mt-8 space-y-5">

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

              <h4 className="mb-3 font-semibold text-white">
                Portfolio Consistency
              </h4>

              <p className="leading-7 text-zinc-300">
                The analyzed repositories demonstrate an average engineering
                similarity of{" "}
                <span className="font-semibold text-cyan-300">
                  {analysis.averageSimilarity.toFixed(1)}%
                </span>
                , indicating a generally consistent engineering approach across
                the portfolio while still maintaining meaningful variation
                between projects.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

              <h4 className="mb-3 font-semibold text-white">
                Strongest Alignment
              </h4>

              <p className="leading-7 text-zinc-300">
                <span className="font-semibold text-emerald-300">
                  {closestPair?.repositoryA}
                </span>{" "}
                and{" "}
                <span className="font-semibold text-emerald-300">
                  {closestPair?.repositoryB}
                </span>{" "}
                exhibit the highest architectural consistency and engineering
                alignment within the portfolio.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

              <h4 className="mb-3 font-semibold text-white">
                Engineering Diversity
              </h4>

              <p className="leading-7 text-zinc-300">
                Portfolio diversity is preserved through the engineering
                differences between{" "}
                <span className="font-semibold text-rose-300">
                  {mostDifferentPair?.repositoryA}
                </span>{" "}
                and{" "}
                <span className="font-semibold text-rose-300">
                  {mostDifferentPair?.repositoryB}
                </span>
                , demonstrating healthy architectural variation across the
                software ecosystem.
              </p>

            </div>

          </div>

        </div>

        {/* ================================================ */}
        {/* Engineering Recommendations                      */}
        {/* ================================================ */}

        <div className="rounded-[34px] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-8 backdrop-blur-3xl">

          <h3 className="text-2xl font-bold text-white">
            Engineering Recommendations
          </h3>

          <p className="mt-2 text-zinc-400">
            Recommended engineering actions based on repository relationship
            analysis.
          </p>

          <div className="mt-8 space-y-4">

            {[
              {
                title: "Standardize Engineering Practices",
                description:
                  "Continue sharing successful architectural patterns across highly similar repositories.",
              },
              {
                title: "Encourage Technology Diversity",
                description:
                  "Maintain diversity where repositories solve different business domains to reduce architectural monoculture.",
              },
              {
                title: "Reuse Proven Components",
                description:
                  "Extract common infrastructure into reusable libraries where similarity is consistently high.",
              },
              {
                title: "Monitor Repository Drift",
                description:
                  "Periodically evaluate repository relationships to detect unexpected architectural divergence.",
              },
              {
                title: "Strengthen Shared Security",
                description:
                  "Maintain consistent security baselines across all repositories regardless of technology stack.",
              },
            ].map((recommendation) => (

              <div
                key={recommendation.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:bg-white/[0.06]"
              >

                <h4 className="font-semibold text-white">
                  {recommendation.title}
                </h4>

                <p className="mt-2 leading-7 text-zinc-300">
                  {recommendation.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default RepositorySimilarityDashboard;