"use client";

import { motion } from "framer-motion";
import type { RepositoryAnalytics } from "@/types/github";

interface BenchmarkComparisonChartProps {
  analytics: RepositoryAnalytics;
}

interface ComparisonMetric {
  label: string;
  repository: number;
  enterprise: number;
}

export function BenchmarkComparisonChart({
  analytics,
}: BenchmarkComparisonChartProps) {

  const enterpriseBaseline = 85;

  const metrics: ComparisonMetric[] = [

    {
      label: "Engineering",
      repository: analytics.engineeringScore,
      enterprise: enterpriseBaseline,
    },

    {
      label: "Security",
      repository: analytics.securityScore,
      enterprise: enterpriseBaseline,
    },

    {
      label: "DevOps",
      repository: analytics.devopsScore,
      enterprise: enterpriseBaseline,
    },

    {
      label: "Code Quality",
      repository: analytics.codeQuality,
      enterprise: enterpriseBaseline,
    },

    {
      label: "Documentation",
      repository: analytics.documentationQuality,
      enterprise: enterpriseBaseline,
    },

    {
      label: "Enterprise Readiness",
      repository: analytics.enterpriseReadiness,
      enterprise: enterpriseBaseline,
    },

  ];

  return (

    <motion.section

      initial={{
        opacity: 0,
        y: 25,
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

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-white">
          Enterprise Comparison
        </h2>

        <p className="mt-2 text-zinc-400">
          Compare repository performance against enterprise engineering standards.
        </p>

      </div>

      <div className="space-y-8">

        {metrics.map((metric, index) => (

          <div key={metric.label}>

            <div className="mb-3 flex items-center justify-between">

              <span className="font-medium text-zinc-300">

                {metric.label}

              </span>

              <div className="flex gap-6 text-sm">

                <span className="text-cyan-300">

                  Repo {metric.repository}%

                </span>

                <span className="text-zinc-500">

                  Enterprise {metric.enterprise}%

                </span>

              </div>

            </div>

            {/* Repository */}

            <div className="mb-2 h-3 rounded-full bg-zinc-800">

              <motion.div

                initial={{
                  width: 0,
                }}

                whileInView={{
                  width: `${metric.repository}%`,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  duration: 0.9,
                  delay: index * .05,
                }}

                className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                "

              />

            </div>

            {/* Enterprise */}

            <div className="h-2 rounded-full bg-zinc-800">

              <motion.div

                initial={{
                  width: 0,
                }}

                whileInView={{
                  width: `${metric.enterprise}%`,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  duration: 0.9,
                  delay: index * .08,
                }}

                className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-zinc-500
                to-zinc-400
                "

              />

            </div>

          </div>

        ))}

      </div>

    </motion.section>

  );

}