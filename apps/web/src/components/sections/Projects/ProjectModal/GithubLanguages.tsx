"use client";

import { motion } from "framer-motion";
import type { GithubLanguages } from "@/types/github";
import { GithubCard } from "./GithubCard";

interface GithubLanguagesProps {
  languages: GithubLanguages;
}

export function GithubLanguages({
  languages,
}: GithubLanguagesProps) {
  const entries = Object.entries(languages);

  if (entries.length === 0) {
    return null;
  }

  const totalBytes = entries.reduce(
    (sum, [, value]) => sum + value,
    0,
  );

  return (
    <GithubCard>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">
            Language Analytics
          </h3>

          <p className="mt-2 text-zinc-400">
            Distribution of the repository codebase.
          </p>
        </div>

        <div
  className="
rounded-2xl
border
border-cyan-500/20
bg-cyan-500/10
px-5
py-3
backdrop-blur-xl
"
>
          <p className="text-sm text-cyan-300">
            {entries.length} Languages
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {entries
          .sort((a, b) => b[1] - a[1])
          .map(([language, bytes]) => {
            const percentage =
              (bytes / totalBytes) * 100;

            return (
              <LanguageBar
                key={language}
                language={language}
                percentage={percentage}
              />
            );
          })}
      </div>
    </GithubCard>
  );
}

interface LanguageBarProps {
  language: string;
  percentage: number;
}

function LanguageBar({
  language,
  percentage,
}: LanguageBarProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -25,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
      }}
      whileHover={{
        scale: 1.02,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
group
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-4
transition-all
duration-300
hover:border-cyan-400/40
hover:bg-cyan-500/5
"
    >
      <div className="mb-3 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className="
h-3
w-3
rounded-full
bg-cyan-400
shadow-[0_0_12px_#22d3ee]
"
          />

          <span className="font-semibold text-white">
            {language}
          </span>

        </div>

        <span className="font-medium text-cyan-300">
          {percentage.toFixed(1)}%
        </span>

      </div>

      <div
        className="
h-3
overflow-hidden
rounded-full
bg-zinc-800
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
            ease: "easeOut",
          }}
          className="
h-full
rounded-full
bg-gradient-to-r
from-cyan-400
via-sky-400
to-blue-500
"
        />
      </div>

    </motion.div>
  );
}