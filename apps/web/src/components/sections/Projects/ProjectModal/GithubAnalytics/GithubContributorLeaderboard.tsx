"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import type { GithubContributor } from "@/types/github";

interface Props {
  contributors: GithubContributor[];
}

const medals = ["🥇", "🥈", "🥉"];

export function GithubContributorLeaderboard({
  contributors,
}: Props) {
  if (!contributors.length) {
    return (
      <div
        className="
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.04]
        p-8
        "
      >
        <h3 className="text-xl font-semibold text-white">
          Contributors
        </h3>

        <p className="mt-8 text-center text-zinc-400">
          No contributor statistics available.
        </p>
      </div>
    );
  }

  const total = contributors.reduce(
    (sum, c) => sum + c.contributions,
    0,
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >
      <h3 className="text-xl font-semibold text-white">
        Contributor Leaderboard
      </h3>

      <p className="mt-2 text-zinc-400">
        Top project contributors
      </p>

      <div className="mt-10 space-y-5">

        {contributors.map((contributor, index) => {

          const percent =
            (
              (contributor.contributions / total) *
              100
            ).toFixed(1);

          return (
            <motion.div
              key={contributor.login}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                x: 6,
              }}
              className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-5
              "
            >
              <div className="flex items-center gap-4">

                <div className="w-8 text-center text-2xl">

                  {medals[index] ?? `#${index + 1}`}

                </div>

                <Image
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  width={56}
                  height={56}
                  className="
                  rounded-full
                  border
                  border-cyan-400/20
                  "
                />

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <h4 className="font-semibold text-white">
                      {contributor.login}
                    </h4>

                    <span className="text-cyan-300">
                      {percent}%
                    </span>

                  </div>

                  <div
                    className="
                    mt-3
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-white/5
                    "
                  >
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${percent}%`,
                      }}
                      transition={{
                        duration: 1,
                        delay: index * 0.1,
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

                  <div className="mt-3 flex justify-between text-sm">

                    <span className="text-zinc-400">
                      {contributor.contributions} commits
                    </span>

                    <span className="text-zinc-500">
                      Rank #{index + 1}
                    </span>

                  </div>

                </div>

              </div>

            </motion.div>
          );
        })}

      </div>

    </motion.div>
  );
}