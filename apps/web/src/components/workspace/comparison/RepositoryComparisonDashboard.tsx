"use client";

import type { RepositoryComparison } from "@/types/github";

interface RepositoryComparisonDashboardProps {
  comparison: RepositoryComparison;
}

export function RepositoryComparisonDashboard({
  comparison,
}: RepositoryComparisonDashboardProps) {
  return (
    <section className="space-y-8">

      <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
        <h2 className="text-3xl font-bold text-white">
          Repository Comparison
        </h2>

        <p className="mt-3 text-zinc-400 leading-7">
          Compare engineering quality, hiring readiness, enterprise maturity,
          and security across multiple repositories.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

    <MetricCard
        title="Engineering Leader"
        value={comparison.engineeringLeader}
    />

    <MetricCard
        title="Security Leader"
        value={comparison.securityLeader}
    />

    <MetricCard
        title="Production Leader"
        value={comparison.productionLeader}
    />

    <MetricCard
        title="Enterprise Leader"
        value={comparison.enterpriseLeader}
    />

    <MetricCard
        title="Hiring Leader"
        value={comparison.hiringLeader}
    />

</div>
<div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <MetricCard
        title="Engineering"
        value={comparison.averageEngineeringScore.toFixed(1)}
    />

    <MetricCard
        title="Security"
        value={comparison.averageSecurityScore.toFixed(1)}
    />

    <MetricCard
        title="Enterprise"
        value={comparison.averageEnterpriseReadiness.toFixed(1)}
    />

    <MetricCard
        title="Hiring"
        value={comparison.averageHiringScore.toFixed(1)}
    />

</div>

      <div className="rounded-[34px] border border-white/10 bg-white/[0.04] overflow-hidden backdrop-blur-3xl">

        <table className="w-full">

          <thead className="bg-white/5">

            <tr>

              <HeaderCell>Repository</HeaderCell>

              <HeaderCell>Engineering</HeaderCell>

              <HeaderCell>Security</HeaderCell>

              <HeaderCell>Production</HeaderCell>

              <HeaderCell>Enterprise</HeaderCell>

              <HeaderCell>Hiring</HeaderCell>

              <HeaderCell>Grade</HeaderCell>

            </tr>

          </thead>

          <tbody>

            {comparison.repositories.map((repository) => (

              <tr
                key={repository.name}
                className="border-t border-white/10"
              >

                <BodyCell>{repository.name}</BodyCell>

                <BodyCell>{repository.engineeringScore}</BodyCell>

                <BodyCell>{repository.securityScore}</BodyCell>

                <BodyCell>{repository.productionScore}</BodyCell>

                <BodyCell>{repository.enterpriseReadiness}</BodyCell>

                <BodyCell>{repository.hiringScore}</BodyCell>

                <BodyCell>{repository.repositoryGrade}</BodyCell>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="rounded-[34px] border border-cyan-400/20 bg-cyan-500/5 p-8 backdrop-blur-3xl">

        <h3 className="text-xl font-bold text-cyan-300">
          Executive Summary
        </h3>

        <p className="mt-4 leading-8 text-zinc-300">
          {comparison.executiveSummary}
        </p>

      </div>
      <div className="rounded-[34px] border border-emerald-400/20 bg-emerald-500/5 p-8 backdrop-blur-3xl">

    <h3 className="text-xl font-bold text-emerald-300">
        Executive Verdict
    </h3>

    <p className="mt-4 leading-8 text-zinc-300">
        {comparison.executiveVerdict}
    </p>

</div>
<div className="rounded-[34px] border border-green-400/20 bg-green-500/5 p-8 backdrop-blur-3xl">

    <h3 className="text-xl font-bold text-green-300">
        Common Strengths
    </h3>

    <ul className="mt-5 space-y-3">

        {comparison.comparisonStrengths.map((strength) => (

            <li
                key={strength}
                className="text-zinc-300"
            >
                • {strength}
            </li>

        ))}

    </ul>

</div>
<div className="rounded-[34px] border border-red-400/20 bg-red-500/5 p-8 backdrop-blur-3xl">

    <h3 className="text-xl font-bold text-red-300">
        Common Risks
    </h3>

    <ul className="mt-5 space-y-3">

        {comparison.comparisonRisks.map((risk) => (

            <li
                key={risk}
                className="text-zinc-300"
            >
                • {risk}
            </li>

        ))}

    </ul>

</div>
<div className="rounded-[34px] border border-cyan-400/20 bg-cyan-500/5 p-8 backdrop-blur-3xl">

    <h3 className="text-xl font-bold text-cyan-300">
        Engineering Recommendations
    </h3>

    <div className="mt-6 space-y-5">

        {comparison.comparisonRecommendations.map((recommendation) => (

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

            </div>

        ))}

    </div>

</div>

    </section>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <p className="text-center text-sm uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>

      <p className="mt-5 text-center text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function HeaderCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-6 py-4 text-left text-sm uppercase tracking-[0.25em] text-zinc-400">
      {children}
    </th>
  );
}

function BodyCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-6 py-5 text-white">
      {children}
    </td>
  );
}