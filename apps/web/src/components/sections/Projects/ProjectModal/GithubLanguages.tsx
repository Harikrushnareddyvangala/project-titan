"use client";

import type { GithubLanguages as GithubLanguagesType } from "@/types/github";

interface GithubLanguagesProps {
  languages: GithubLanguagesType;
}

export function GithubLanguages({
  languages,
}: GithubLanguagesProps) {
  const entries = Object.entries(languages);

  if (entries.length === 0) {
    return null;
  }

  const total = entries.reduce(
    (sum, [, value]) => sum + value,
    0,
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <h3 className="mb-8 text-2xl font-bold text-white">
        Languages
      </h3>

      <div className="space-y-6">
        {entries
          .sort((a, b) => b[1] - a[1])
          .map(([language, bytes]) => {
            const percentage =
              (bytes / total) * 100;

            return (
              <div key={language}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">
                    {language}
                  </span>

                  <span className="text-sm text-zinc-400">
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}