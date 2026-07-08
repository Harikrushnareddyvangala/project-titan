"use client";

import { motion } from "framer-motion";
import { Award, BrainCircuit } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

import type { GithubRepository } from "@/types/github";
import { AnimatedCounter } from "./AnimatedCounter";

interface RepositoryScoreProps {
  repository: GithubRepository;
}

function calculateScore(
  repository: GithubRepository,
) {
  let score = 50;

  // Community

  score += Math.min(
    repository.stargazers_count / 10,
    15,
  );

  score += Math.min(
    repository.forks_count / 5,
    10,
  );

  score += Math.min(
    repository.watchers_count / 8,
    8,
  );

  // Maintenance

  const updated =
    new Date(repository.updated_at);

  const days =
    (Date.now() -
      updated.getTime()) /
    (1000 * 60 * 60 * 24);

  if (days < 30) score += 10;
  else if (days < 90) score += 5;

  // Open Issues

  score -= Math.min(
    repository.open_issues_count,
    10,
  );

  return Math.max(
    0,
    Math.min(
      Math.round(score),
      100,
    ),
  );
}

function getGrade(score: number) {
  if (score >= 95)
    return "A+";

  if (score >= 90)
    return "A";

  if (score >= 80)
    return "B";

  if (score >= 70)
    return "C";

  return "D";
}

function getDescription(score: number) {
  if (score >= 90)
    return "Outstanding repository health";

  if (score >= 80)
    return "Well maintained project";

  if (score >= 70)
    return "Healthy repository";

  return "Needs improvements";
}

export function RepositoryScore({
  repository,
}: RepositoryScoreProps) {
  const score =
    calculateScore(repository);

  const grade =
    getGrade(score);

  const description =
    getDescription(score);
  
  const communityScore = Math.min(
  100,
  Math.round(
    repository.stargazers_count * 2 +
    repository.forks_count * 3
  )
);

const maintenanceScore =
Math.max(
  40,
  100 -
  repository.open_issues_count * 4
);

const popularityScore =
Math.min(
  100,
  Math.round(
    repository.watchers_count * 4 +
    repository.stargazers_count
  )
);

  return (
    <motion.div
      whileHover={{
        y:-8,
scale:1.015,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
      }}
      className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-3xl
        p-6
        lg:p-8
        min-h-[280px]
      "
    >
      <motion.div
        className="
          absolute
          -right-24
          -top-24
          h-60
          w-60
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-400/20
              bg-cyan-500/10
            "
          >
            <Award
              size={22}
              className="text-cyan-300"
            />
          </div>

          <div>

            <h3 className="text-lg font-semibold text-white">
              Repository Score
            </h3>

            <p className="text-sm text-zinc-400">
              Machine Learning Repository Evaluation
            </p>

          </div>

        </div>

        <div className="mt-10">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="flex items-end gap-3">

              <span className="text-6xl font-bold text-white">
                <AnimatedCounter
    value={score}
/>
              </span>

              <span className="mb-2 text-zinc-400">
                /100
              </span>

            </div>

            <div
              className="
                mt-5
                inline-flex
                rounded-full
                border
                border-emerald-400/20
                bg-emerald-500/10
                px-4
                py-2
                text-sm
                font-semibold
                text-emerald-300
              "
            >
              ★★★★★ {grade}
            </div>

            <div className="mt-8 space-y-6">

  <div
    className="
    rounded-2xl
    border
    border-cyan-400/20
    bg-cyan-500/5
    p-5
    "
  >

    <div className="flex items-center gap-3">

      <BrainCircuit
        className="text-cyan-400"
        size={20}
      />

      <span
        className="
        font-semibold
        text-cyan-300
        "
      >
        AI Assessment
      </span>

    </div>

    <p
      className="
      mt-4
      leading-7
      text-zinc-300
      "
    >
      {description}
    </p>

  </div>

  <ProgressBar
    title="Community"
    value={communityScore}
  />

  <ProgressBar
    title="Maintenance"
    value={maintenanceScore}
  />

  <ProgressBar
    title="Popularity"
    value={popularityScore}
  />

</div>

          </motion.div>

        </div>

      </div>

    </motion.div>
  );
}