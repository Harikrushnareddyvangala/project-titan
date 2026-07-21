"use client";

import { motion } from "framer-motion";
import type { RepositoryAnalytics } from "@/types/github";

interface BenchmarkRadarChartProps {
  analytics: RepositoryAnalytics;
}

export function BenchmarkRadarChart({
  analytics,
}: BenchmarkRadarChartProps) {

  const metrics = [

    {
      label: "Engineering",
      value: analytics.engineeringScore,
    },

    {
      label: "Security",
      value: analytics.securityScore,
    },

    {
      label: "DevOps",
      value: analytics.devopsScore,
    },

    {
      label: "Code",
      value: analytics.codeQuality,
    },

    {
      label: "Docs",
      value: analytics.documentationQuality,
    },

    {
      label: "Enterprise",
      value: analytics.enterpriseReadiness,
    },

  ];

  return (

    <motion.div

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

        <h2
          className="
          text-2xl
          font-bold
          text-white
          "
        >
          Engineering Capability Matrix
        </h2>

        <p
          className="
          mt-2
          text-zinc-400
          "
        >
          Repository capability compared across core enterprise engineering domains.
        </p>

      </div>

      <div className="space-y-7">

        {metrics.map((metric) => (

          <div
            key={metric.label}
          >

            <div className="mb-2 flex items-center justify-between">

              <span
                className="
                font-medium
                text-zinc-300
                "
              >
                {metric.label}
              </span>

              <span
                className="
                font-semibold
                text-cyan-300
                "
              >
                {metric.value}%
              </span>

            </div>

            <div
              className="
              h-3
              overflow-hidden
              rounded-full
              bg-zinc-800
              "
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                whileInView={{
                  width: `${metric.value}%`,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  duration: 0.9,
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

    </motion.div>

  );

}