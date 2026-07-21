"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  Award,
  BrainCircuit,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface BenchmarkSummaryProps {
  analytics: RepositoryAnalytics;
}

export function BenchmarkSummary({
  analytics,
}: BenchmarkSummaryProps) {

  return (

    <motion.div

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
      rounded-3xl
      border
      border-cyan-500/20
      bg-gradient-to-br
      from-cyan-500/5
      via-zinc-900/80
      to-zinc-950
      p-8
      backdrop-blur-xl
      "
    >

      <div
        className="
        grid
        gap-6
        lg:grid-cols-4
        "
      >

        {/* Percentile */}

        <div
          className="
          rounded-2xl
          border
          border-white/5
          bg-white/[0.03]
          p-6
          "
        >

          <div className="flex items-center gap-3">

            <Trophy
              className="text-yellow-400"
              size={24}
            />

            <p
              className="
              text-sm
              uppercase
              tracking-wider
              text-zinc-500
              "
            >
              Enterprise Percentile
            </p>

          </div>

          <h2
            className="
            mt-5
            text-5xl
            font-black
            text-white
            "
          >
            {analytics.enterprisePercentile}%
          </h2>

        </div>

        {/* Ranking */}

        <div
          className="
          rounded-2xl
          border
          border-white/5
          bg-white/[0.03]
          p-6
          "
        >

          <div className="flex items-center gap-3">

            <Award
              className="text-cyan-400"
              size={24}
            />

            <p
              className="
              text-sm
              uppercase
              tracking-wider
              text-zinc-500
              "
            >
              Repository Ranking
            </p>

          </div>

          <h2
            className="
            mt-5
            text-3xl
            font-bold
            text-cyan-300
            "
          >
            {analytics.overallRanking}
          </h2>

        </div>

        {/* Overall Benchmark */}

        <div
          className="
          rounded-2xl
          border
          border-white/5
          bg-white/[0.03]
          p-6
          "
        >

          <div className="flex items-center gap-3">

            <TrendingUp
              className="text-emerald-400"
              size={24}
            />

            <p
              className="
              text-sm
              uppercase
              tracking-wider
              text-zinc-500
              "
            >
              Overall Benchmark
            </p>

          </div>

          <h2
            className="
            mt-5
            text-5xl
            font-black
            text-emerald-400
            "
          >
            {analytics.overallBenchmarkScore}
          </h2>

        </div>

        {/* AI */}

        <div
          className="
          rounded-2xl
          border
          border-cyan-500/20
          bg-cyan-500/5
          p-6
          "
        >

          <div className="flex items-center gap-3">

            <BrainCircuit
              className="text-cyan-400"
              size={24}
            />

            <p
              className="
              text-sm
              uppercase
              tracking-wider
              text-zinc-500
              "
            >
              AI Assessment
            </p>

          </div>

          <p
            className="
            mt-5
            text-sm
            leading-7
            text-zinc-300
            "
          >
            {analytics.benchmarkSummary}
          </p>

        </div>

      </div>

    </motion.div>

  );

}