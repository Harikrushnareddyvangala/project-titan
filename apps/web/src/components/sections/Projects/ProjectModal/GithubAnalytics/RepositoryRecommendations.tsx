"use client";

import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2 } from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface Props {
  repository: GithubRepository;
}

export function RepositoryRecommendations({
  repository,
}: Props) {

  const recommendations: string[] = [];

  if (!repository.license) {
    recommendations.push("Add an open-source license.");
  }

  if (repository.open_issues_count > 10) {
    recommendations.push(
      "Resolve stale GitHub issues."
    );
  }

  if (repository.watchers_count < 5) {
    recommendations.push(
      "Improve project visibility using documentation."
    );
  }

  if (repository.stargazers_count < 10) {
    recommendations.push(
      "Promote repository to increase community adoption."
    );
  }

  if (!repository.homepage) {
    recommendations.push(
      "Deploy a live demo and configure repository homepage."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Repository follows excellent engineering practices."
    );
  }

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
      <div className="flex items-center gap-3 mb-8">

        <Lightbulb
          className="text-yellow-400"
          size={28}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            AI Recommendations
          </h3>

          <p className="text-zinc-400 mt-1">
            Suggested improvements based on repository metrics.
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {recommendations.map((item) => (
          <motion.div
            key={item}
            whileHover={{ x: 8 }}
            className="
            flex
            items-start
            gap-4
            rounded-2xl
            border
            border-white/5
            bg-white/[0.02]
            p-5
            "
          >
            <CheckCircle2
              className="text-cyan-400 mt-1"
              size={18}
            />

            <span className="text-zinc-300 leading-7">
              {item}
            </span>

          </motion.div>
        ))}

      </div>

    </motion.section>
  );
}