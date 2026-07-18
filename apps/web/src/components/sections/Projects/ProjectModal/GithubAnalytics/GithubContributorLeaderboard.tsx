"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import type { GithubContributor } from "@/types/github";

interface Props {
  contributors: GithubContributor[];
}

const medals = ["🥇", "🥈", "🥉"];
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};  
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
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  variants={containerVariants}
  whileHover={{
    y: -6,
    scale: 1.01,
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
        <motion.div
  className="
    absolute
    -right-24
    -top-24
    h-72
    w-72
    rounded-full
    bg-violet-500/10
    blur-[140px]
    pointer-events-none
  "
  animate={{
    scale: [1, 1.15, 1],
    opacity: [0.15, 0.4, 0.15],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
  }}
/>

<div className="relative z-10">
      <motion.h3
  variants={itemVariants}
  className="text-xl font-semibold text-white">
        Contributor Leaderboard
      </motion.h3>

      <motion.p
  variants={itemVariants}
  className="mt-2 text-zinc-400"
>
        Top project contributors
      </motion.p>

      <motion.div
  variants={containerVariants}
  className="mt-10 space-y-5"
>

        {contributors.map((contributor, index) => {

          const percent =
            (
              (contributor.contributions / total) *
              100
            ).toFixed(1);

          return (
            <motion.div
  key={contributor.login}
  variants={itemVariants}
  whileHover={{
    x: 10,
    scale: 1.02,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
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

                <motion.div
  whileHover={{
    rotate: 8,
    scale: 1.08,
  }}
>
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
</motion.div>

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
                      whileInView={{
  width: `${percent}%`,
}}
viewport={{
  once: true,
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

      </motion.div>
      <motion.div
  initial={{
    scaleX: 0,
  }}
  whileInView={{
    scaleX: 1,
  }}
  viewport={{
    once: true,
  }}
  transition={{
    duration: 1,
    delay: 0.3,
  }}
  className="
    mt-8
    h-px
    origin-left
    bg-gradient-to-r
    from-violet-400
    via-cyan-500
    to-transparent
  "
/>
</div>
    </motion.div>
  );
}