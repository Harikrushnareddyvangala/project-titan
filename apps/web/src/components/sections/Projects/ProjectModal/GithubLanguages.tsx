"use client";

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
          <h3 className="mb-8 text-2xl font-bold text-white">
            Language Analytics
          </h3>

          <p className="mt-2 text-zinc-400">
            Distribution of the repository codebase.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
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
    <div>
      <div className="mb-2 flex justify-between">
        <span className="font-medium text-white">
          {language}
        </span>

        <span className="text-zinc-400">
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}