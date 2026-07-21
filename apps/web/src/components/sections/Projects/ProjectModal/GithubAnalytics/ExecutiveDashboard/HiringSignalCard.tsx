"use client";

import {
  Briefcase,
  Star,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics;
}

export function HiringSignalCard({
  analytics,
}: Props) {

  const signalColor =
    analytics.hiringSignal === "Outstanding"
      ? "text-emerald-400"
      : analytics.hiringSignal === "Excellent"
      ? "text-cyan-400"
      : "text-yellow-400";

  return (

    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="flex items-center gap-3">

        <Briefcase
          size={28}
          className="text-cyan-400"
        />

        <div>

          <h2 className="text-2xl font-bold">
            Hiring Signal
          </h2>

          <p className="text-sm text-zinc-400">
            AI recruiter assessment
          </p>

        </div>

      </div>

      <div className="mt-8">

        <h3
          className={`text-4xl font-bold ${signalColor}`}
        >
          {analytics.hiringSignal}
        </h3>

        <p className="mt-3 text-zinc-400">
          Repository Grade: {analytics.repositoryGrade}
        </p>

      </div>

      <div className="mt-8 flex gap-2">

        {Array.from({ length: 5 }).map((_, index) => (

          <Star
            key={index}
            size={24}
            className={
              index < 5
                ? "fill-yellow-400 text-yellow-400"
                : "text-zinc-700"
            }
          />

        ))}

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <p className="leading-7 text-zinc-300">

          This repository demonstrates
          enterprise engineering practices
          suitable for production-grade
          software development.

        </p>

      </div>

    </section>

  );

}