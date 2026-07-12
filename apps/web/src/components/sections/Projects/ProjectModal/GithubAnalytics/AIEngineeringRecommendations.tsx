"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Lightbulb,
  ShieldCheck,
  GitBranch,
  BookOpen,
  Rocket,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";
import { useRepositoryAnalytics } from "@/hooks/useRepositoryAnalytics";

interface AIEngineeringRecommendationsProps {
  repository: GithubRepository | null;
}

export function AIEngineeringRecommendations({
  repository,
}: AIEngineeringRecommendationsProps) {
  const recommendations: string[] = [];

  const analytics =
  useRepositoryAnalytics(repository);
  if (!repository) return null;

  

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const isInactive =
    new Date(repository.updated_at) < ninetyDaysAgo;

  if (!repository) return null;

  if (repository.open_issues_count > 10) {
    recommendations.push(
      "Reduce open issues to improve maintainability."
    );
  }

  if (repository.watchers_count < 5) {
    recommendations.push(
      "Increase community engagement through documentation and promotion."
    );
  }

  if (repository.forks_count < 3) {
    recommendations.push(
      "Encourage external contributions by improving contribution guidelines."
    );
  }

  if (repository.stargazers_count < 20) {
    recommendations.push(
      "Improve repository visibility with demos, README enhancements and social sharing."
    );
  }

  if (analytics.isInactive) {
  recommendations.push(
    "Repository appears inactive. Consider regular maintenance updates."
  );
}

  if (recommendations.length === 0) {
    recommendations.push(
      "Excellent repository health. Continue maintaining consistent development practices."
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
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
      <div className="flex items-center gap-4">

        <Brain
          className="text-cyan-400"
          size={34}
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Engineering Recommendations
          </h2>

          <p className="mt-1 text-zinc-400">
            Actionable improvements generated from repository analytics.
          </p>

        </div>

      </div>

      <div className="mt-10 space-y-5">

        {recommendations.map((item, index) => (
          <RecommendationCard
            key={index}
            recommendation={item}
            index={index}
          />
        ))}

      </div>

    </motion.section>
  );
}

interface RecommendationCardProps {
  recommendation: string;
  index: number;
}

function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {

  const icons = [
    Lightbulb,
    ShieldCheck,
    GitBranch,
    BookOpen,
    Rocket,
  ];

  const Icon =
    icons[index % icons.length];

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -20,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        delay: index * 0.08,
      }}
      whileHover={{
        scale: 1.02,
      }}
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-5
      "
    >
      <div className="flex gap-4">

        <div className="mt-1 text-cyan-400">

          <Icon size={22} />

        </div>

        <p className="leading-8 text-zinc-300">
          {recommendation}
        </p>

      </div>

    </motion.div>
  );
}