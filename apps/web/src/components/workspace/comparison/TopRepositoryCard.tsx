"use client";

import type { RankedRepository } from "@/types/github";

interface TopRepositoryCardProps {
  repository?: RankedRepository;
}

export function TopRepositoryCard({
  repository,
}: TopRepositoryCardProps) {
  if (!repository) {
    return null;
  }

  return (
    <div className="rounded-[34px] border border-yellow-500/20 bg-yellow-500/5 p-8 backdrop-blur-3xl">
      <h3 className="text-xl font-bold text-yellow-300">
        Top Ranked Repository
      </h3>

      <div className="mt-6">
        <div className="text-3xl font-bold text-white">
          {repository.medal} {repository.repositoryName}
        </div>

        <div className="mt-3 text-zinc-300">
          Overall Score

          <span className="ml-2 font-bold text-cyan-300">
            {repository.overallScore.toFixed(1)}
          </span>
        </div>

        <div className="mt-2 text-zinc-400">
          Grade

          <span className="ml-2 font-semibold text-white">
            {repository.repositoryGrade}
          </span>
        </div>
      </div>
    </div>
  );
}