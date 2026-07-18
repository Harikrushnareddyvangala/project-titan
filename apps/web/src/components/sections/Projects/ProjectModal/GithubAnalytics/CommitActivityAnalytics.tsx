"use client";

import { motion } from "framer-motion";
import { GitCommit, TrendingUp } from "lucide-react";

import type { GithubCommitWeek } from "@/types/github";

interface Props {
  commits: GithubCommitWeek[];
}

export function CommitActivityAnalytics({
  commits,
}: Props) {
  const recent = commits.slice(-12);

  const maxCommits = Math.max(
    ...recent.map((week) => week.total),
    1,
  );

  const totalCommits = recent.reduce(
    (sum, week) => sum + week.total,
    0,
  );

  const average = Math.round(
    totalCommits / Math.max(recent.length, 1),
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >
      <div className="flex items-center gap-3">

        <GitCommit
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            AI Commit Activity
          </h3>

          <p className="text-zinc-400">
            Development velocity over time
          </p>

        </div>

      </div>

      <div className="mt-10 flex items-end gap-2 h-64">

        {recent.map((week, index) => {

          const height =
            (week.total / maxCommits) * 100;

          return (

            <motion.div
              key={week.week}
              className="flex-1"
              initial={{
                height: 0,
              }}
              whileInView={{
                height: `${height}%`,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.05,
                duration: 0.8,
              }}
            >

              <div
                className="
                w-full
                rounded-t-xl
                bg-gradient-to-t
                from-cyan-500
                to-blue-500
                "
                style={{
                  height: "100%",
                }}
              />

            </motion.div>

          );

        })}

      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-6">

        <SummaryCard
          icon={<GitCommit size={18} />}
          title="Recent Commits"
          value={totalCommits.toString()}
        />

        <SummaryCard
          icon={<TrendingUp size={18} />}
          title="Average / Week"
          value={average.toString()}
        />

      </div>

    </motion.section>
  );
}

function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {

  return (

    <div
      className="
      rounded-2xl
      border
      border-white/10
      bg-white/[0.04]
      p-5
      "
    >

      <div className="text-cyan-400">
        {icon}
      </div>

      <p className="mt-3 text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

    </div>

  );

}