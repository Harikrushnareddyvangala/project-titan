"use client";

import type { RecruiterIntelligence } from "@/types/github";

import {
  Briefcase,
  DollarSign,
  BadgeCheck,
  Users,
  Award,
} from "lucide-react";

interface RecruiterDashboardProps {
  recruiter: RecruiterIntelligence;
}

export function RecruiterDashboard({
  recruiter,
}: RecruiterDashboardProps) {
  return (
    <section className="space-y-8">

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">

        <h2 className="text-3xl font-bold">
          Recruiter Intelligence
        </h2>

        <p className="mt-3 text-zinc-400">
          Executive hiring assessment generated from repository
          engineering analytics.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          icon={<Award className="h-6 w-6" />}
          title="Hiring Score"
          value={`${recruiter.hiringScore}%`}
        />

        <MetricCard
          icon={<BadgeCheck className="h-6 w-6" />}
          title="Engineering Level"
          value={recruiter.engineeringLevel}
        />

        <MetricCard
          icon={<Users className="h-6 w-6" />}
          title="Hiring Confidence"
          value={`${recruiter.hiringConfidence}%`}
        />

        <MetricCard
          icon={<DollarSign className="h-6 w-6" />}
          title="Salary Range"
          value={recruiter.salaryRange}
        />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">

          <div className="flex items-center gap-3">

            <Briefcase className="h-6 w-6 text-cyan-400" />

            <h3 className="text-xl font-semibold">
              Recommended Roles
            </h3>

          </div>

          <ul className="mt-6 space-y-3">

            {recruiter.recommendedRoles.map((role) => (

              <li
                key={role}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                {role}
              </li>

            ))}

          </ul>

        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">

          <h3 className="text-xl font-semibold">
            Recruiter Verdict
          </h3>

          <p className="mt-5 leading-8 text-zinc-300">

            {recruiter.recruiterVerdict}

          </p>

        </div>

      </div>

    </section>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

function MetricCard({
  icon,
  title,
  value,
}: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">

      <div className="flex items-center justify-between">

        {icon}

        <span className="text-sm text-zinc-500">
          {title}
        </span>

      </div>

      <div className="mt-6 text-3xl font-black">
        {value}
      </div>

    </div>
  );
}