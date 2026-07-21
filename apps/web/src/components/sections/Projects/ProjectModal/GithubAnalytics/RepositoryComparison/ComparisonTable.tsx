"use client";

import { motion } from "framer-motion";
import type { RepositoryAnalytics } from "@/types/github";

interface RepositoryComparisonData {
  id: number;
  name: string;
  analytics: RepositoryAnalytics;
}

interface ComparisonTableProps {
  repositories: RepositoryComparisonData[];
}

interface MetricRow {
  label: string;
  accessor: (analytics: RepositoryAnalytics) => string | number;
}

export function ComparisonTable({
  repositories,
}: ComparisonTableProps) {

  const metrics: MetricRow[] = [

    {
      label: "Engineering Score",
      accessor: (a) => `${a.engineeringScore}%`,
    },

    {
      label: "Security Score",
      accessor: (a) => `${a.securityScore}%`,
    },

    {
      label: "DevOps Score",
      accessor: (a) => `${a.devopsScore}%`,
    },

    {
      label: "Code Quality",
      accessor: (a) => `${a.codeQuality}%`,
    },

    {
      label: "Documentation",
      accessor: (a) => `${a.documentationQuality}%`,
    },

    {
      label: "Enterprise Readiness",
      accessor: (a) => `${a.enterpriseReadiness}%`,
    },

    {
      label: "Repository Grade",
      accessor: (a) => a.repositoryGrade,
    },

    {
      label: "Risk Level",
      accessor: (a) => a.riskLevel,
    },

    {
      label: "Release Readiness",
      accessor: (a) => `${a.releaseReadiness}%`,
    },

    {
      label: "Production Score",
      accessor: (a) => `${a.productionScore}%`,
    },

  ];

  return (

    <motion.section

      initial={{
        opacity: 0,
        y: 20,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
      }}

      className="
      mt-8
      overflow-hidden
      rounded-3xl
      border
      border-cyan-500/20
      bg-gradient-to-br
      from-zinc-950
      via-zinc-900
      to-black
      backdrop-blur-xl
      "

    >

      <div className="border-b border-white/5 p-6">

        <h2 className="text-2xl font-bold text-white">
          Repository Comparison Matrix
        </h2>

        <p className="mt-2 text-zinc-400">
          Compare engineering metrics across selected repositories.
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full border-collapse">

          <thead>

            <tr className="border-b border-white/5">

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Metric
              </th>

              {repositories.map((repo) => (

                <th
                  key={repo.id}
                  className="px-6 py-4 text-center text-sm font-semibold text-cyan-300"
                >
                  {repo.name}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {metrics.map((metric, index) => (

              <tr

                key={metric.label}

                className={
                  index % 2 === 0
                    ? "bg-white/[0.02]"
                    : ""
                }

              >

                <td className="px-6 py-4 font-medium text-zinc-300">

                  {metric.label}

                </td>

                {repositories.map((repo) => (

                  <td

                    key={repo.id}

                    className="
                    px-6
                    py-4
                    text-center
                    font-semibold
                    text-white
                    "

                  >

                    {metric.accessor(repo.analytics)}

                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </motion.section>

  );

}