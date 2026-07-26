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
          title="Strongest Repository"
          value={comparison.strongestRepository}
        />

        <MetricCard
          title="Weakest Repository"
          value={comparison.weakestRepository}
        />

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