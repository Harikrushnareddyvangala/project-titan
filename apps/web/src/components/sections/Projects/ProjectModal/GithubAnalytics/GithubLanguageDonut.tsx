"use client";

import { motion } from "framer-motion";

import type { GithubLanguages } from "@/types/github";

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
      whileHover={{
        y: -6,
      }}
      className="
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >
      <h3 className="text-xl font-semibold text-white">
        Language Distribution
      </h3>

      <p className="mt-2 text-sm text-zinc-400">
        Repository code composition
      </p>

      <div className="mt-10 flex flex-col items-center gap-10 lg:flex-row">

        <div className="relative">

          <svg
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
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <p className="text-3xl font-bold text-white">
              {entries.length}
            </p>

            <p className="text-sm text-zinc-400">
              Languages
            </p>

          </div>

        </div>

        <div className="flex-1 space-y-5">

          {entries.map(([language, value], index) => {
            const percent =
              ((value / total) * 100).toFixed(1);

            return (
              <motion.div
                key={language}
                whileHover={{
                  x: 6,
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

        </div>

      </div>

      <div className="mt-8 border-t border-white/10 pt-6">

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Total Code Size
          </span>

          <span className="font-semibold text-cyan-300">
            {(total / 1024).toFixed(1)} KB
          </span>

        </div>

      </div>

    </motion.div>
  );
}