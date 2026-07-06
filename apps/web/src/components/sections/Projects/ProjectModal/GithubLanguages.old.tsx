"use client";

import { motion } from "framer-motion";
import type { GithubLanguages } from "@/types/github";
import { GithubCard } from "./GithubCard";
import {
  Braces,
  Sparkles,
  Trophy,
} from "lucide-react";
const languageColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Java: "#ED8B00",
  C: "#A8B9CC",
  "C++": "#00599C",
  CSharp: "#239120",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Kotlin: "#7F52FF",
  Swift: "#FA7343",
  PHP: "#777BB4",
  HTML: "#E34F26",
  CSS: "#1572B6",
  SCSS: "#CC6699",
  Shell: "#89E051",
  Dockerfile: "#2496ED",
};
interface GithubLanguagesProps {
  languages: GithubLanguages;
}

export function GithubLanguagesCard({
  languages,
}: GithubLanguagesProps) {
  const entries = Object.entries(languages);

  if (entries.length === 0) {
    return null;
  }

  const sortedLanguages =
  [...entries].sort(
    (a, b) => b[1] - a[1],
  );

const totalBytes =
  sortedLanguages.reduce(
    (sum, [, value]) => sum + value,
    0,
  );

  return (
    <GithubCard>
      <div className="mb-10 flex items-center justify-between">

  <div>

    <div className="flex items-center gap-3">

      <Braces
        size={22}
        className="text-cyan-400"
      />

      <h3 className="text-2xl font-bold text-white">
        Language Analytics
      </h3>

    </div>

    <p className="mt-3 text-zinc-400">
      Distribution of technologies powering this repository.
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
    <p className="font-semibold text-cyan-300">
      {entries.length} Languages
    </p>
  </div>

</div>

      <div className="space-y-6">
        {sortedLanguages.map(([language, bytes]) => (
    <LanguageBar
      key={language}
      language={language}
      percentage={(bytes / totalBytes) * 100}
    />
  ))}
      </div>
      <motion.div
  initial={{
    opacity: 0,
    y: 15,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
  }}
  viewport={{
    once: true,
  }}
  className="
    mt-10
    rounded-2xl
    border
    border-white/10
    bg-white/[0.03]
    p-5
  "
>

  <div className="flex items-center gap-4">

    <Trophy
      className="text-yellow-400"
      size={22}
    />

    <div>

      <p className="font-semibold text-white">
        Dominant Language
      </p>

      <p className="mt-1 text-sm text-zinc-400">

        {sortedLanguages[0][0]}

        <span className="mx-2 text-cyan-300 font-semibold">

          {(
            (sortedLanguages[0][1] /
              totalBytes) *
            100
          ).toFixed(1)}
          %

        </span>

        of the repository.

      </p>

    </div>

  </div>

</motion.div>
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
        scale: 1.025,
  y: -4,
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
    shadow-lg
  "
  style={{
    background:
      languageColors[
        language
      ] ??
      "#22d3ee",
  }}
/>

          <span className="font-semibold text-white">
            {language}
          </span>
          <motion.div
  animate={{
    rotate: [0, 15, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
>
  <Sparkles
    size={16}
    className="text-cyan-400"
  />
</motion.div>

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
          style={{
  background:
    languageColors[
      language
    ] ??
    "#22d3ee",
}}
className="
  h-full
  rounded-full
"
        />
      </div>

    </motion.div>
  );
}