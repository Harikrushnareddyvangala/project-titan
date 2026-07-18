"use client";

import { motion } from "framer-motion";

import type { GithubLanguages } from "@/types/github";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  languages: GithubLanguages;
}

const COLORS = [
  "#22d3ee",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

export function GithubLanguageDonut({
  languages,
}: Props) {
  const entries = Object.entries(languages);

  if (!entries.length) return null;

  const total = entries.reduce(
    (sum, [, bytes]) => sum + bytes,
    0,
  );

  const radius = 72;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={containerVariants}
    whileHover={{
        y: -6,
        scale: 1.01,
    }}
      className="
      relative
      overflow-hidden
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >
      <motion.div
    className="
        absolute
        -right-24
        -top-24
        h-72
        w-72
        rounded-full
        bg-cyan-500/10
        blur-[140px]
        pointer-events-none
    "
    animate={{
        scale: [1, 1.15, 1],
        opacity: [0.15, 0.4, 0.15],
    }}
    transition={{
        duration: 10,
        repeat: Infinity,
    }}
/>
<div className="relative z-10">
      <motion.h3
    variants={itemVariants} className="text-xl font-semibold text-white">
        Language Distribution
      </motion.h3>

      <motion.p
    variants={itemVariants} className="mt-2 text-sm text-zinc-400">
        Repository code composition
      </motion.p>

      <motion.div
    variants={itemVariants}
    className="mt-10 flex flex-col items-center gap-10 lg:flex-row"
>

        <div className="relative">

          <motion.svg
    animate={{
        rotate: 360,
    }}
    transition={{
        duration: 90,
        repeat: Infinity,
        ease: "linear",
    }}
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="-rotate-90"
          >
            {entries.map(([language, value], index) => {
              const percent = value / total;

              const length = percent * circumference;

              const circle = (
                <motion.circle
                  key={language}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={stroke}
                  strokeDasharray={`${length} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  initial={{
                    strokeDasharray: `0 ${circumference}`,
                  }}
                  animate={{
                    strokeDasharray: `${length} ${circumference}`,
                  }}
                  transition={{
                    duration: 1,
                    delay: index * 0.15,
                  }}
                />
              );

              offset += length;

              return circle;
            })}
          </motion.svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <p className="text-3xl font-bold text-white">
              <AnimatedCounter
        value={entries.length}
    />
            </p>

            <p className="text-sm text-zinc-400">
              Languages
            </p>

          </div>

        </div>

        <motion.div
    variants={containerVariants}
    className="flex-1 space-y-5"
>

          {entries.map(([language, value], index) => {
            const percent =
              ((value / total) * 100).toFixed(1);

            return (
              <motion.div
    key={language}
    variants={itemVariants}
    whileHover={{
        x: 8,
        scale: 1.02,
    }}
    transition={{
        type: "spring",
        stiffness: 260,
    }}
                className="space-y-2"
              >
                <div className="flex justify-between">

                  <div className="flex items-center gap-3">

                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        background:
                          COLORS[index % COLORS.length],
                      }}
                    />

                    <span className="text-white">
                      {language}
                    </span>

                  </div>

                  <span className="text-zinc-300">
                    {percent}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${percent}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: index * 0.15,
                    }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        COLORS[index % COLORS.length],
                    }}
                  />

                </div>

              </motion.div>
            );
          })}

        </motion.div>

      </motion.div>

      <motion.div
    variants={itemVariants}
    className="mt-8 border-t border-white/10 pt-6"
>

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Total Code Size
          </span>

          <span className="font-semibold text-cyan-300">
            {(total / 1024).toFixed(1)} KB
          </span>

        </div>

      </motion.div>

    <motion.div
    initial={{
        scaleX: 0,
    }}
    whileInView={{
        scaleX: 1,
    }}
    viewport={{
        once: true,
    }}
    transition={{
        duration: 1,
        delay: 0.3,
    }}
    className="
        mt-8
        h-px
        origin-left
        bg-gradient-to-r
        from-cyan-400
        via-blue-500
        to-transparent
    "
/>
</div>
</motion.div>
  );
};