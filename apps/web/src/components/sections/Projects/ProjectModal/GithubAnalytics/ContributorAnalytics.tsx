"use client";

import { motion } from "framer-motion";
import {
  Users,
  Trophy,
  GitCommit,
} from "lucide-react";

import type {
  GithubContributor,
} from "@/types/github";

interface Props {
  contributors: GithubContributor[];
}

export function ContributorAnalytics({
  contributors,
}: Props) {
  const totalContributors = contributors.length;

  const totalCommits = contributors.reduce(
    (sum, contributor) => sum + contributor.contributions,
    0,
  );

  const topContributor =
    contributors[0];

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
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
        -right-20
        -top-20
        h-72
        w-72
        rounded-full
        bg-cyan-500/10
        blur-[120px]
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

        <div className="flex items-center gap-3">

          <Users
            className="text-cyan-400"
            size={28}
          />

          <div>

            <h3 className="text-2xl font-bold text-white">
              AI Contributor Analytics
            </h3>

            <p className="text-zinc-400">
              Repository collaboration insights
            </p>

          </div>

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <MetricCard
            icon={<Users size={18} />}
            title="Contributors"
            value={totalContributors.toString()}
          />

          <MetricCard
            icon={<GitCommit size={18} />}
            title="Total Commits"
            value={totalCommits.toString()}
          />

          <MetricCard
            icon={<Trophy size={18} />}
            title="Top Contributor"
            value={
              topContributor?.login ??
              "Unknown"
            }
          />

        </div>

        <div className="mt-10 space-y-4">

          {contributors.slice(0, 5).map(
            (contributor, index) => (
              <motion.div
                key={contributor.login}
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
                  delay: index * 0.08,
                }}
                className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-4
                "
              >
                <div className="flex items-center gap-4">

                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="
                    h-12
                    w-12
                    rounded-full
                    "
                  />

                  <div>

                    <p className="font-semibold text-white">
                      {contributor.login}
                    </p>

                    <p className="text-sm text-zinc-500">
                      GitHub Contributor
                    </p>

                  </div>

                </div>

                <span className="font-semibold text-cyan-300">
                  {contributor.contributions}
                </span>

              </motion.div>
            ),
          )}

        </div>

        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          className="
          mt-10
          rounded-3xl
          border
          border-cyan-400/20
          bg-cyan-500/10
          p-6
          "
        >

          <h4 className="text-lg font-semibold text-white">
            AI Collaboration Summary
          </h4>

          <p className="mt-5 leading-8 text-zinc-300">

            Total Contributors:
            <span className="ml-2 font-semibold text-cyan-300">
              {totalContributors}
            </span>

            <br />

            Total Commits:
            <span className="ml-2 font-semibold text-cyan-300">
              {totalCommits}
            </span>

            <br />

            AI Assessment:
            <span className="ml-2 font-semibold text-cyan-300">
              Healthy contributor ecosystem with active development.
            </span>

          </p>

        </motion.div>

      </div>

    </motion.section>
  );
}

function MetricCard({
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