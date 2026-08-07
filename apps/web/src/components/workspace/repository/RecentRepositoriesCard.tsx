"use client";

import {
  Clock3,
  History,
} from "lucide-react";

import {
  getRecentRepositories,
} from "@/lib/github/storage";

interface RecentRepositoriesCardProps {
  repositories: string[];
  onSelect: (repository: string) => void;
}

export function RecentRepositoriesCard({
  onSelect,
}: RecentRepositoriesCardProps) {
  const repositories =
    getRecentRepositories();

  if (repositories.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-cyan-400" />

        <h3 className="text-lg font-semibold text-white">
          Recent Repositories
        </h3>
      </div>

      <div className="space-y-2">
        {repositories.map((repository) => (
          <button
            key={repository}
            onClick={() =>
              onSelect(repository)
            }
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              border
              border-white/10
              px-4
              py-3
              text-left
              transition
              hover:border-cyan-400
              hover:bg-cyan-500/5
            "
          >
            <span className="font-medium text-zinc-200">
              {repository}
            </span>

            <Clock3 className="h-4 w-4 text-zinc-500" />
          </button>
        ))}
      </div>
    </div>
  );
}