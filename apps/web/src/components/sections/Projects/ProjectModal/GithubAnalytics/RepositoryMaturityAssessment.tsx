"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  ShieldCheck,
  Rocket,
  Brain,
} from "lucide-react";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
}

interface Category {
  title: string;
  score: number;
}

export function RepositoryMaturityAssessment({
  repository,
  analytics,
}: Props) {

  const engineering =
    analytics?.engineeringScore ?? 0;

  const production =
    analytics?.productionScore ?? 0;

  const health =
    analytics?.healthScore ?? 0;

  const documentation =
    repository.description ? 92 : 60;

  const collaboration =
    Math.min(
      100,
      repository.watchers_count * 8 +
      repository.forks_count * 5,
    );

  const testing =
    Math.min(
      100,
      engineering * 0.9,
    );

  const security =
    Math.min(
      100,
      health * 0.95,
    );

  const categories: Category[] = [
    {
      title: "Engineering",
      score: engineering,
    },
    {
      title: "Documentation",
      score: documentation,
    },
    {
      title: "Testing",
      score: testing,
    },
    {
      title: "Security",
      score: security,
    },
    {
      title: "Production",
      score: production,
    },
    {
      title: "Collaboration",
      score: collaboration,
    },
  ];

  const maturity =
    Math.round(
      categories.reduce(
        (sum, c) => sum + c.score,
        0,
      ) / categories.length,
    );

  const level =
    maturity >= 95
      ? "Enterprise"
      : maturity >= 85
      ? "Production"
      : maturity >= 70
      ? "Professional"
      : maturity >= 55
      ? "Growing"
      : "Prototype";

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
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >

      <div className="flex items-center gap-3">

        <Trophy
          size={28}
          className="text-yellow-400"
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            Repository Maturity Model
          </h3>

          <p className="text-zinc-400">
            Enterprise engineering maturity assessment
          </p>

        </div>

      </div>

      <div className="mt-10 space-y-6">

        {categories.map((item) => (

          <div key={item.title}>

            <div className="mb-2 flex justify-between">

              <span className="text-white">
                {item.title}
              </span>

              <span className="text-cyan-300">
                {item.score}%
              </span>

            </div>

            <div className="h-3 rounded-full bg-white/10">

              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: `${item.score}%`,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1,
                }}
                className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                "
              />

            </div>

          </div>

        ))}

      </div>

      <motion.div
        whileHover={{
          scale: 1.01,
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

        <div className="flex items-center gap-3">

          <Brain className="text-cyan-400"/>

          <h4 className="text-lg font-semibold text-white">
            AI Maturity Verdict
          </h4>

        </div>

        <p className="mt-5 leading-8 text-zinc-300">

          Overall repository maturity:

          <span className="ml-2 font-bold text-cyan-300">
            {maturity}/100
          </span>

          <br /><br />

          Classification:

          <span className="ml-2 font-bold text-cyan-300">
            {level}
          </span>

          <br /><br />

          TITAN estimates this project is suitable for
          <span className="ml-2 font-semibold text-white">
            {level === "Enterprise"
              ? "large-scale enterprise deployment."
              : level === "Production"
              ? "production deployment."
              : level === "Professional"
              ? "professional software portfolios."
              : "continued engineering improvements."}
          </span>

        </p>

      </motion.div>

    </motion.section>
  );
}