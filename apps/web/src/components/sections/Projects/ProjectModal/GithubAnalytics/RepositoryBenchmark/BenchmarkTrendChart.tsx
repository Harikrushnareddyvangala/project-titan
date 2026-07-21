"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  GitCommitHorizontal,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface BenchmarkTrendChartProps {
  analytics: RepositoryAnalytics;
}

export function BenchmarkTrendChart({
  analytics,
}: BenchmarkTrendChartProps) {

  const milestones = [

    {
      label: "Repository",
      value: analytics.repositoryAge > 365
        ? 70
        : 40,
    },

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
      label: "Enterprise",
      value: analytics.enterpriseReadiness,
    },

    {
      label: "Production",
      value: analytics.productionScore,
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

      transition={{
        duration: .45,
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

      <div className="flex items-center gap-3">

        <GitCommitHorizontal
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h2
            className="
            text-2xl
            font-bold
            text-white
            "
          >
            Engineering Growth Trend
          </h2>

          <p
            className="
            mt-1
            text-zinc-400
            "
          >
            Estimated repository evolution toward enterprise maturity.
          </p>

        </div>

      </div>

      <div
        className="
        relative
        mt-10
        space-y-10
        "
      >

        <div
          className="
          absolute
          left-[18px]
          top-3
          bottom-3
          w-[2px]
          bg-gradient-to-b
          from-cyan-500
          via-violet-500
          to-emerald-500
          "
        />

        {milestones.map((step, index) => (

          <motion.div

            key={step.label}

            initial={{
              opacity: 0,
              x: -20,
            }}

            whileInView={{
              opacity: 1,
              x: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              delay: index * .08,
            }}

            className="
            relative
            flex
            items-start
            gap-6
            "

          >

            <div
              className="
              relative
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-cyan-500/40
              bg-cyan-500/20
              "
            >

              <ArrowUpRight
                size={18}
                className="text-cyan-300"
              />

            </div>

            <div className="flex-1">

              <div className="flex items-center justify-between">

                <h3
                  className="
                  text-lg
                  font-semibold
                  text-white
                  "
                >
                  {step.label}
                </h3>

                <span
                  className="
                  font-bold
                  text-cyan-300
                  "
                >
                  {step.value}%
                </span>

              </div>

              <div
                className="
                mt-3
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
                    width: `${step.value}%`,
                  }}

                  viewport={{
                    once: true,
                  }}

                  transition={{
                    duration: 1,
                    delay: index * .1,
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

          </motion.div>

        ))}

      </div>

    </motion.section>

  );

}