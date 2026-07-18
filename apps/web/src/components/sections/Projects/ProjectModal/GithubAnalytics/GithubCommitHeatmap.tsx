"use client";

import { motion } from "framer-motion";
import type { GithubCommitWeek } from "@/types/github";

interface Props {
  commits: GithubCommitWeek[];
}

const COLORS = [
  "bg-zinc-800",
  "bg-cyan-900",
  "bg-cyan-700",
  "bg-cyan-500",
  "bg-cyan-300",
];
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  show: {
    opacity: 1,
    scale: 1,
  },
};

export function GithubCommitHeatmap({
  commits,
}: Props) {
  if (!commits.length) {
    return (
      <div
        className="
        rounded-[32px]
        border
        border-white/10
        bg-white/[0.04]
        p-8
        text-center
        "
      >
        <h3 className="text-xl font-semibold text-white">
          Commit Activity
        </h3>

        <p className="mt-8 text-zinc-400">
          No commit statistics are available for this repository.
        </p>
      </div>
    );
  }

  const total = commits.reduce(
    (sum, week) => sum + week.total,
    0,
  );

  const maxWeek = Math.max(
    ...commits.map((w) => w.total),
  );

  const busiest =
    commits.find(
      (w) => w.total === maxWeek,
    ) ?? commits[0];

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
      <motion.div
  variants={itemVariants}
  className="flex items-center justify-between"
>

        <div>
          <h3 className="text-xl font-semibold text-white">
            Commit Heatmap
          </h3>

          <p className="mt-2 text-zinc-400">
            Weekly repository activity
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-cyan-300">
            {total}
          </p>

          <p className="text-sm text-zinc-400">
            Total Commits
          </p>
        </div>

      </motion.div>

      <motion.div
  variants={containerVariants}
  className="mt-10 flex gap-2 overflow-x-auto pb-2"
>

        {commits.map((week, weekIndex) => (
          <motion.div
    key={week.week}
    variants={itemVariants}
    className="flex flex-col gap-2"
>
            {week.days.map(
              (count, dayIndex) => {
                const intensity =
                  count === 0
                    ? 0
                    : Math.min(
                        4,
                        Math.ceil(
                          (count /
                            Math.max(
                              maxWeek / 7,
                              1,
                            )) *
                            4,
                        ),
                      );

                return (
                  <motion.div
    key={dayIndex}
    whileHover={{
        scale: 1.35,
        rotate: 8,
    }}
    whileTap={{
        scale: 0.9,
    }}
                    title={`${count} commits`}
                    className={`
                    h-4
                    w-4
                    rounded
                    transition-all
                    ${COLORS[intensity]}
                    `}
                  />
                );
              },
            )}
          </motion.div>
        ))}

      </motion.div>

      <motion.div
  variants={itemVariants}
  className="mt-10 border-t border-white/10 pt-6"
>

        <div className="grid grid-cols-2 gap-8">

          <div>
            <p className="text-zinc-500">
              Busiest Week
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {maxWeek} commits
            </p>
          </div>

          <div>
            <p className="text-zinc-500">
              Average / Week
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {(total / commits.length).toFixed(1)}
            </p>
          </div>

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
    delay: 0.4,
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
}