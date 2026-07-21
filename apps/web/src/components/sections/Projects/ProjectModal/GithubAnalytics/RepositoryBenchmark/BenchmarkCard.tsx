"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { BenchmarkProgressBar } from "./BenchmarkProgressBar";

interface BenchmarkCardProps {
  title: string;
  score: number;
  benchmark: number;
  gap: number;
}

export function BenchmarkCard({
  title,
  score,
  benchmark,
  gap,
}: BenchmarkCardProps) {

  const positive = gap > 0;
  const neutral = gap === 0;

  const gapColor = positive
    ? "text-emerald-400"
    : neutral
      ? "text-yellow-400"
      : "text-red-400";

  const borderColor = positive
    ? "border-emerald-500/30"
    : neutral
      ? "border-yellow-500/30"
      : "border-red-500/30";

  const backgroundGlow = positive
    ? "from-emerald-500/10"
    : neutral
      ? "from-yellow-500/10"
      : "from-red-500/10";

  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        ${borderColor}
        bg-gradient-to-br
        ${backgroundGlow}
        via-zinc-900/90
        to-zinc-950
        p-6
        backdrop-blur-xl
      `}
    >

      <div
        className="
        absolute
        -right-10
        -top-10
        h-32
        w-32
        rounded-full
        bg-cyan-500/10
        blur-3xl
        "
      />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div>

            <p
              className="
              text-sm
              uppercase
              tracking-[0.18em]
              text-zinc-500
              "
            >
              {title}
            </p>

            <h3
              className="
              mt-3
              text-5xl
              font-black
              text-white
              "
            >
              {score}
            </h3>

          </div>

          <div
            className={`
            flex
            items-center
            gap-2
            rounded-full
            border
            px-3
            py-1.5
            ${borderColor}
            bg-black/30
            ${gapColor}
            `}
          >

            {positive && <ArrowUpRight size={18} />}

            {neutral && <Minus size={18} />}

            {!positive && !neutral && (
              <ArrowDownRight size={18} />
            )}

            <span className="font-semibold">

              {gap > 0 ? "+" : ""}

              {gap}

            </span>

          </div>

        </div>

        <div className="mt-8">

          <BenchmarkProgressBar

            score={score}

            benchmark={benchmark}

          />

        </div>

        <div
          className="
          mt-8
          grid
          grid-cols-2
          gap-4
          "
        >

          <div
            className="
            rounded-2xl
            border
            border-white/5
            bg-white/[0.03]
            p-4
            "
          >

            <p
              className="
              text-xs
              uppercase
              tracking-wider
              text-zinc-500
              "
            >
              Repository
            </p>

            <p
              className="
              mt-2
              text-2xl
              font-bold
              text-white
              "
            >
              {score}
            </p>

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

            <p
              className="
              text-xs
              uppercase
              tracking-wider
              text-zinc-500
              "
            >
              Enterprise
            </p>

            <p
              className="
              mt-2
              text-2xl
              font-bold
              text-cyan-300
              "
            >
              {benchmark}
            </p>

          </div>

        </div>

      </div>

    </motion.div>
  );
}