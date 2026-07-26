"use client";

import type { RecruiterIntelligence } from "@/types/github";

import {
  BadgeDollarSign,
  Briefcase,
  CheckCircle2,
  Target,
  UserCheck,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricGrid } from "@/components/dashboard/MetricGrid";

interface RecruiterDashboardProps {
  recruiter: RecruiterIntelligence;
}

export function RecruiterDashboard({
  recruiter,
}: RecruiterDashboardProps) {
  return (
    <section className="space-y-8">
      <DashboardHeader
        title="Recruiter Intelligence"
        description="AI assessment of hiring readiness based on repository analytics."
        icon={<UserCheck className="h-8 w-8 text-cyan-400" />}
      />

      <MetricGrid>
        <MetricCard
          title="Hiring Score"
          value={`${recruiter.hiringScore}%`}
          icon={<Target className="h-6 w-6" />}
        />

        <MetricCard
          title="Hiring Confidence"
          value={`${recruiter.hiringConfidence}%`}
          icon={<CheckCircle2 className="h-6 w-6" />}
        />

        <MetricCard
          title="Engineering Level"
          value={recruiter.engineeringLevel}
          icon={<Briefcase className="h-6 w-6" />}
        />

        <MetricCard
          title="Salary Range"
          value={recruiter.salaryRange}
          icon={<BadgeDollarSign className="h-6 w-6" />}
        />
      </MetricGrid>

      <DashboardSection title="Recruiter Verdict">
        <p className="leading-8 text-zinc-300">
          {recruiter.recruiterVerdict}
        </p>
      </DashboardSection>

      <DashboardSection title="Recommended Roles">
        <div className="grid gap-4">
          {recruiter.recommendedRoles.map((role) => (
            <div
              key={role}
              className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4"
            >
              {role}
            </div>
          ))}
        </div>
      </DashboardSection>
    </section>
  );
}