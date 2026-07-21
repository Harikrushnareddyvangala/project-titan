"use client";

import { motion } from "framer-motion";
import {
  Award,
  BrainCircuit,
  Building2,
  Gauge,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface BenchmarkMetricsGridProps {
  analytics: RepositoryAnalytics;
}

export function BenchmarkMetricsGrid({
  analytics,
}: BenchmarkMetricsGridProps) {

  const metrics = [

    {
      title: "Overall Benchmark",
      value: analytics.overallBenchmarkScore,
      suffix: "%",
      icon: Gauge,
      color:
        "text-cyan-400",
    },

    {
      title: "Enterprise Percentile",
      value: analytics.enterprisePercentile,
      suffix: "%",
      icon: Building2,
      color:
        "text-emerald-400",
    },

    {
      title: "Repository Ranking",
      value: analytics.overallRanking,
      suffix: "",
      icon: Award,
      color:
        "text-yellow-400",
    },

    {
      title: "AI Assessment",
      value: analytics.repositoryGrade,
      suffix: "",
      icon: BrainCircuit,
      color:
        "text-violet-400",
    },

  ];

  return (

    <div
      className="
      mt-8
      grid
      gap-6
      md:grid-cols-2
      xl:grid-cols-4
      "
    >

      {metrics.map((metric, index) => {

        const Icon = metric.icon;

        return (

          <motion.div

            key={metric.title}

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
              delay: index * .08,
            }}

            whileHover={{
              y: -6,
              scale: 1.02,
            }}

            className="
            rounded-3xl
            border
            border-white/5
            bg-gradient-to-br
            from-zinc-900/90
            to-black
            p-6
            backdrop-blur-xl
            shadow-lg
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p
                  className="
                  text-xs
                  uppercase
                  tracking-[0.18em]
                  text-zinc-500
                  "
                >
                  {metric.title}
                </p>

                <h2
                  className="
                  mt-5
                  text-5xl
                  font-black
                  text-white
                  "
                >
                  {metric.value}

                  <span
                    className="
                    ml-1
                    text-2xl
                    "
                  >
                    {metric.suffix}
                  </span>

                </h2>

              </div>

              <div
                className="
                rounded-2xl
                border
                border-white/5
                bg-white/[0.03]
                p-4
                "
              >

                <Icon
                  size={30}
                  className={metric.color}
                />

              </div>

            </div>

          </motion.div>

        );

      })}

    </div>

  );

}