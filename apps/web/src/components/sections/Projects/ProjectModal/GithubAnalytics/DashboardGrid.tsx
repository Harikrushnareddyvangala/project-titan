"use client";

import { motion } from "framer-motion";

import { RepositoryOverviewCard } from "./RepositoryOverviewCard";
import { RepositoryScore } from "./RepositoryScore";
import { RepositoryHealthRing } from "./RepositoryHealthRing";

import { GithubLanguageDonut } from "./GithubLanguageDonut";
import { GithubCommitHeatmap } from "./GithubCommitHeatmap";
import { GithubContributorLeaderboard } from "./GithubContributorLeaderboard";
import { GithubActivityTimeline } from "./GithubActivityTimeline";

import type {
  GithubLanguages,
  GithubRepository,
  GithubCommitWeek,
  GithubContributor,
  RepositoryAnalytics,
} from "@/types/github";

import {
  Star,
  GitFork,
  Eye,
  HardDrive,
} from "lucide-react";

import { KpiCard } from "./KpiCard";

interface DashboardGridProps {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
  languages: GithubLanguages;
  commits: GithubCommitWeek[];
  contributors: GithubContributor[];
}

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

export function DashboardGrid({
  repository,
  analytics,
  languages,
  commits,
  contributors,
}: DashboardGridProps) {
  return (
    <motion.div
      className="relative space-y-12"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Background Glow */}

      <motion.div
        className="
          absolute
          -right-32
          top-24
          h-96
          w-96
          rounded-full
          bg-cyan-500/10
          blur-[150px]
          pointer-events-none
        "
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
      />

      {/* Dashboard */}

      <motion.div
        variants={itemVariants}
        className="
          grid
          gap-10
          xl:grid-cols-[1.7fr_0.9fr]
          items-start
        "
      >
        {/* LEFT */}

        <motion.div
          variants={itemVariants}
          className="space-y-8"
        >
          <RepositoryOverviewCard
            repository={repository}
          />

          {/* KPI */}

          <motion.div
            variants={containerVariants}
            className="
              grid
              gap-6
              sm:grid-cols-2
              2xl:grid-cols-4
            "
          >
            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
              }}
            >
              <KpiCard
                title="Stars"
                value={repository.stargazers_count}
                icon={<Star className="text-yellow-400" />}
                color="rgba(250,204,21,.25)"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
              }}
            >
              <KpiCard
                title="Forks"
                value={repository.forks_count}
                icon={<GitFork className="text-cyan-400" />}
                color="rgba(34,211,238,.25)"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
              }}
            >
              <KpiCard
                title="Watchers"
                value={repository.watchers_count}
                icon={<Eye className="text-violet-400" />}
                color="rgba(168,85,247,.25)"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
              }}
            >
              <KpiCard
                title="Repository Size"
                value={Math.round(repository.size / 1024)}
                subtitle="MB"
                icon={<HardDrive className="text-green-400" />}
                color="rgba(34,197,94,.25)"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GithubLanguageDonut
              languages={languages}
            />
          </motion.div>
        </motion.div>

        {/* RIGHT */}

        <motion.div
          variants={itemVariants}
          className="
            sticky
            top-28
            space-y-8
          "
        >
          <motion.div variants={itemVariants}>
            <RepositoryScore
              repository={repository}
              analytics={analytics}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RepositoryHealthRing
              repository={repository}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <GithubActivityTimeline
              repository={repository}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Full Width */}

      <motion.div variants={itemVariants}>
        <GithubCommitHeatmap
          commits={commits}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <GithubContributorLeaderboard
          contributors={contributors}
        />
      </motion.div>

      {/* Bottom Divider */}

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
          h-px
          origin-left
          bg-gradient-to-r
          from-cyan-400
          via-blue-500/40
          to-transparent
        "
      />
    </motion.div>
  );
}