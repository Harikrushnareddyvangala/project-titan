"use client";

import type {
  RecruiterIntelligence as RecruiterIntelligenceData,
} from "@/types/github";

import { RecruiterMetricCard } from "./RecruiterMetricCard";

interface RecruiterIntelligenceProps {
  recruiterIntelligence: RecruiterIntelligenceData;
}

export function RecruiterIntelligence({
  recruiterIntelligence,
}: RecruiterIntelligenceProps) {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Recruiter Intelligence
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Hiring Assessment
        </h2>

        <p className="mt-3 max-w-3xl text-zinc-400">
          A recruiter-focused assessment of engineering
          capability, hiring potential, seniority, confidence,
          compensation range, and recommended roles.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RecruiterMetricCard
          label="Hiring Score"
          value={recruiterIntelligence.hiringScore}
          description="Overall hiring suitability score."
        />

        <RecruiterMetricCard
          label="Engineering Level"
          value={recruiterIntelligence.engineeringLevel}
          description="Estimated engineering seniority."
        />

        <RecruiterMetricCard
          label="Hiring Confidence"
          value={recruiterIntelligence.hiringConfidence}
          description="Confidence in the hiring assessment."
        />

        <RecruiterMetricCard
          label="Salary Range"
          value={recruiterIntelligence.salaryRange}
          description="Estimated compensation range."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Recruiter Verdict
          </p>

          <p className="mt-4 text-lg leading-8 text-zinc-300">
            {recruiterIntelligence.recruiterVerdict}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Recommended Roles
          </p>

          {recruiterIntelligence.recommendedRoles.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {recruiterIntelligence.recommendedRoles.map(
                (role) => (
                  <span
                    key={role}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300"
                  >
                    {role}
                  </span>
                ),
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              No recommended roles available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}