"use client";

import { motion } from "framer-motion";

import type { GithubCommitWeek } from "@/types/github";

interface Props {
  commits?: GithubCommitWeek[];
}

export function GithubCommitActivity({
  commits = [],
}: Props) {
  if (commits.length === 0) {
    return (
      <section
        className="
        relative
        overflow-hidden
rounded-[34px]
border
border-white/10
bg-white/[0.05]
backdrop-blur-3xl
p-8
"
      >
        <h3 className="text-2xl font-bold text-white">
          Commit Activity
        </h3>

        <p className="mt-4 text-zinc-400">
          GitHub is still generating commit statistics.
          Refresh in a few moments.
        </p>
      </section>
    );
  }

  const recent = commits.slice(-20);

  const max = Math.max(
    ...recent.map((c) => c.total),
    1,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
      relative
      overflow-hidden
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.05]
      backdrop-blur-3xl
      p-8
    "
    >
      <h3 className="text-2xl font-bold text-white">
        Commit Activity
      </h3>

      <p className="mt-2 text-zinc-400">
        Last 20 Weeks
      </p>

      <div className="mt-10 flex h-64 items-end gap-2">
        {recent.map((week) => (
          <motion.div
            key={week.week}
            initial={{ height: 0 }}
            whileInView={{
              height: `${(week.total / max) * 100}%`,
            }}
            transition={{ duration: 0.8 }}
            className="
flex-1
rounded-t-xl
bg-gradient-to-t
from-cyan-500
to-blue-500
"
            title={`${week.total} commits`}
          />
        ))}
      </div>
    </motion.section>
  );
}