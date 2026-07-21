"use client";

import { motion } from "framer-motion";
import type { RepositoryAnalytics } from "@/types/github";

interface RepositoryComparisonData {
  id: number;
  name: string;
  analytics: RepositoryAnalytics;
}

interface ComparisonRadarProps {
  repositories: RepositoryComparisonData[];
}

export function ComparisonRadar({
  repositories,
}: ComparisonRadarProps) {

  const categories = [

    {
      label: "Engineering",
      accessor: (a: RepositoryAnalytics) =>
        a.engineeringScore,
    },

    {
      label: "Security",
      accessor: (a: RepositoryAnalytics) =>
        a.securityScore,
    },

    {
      label: "DevOps",
      accessor: (a: RepositoryAnalytics) =>
        a.devopsScore,
    },

    {
      label: "Code Quality",
      accessor: (a: RepositoryAnalytics) =>
        a.codeQuality,
    },

    {
      label: "Documentation",
      accessor: (a: RepositoryAnalytics) =>
        a.documentationQuality,
    },

    {
      label: "Enterprise",
      accessor: (a: RepositoryAnalytics) =>
        a.enterpriseReadiness,
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
      rounded-3xl
      border
      border-cyan-500/20
      bg-gradient-to-br
      from-zinc-950
      via-zinc-900
      to-black
      p-8
      backdrop-blur-xl
      "

    >

      <h2
        className="
        text-2xl
        font-bold
        text-white
        "
      >
        Capability Comparison
      </h2>

      <p
        className="
        mt-2
        text-zinc-400
        "
      >
        Engineering capability across all selected repositories.
      </p>

      <div className="mt-10 space-y-8">

        {categories.map((category) => (

          <div key={category.label}>

            <div className="mb-3">

              <h3
                className="
                text-sm
                uppercase
                tracking-wider
                text-zinc-400
                "
              >
                {category.label}
              </h3>

            </div>

            <div className="space-y-4">

              {repositories.map((repo, index) => (

                <div
                  key={repo.id}
                >

                  <div className="flex justify-between">

                    <span
                      className="
                      text-sm
                      text-zinc-300
                      "
                    >
                      {repo.name}
                    </span>

                    <span
                      className="
                      font-semibold
                      text-cyan-300
                      "
                    >
                      {category.accessor(
                        repo.analytics,
                      )}
                      %
                    </span>

                  </div>

                  <div
                    className="
                    mt-2
                    h-3
                    rounded-full
                    bg-zinc-800
                    overflow-hidden
                    "
                  >

                    <motion.div

                      initial={{
                        width: 0,
                      }}

                      whileInView={{
                        width: `${category.accessor(
                          repo.analytics,
                        )}%`,
                      }}

                      viewport={{
                        once: true,
                      }}

                      transition={{
                        duration: .8,
                        delay:
                          index * .08,
                      }}

                      className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-cyan-400
                      via-blue-500
                      to-violet-500
                      "

                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </motion.section>

  );

}