"use client";

import { motion } from "framer-motion";

import type { GithubLanguages } from "@/types/github";

import { LanguageProgress } from "./LanguageProgress";

interface GithubLanguagesProps {
  languages: GithubLanguages;
}

const COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  SQL: "#CC2927",
  HTML: "#E34F26",
  CSS: "#1572B6",
  SCSS: "#CF649A",
  Java: "#B07219",
  C: "#555555",
  "C++": "#F34B7D",
  Shell: "#89E051",
};

export function GithubLanguagesCard({
  languages,
}: GithubLanguagesProps) {
  const entries = Object.entries(languages);

  if (!entries.length) {
    return null;
  }

  const total = entries.reduce(
    (sum, [, bytes]) => sum + bytes,
    0,
  );

  const primary = entries.sort(
    (a, b) => b[1] - a[1],
  )[0];

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
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-3xl
        p-8
        min-h-[360px]
      "
    >
      <div className="mb-8 flex items-center justify-between">

        <div>

          <h3 className="text-2xl font-bold text-white">
            Language Analytics
          </h3>

          <p className="mt-2 text-zinc-400">
            Distribution of source code
          </p>

        </div>

        <div className="text-right">

          <p className="text-sm text-zinc-500">
            Primary Language
          </p>

          <p className="text-lg font-semibold text-cyan-300">
            {primary[0]}
          </p>

        </div>

      </div>

      <div className="space-y-6">

        {entries.map(([language, bytes]) => (
          <LanguageProgress
            key={language}
            language={language}
            value={bytes}
            percentage={(bytes / total) * 100}
            color={
              COLORS[language] ??
              "#06b6d4"
            }
          />
        ))}

      </div>

      <div
        className="
          mt-8
          grid
          gap-4
          rounded-2xl
          border
          border-white/10
          bg-black/20
          p-6
          md:grid-cols-2
        "
      >
        <div>

          <p className="text-sm text-zinc-500">
            Languages
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {entries.length}
          </p>

        </div>

        <div>

          <p className="text-sm text-zinc-500">
            Total Code
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {total.toLocaleString()}
          </p>

        </div>

      </div>

    </motion.section>
  );
}