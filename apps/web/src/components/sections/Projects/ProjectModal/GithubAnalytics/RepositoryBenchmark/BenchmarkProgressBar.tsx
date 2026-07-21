"use client";

import { motion } from "framer-motion";

interface BenchmarkProgressBarProps {

  score: number;

  benchmark: number;

}

export function BenchmarkProgressBar({

  score,

  benchmark,

}: BenchmarkProgressBarProps) {

  const repositoryWidth = Math.min(
    Math.max(score, 0),
    100,
  );

  const benchmarkWidth = Math.min(
    Math.max(benchmark, 0),
    100,
  );

  const repositoryColor =
    score >= benchmark
      ? "from-emerald-400 to-cyan-400"
      : "from-orange-400 to-red-400";

  return (

    <div className="space-y-6">

      {/* Repository Score */}

      <div>

        <div className="mb-2 flex items-center justify-between">

          <span
            className="
            text-sm
            font-medium
            text-zinc-300
            "
          >
            Repository
          </span>

          <span
            className="
            text-sm
            font-semibold
            text-white
            "
          >
            {score}%
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
              width: `${repositoryWidth}%`,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 1,
              ease: "easeOut",
            }}

            className={`
              h-full
              rounded-full
              bg-gradient-to-r
              ${repositoryColor}
            `}
          />

        </div>

      </div>

      {/* Enterprise Baseline */}

      <div>

        <div className="mb-2 flex items-center justify-between">

          <span
            className="
            text-sm
            font-medium
            text-zinc-400
            "
          >
            Enterprise Baseline
          </span>

          <span
            className="
            text-sm
            font-semibold
            text-cyan-300
            "
          >
            {benchmark}%
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
              width: `${benchmarkWidth}%`,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 1,
              delay: 0.15,
              ease: "easeOut",
            }}

            className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-cyan-500
            to-blue-500
            "
          />

        </div>

      </div>

      {/* Difference Indicator */}

      <div
        className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-white/5
        bg-white/[0.03]
        px-4
        py-3
        "
      >

        <span
          className="
          text-xs
          uppercase
          tracking-wider
          text-zinc-500
          "
        >
          Performance Difference
        </span>

        <span
          className={`
            text-sm
            font-bold

            ${
              score >= benchmark

                ? "text-emerald-400"

                : "text-orange-400"

            }
          `}
        >

          {score >= benchmark
            ? "+"
            : ""}

          {score - benchmark}%

        </span>

      </div>

    </div>

  );

}