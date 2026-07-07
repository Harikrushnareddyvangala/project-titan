"use client";

import Image from "next/image";

import { motion } from "framer-motion";

import type {
  GithubContributor,
} from "@/types/github";

interface Props {
  contributors: GithubContributor[];
}

export function GithubContributors({
  contributors,
}: Props) {
  if (!contributors.length) {
    return null;
  }

  const total = contributors.reduce(
    (sum, contributor) =>
      sum + contributor.contributions,
    0,
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
      transition={{
        duration: 0.5,
      }}
      className="
rounded-[30px]
border
border-white/10
bg-white/[0.05]
backdrop-blur-2xl
p-8
space-y-8
"
    >
      <div>

        <h2 className="text-2xl font-bold text-white">
          Top Contributors
        </h2>

        <p className="mt-2 text-zinc-400">
          Repository contribution statistics
        </p>

      </div>

      <div className="space-y-6">

        {contributors.map(
          (contributor, index) => {
            const percentage =
              (
                contributor.contributions /
                total
              ) * 100;

            return (
              <motion.div
                key={contributor.login}
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
                  delay:
                    index * 0.08,
                }}
                className="
rounded-2xl
border
border-white/10
bg-black/20
p-5
"
              >
                <div className="flex items-center gap-4">

                  <Image
                    src={
                      contributor.avatar_url
                    }
                    alt={
                      contributor.login
                    }
                    width={52}
                    height={52}
                    className="rounded-full border border-white/10"
                  />

                  <div className="flex-1">

                    <div className="flex items-center justify-between">

                      <h3 className="font-semibold text-white">
                        {
                          contributor.login
                        }
                      </h3>

                      <span className="text-sm text-cyan-300">
                        {
                          contributor.contributions
                        }{" "}
                        commits
                      </span>

                    </div>

                    <div
                      className="
mt-3
h-3
overflow-hidden
rounded-full
bg-white/10
"
                    >
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        whileInView={{
                          width: `${percentage}%`,
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
from-cyan-500
to-blue-500
"
                      />
                    </div>

                    <div className="mt-2 text-xs text-zinc-400">

                      {percentage.toFixed(
                        1,
                      )}
                      % of repository
                      contributions

                    </div>

                  </div>

                </div>

              </motion.div>
            );
          },
        )}

      </div>

    </motion.section>
  );
}