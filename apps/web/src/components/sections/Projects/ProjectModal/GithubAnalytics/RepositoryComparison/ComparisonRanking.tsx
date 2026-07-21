"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  ChevronUp,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface RepositoryComparisonData {
  id: number;
  name: string;
  analytics: RepositoryAnalytics;
}

interface ComparisonRankingProps {
  repositories: RepositoryComparisonData[];
}

export function ComparisonRanking({
  repositories,
}: ComparisonRankingProps) {

  const ranking = [...repositories].sort(

    (a, b) =>

      b.analytics.engineeringScore -

      a.analytics.engineeringScore,

  );

  function RankIcon(rank: number) {

    switch (rank) {

      case 1:

        return (
          <Trophy
            className="text-yellow-400"
            size={22}
          />
        );

      case 2:

        return (
          <Medal
            className="text-zinc-300"
            size={22}
          />
        );

      case 3:

        return (
          <Award
            className="text-orange-400"
            size={22}
          />
        );

      default:

        return (
          <ChevronUp
            className="text-cyan-400"
            size={20}
          />
        );

    }

  }

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
      mt-8
      rounded-3xl
      border
      border-cyan-500/20
      bg-gradient-to-br
      from-zinc-950
      via-zinc-900
      to-black
      p-8
      backdrop-blur-xl
      "

    >

      <h2

        className="
        text-2xl
        font-bold
        text-white
        "

      >

        Engineering Leaderboard

      </h2>

      <p

        className="
        mt-2
        text-zinc-400
        "

      >

        Repository ranking based on engineering excellence.

      </p>

      <div className="mt-10 space-y-5">

        {ranking.map((repo, index) => (

          <motion.div

            key={repo.id}

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
              delay: index * .08,
            }}

            className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-white/5
            bg-white/[0.03]
            px-6
            py-5
            "

          >

            <div className="flex items-center gap-4">

              {RankIcon(index + 1)}

              <div>

                <h3

                  className="
                  font-semibold
                  text-white
                  "

                >

                  #{index + 1} {repo.name}

                </h3>

                <p

                  className="
                  mt-1
                  text-sm
                  text-zinc-500
                  "

                >

                  Grade {repo.analytics.repositoryGrade}

                </p>

              </div>

            </div>

            <div className="text-right">

              <h2

                className="
                text-3xl
                font-black
                text-cyan-300
                "

              >

                {repo.analytics.engineeringScore}

              </h2>

              <p

                className="
                text-xs
                uppercase
                tracking-wider
                text-zinc-500
                "

              >

                Engineering

              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </motion.section>

  );

}