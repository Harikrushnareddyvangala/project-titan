"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repositories: RepositoryAnalytics[];
}

export function RepositoryLeaderboard({
  repositories,
}: Props) {

  const sortedRepositories =
    [...repositories].sort(
      (a, b) =>
        b.engineeringScore -
        a.engineeringScore,
    );

  return (
    <motion.section
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
      className="
      rounded-[32px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >

      <div className="flex items-center gap-3">

        <Trophy
          className="text-yellow-400"
          size={28}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">

            Repository Leaderboard

          </h3>

          <p className="text-zinc-400">

            Engineering ranking

          </p>

        </div>

      </div>

      <div className="mt-8 overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-white/10">

              <th className="py-3 text-left text-zinc-400">
                Rank
              </th>

              <th className="py-3 text-left text-zinc-400">
                Repository
              </th>

              <th className="py-3 text-center text-zinc-400">
                Engineering
              </th>

              <th className="py-3 text-center text-zinc-400">
                Production
              </th>

              <th className="py-3 text-center text-zinc-400">
                Health
              </th>

              <th className="py-3 text-center text-zinc-400">
                Grade
              </th>

            </tr>

          </thead>

          <tbody>

            {sortedRepositories.map(
              (repository, index) => (

                <tr
                  key={
                    repository.repositoryFullName
                  }
                  className="
                  border-b
                  border-white/5
                  hover:bg-white/[0.03]
                  "
                >

                  <td className="py-5">

                    {index + 1}

                  </td>

                  <td className="py-5 font-semibold text-white">

                    {repository.repositoryName}

                  </td>

                  <td className="py-5 text-center">

                    {repository.engineeringScore}

                  </td>

                  <td className="py-5 text-center">

                    {repository.productionScore}

                  </td>

                  <td className="py-5 text-center">

                    {repository.healthScore}

                  </td>

                  <td className="py-5 text-center">

                    {repository.repositoryGrade}

                  </td>

                </tr>

              ),
            )}

          </tbody>

        </table>

      </div>

    </motion.section>
  );

}