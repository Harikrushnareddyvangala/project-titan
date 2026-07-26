"use client";

import type { CareerIntelligence } from "@/types/github";

import {
  Briefcase,
  TrendingUp,
  Award,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricGrid } from "@/components/dashboard/MetricGrid";

interface CareerDashboardProps {
  career: CareerIntelligence;
}

export function CareerDashboard({
  career,
}: CareerDashboardProps) {
  return (
    <section className="space-y-8">
      <DashboardHeader
        title="Career Intelligence"
        description="AI-powered career assessment generated from repository engineering analytics."
        icon={<Briefcase className="h-8 w-8 text-cyan-400" />}
      />

      <MetricGrid>
        <MetricCard
          title="Promotion Readiness"
          value={`${career.promotionReadiness}%`}
          icon={<Award className="h-6 w-6" />}
        />

        <MetricCard
          title="Market Demand"
          value={`${career.marketDemand}%`}
          icon={<TrendingUp className="h-6 w-6" />}
        />

        <MetricCard
          title="Leadership Potential"
          value={`${career.leadershipPotential}%`}
          icon={<ArrowUpRight className="h-6 w-6" />}
        />

        <MetricCard
          title="Career Risk"
          value={`${career.careerRisk}%`}
          icon={<AlertTriangle className="h-6 w-6" />}
        />
      </MetricGrid>

      <DashboardSection title="Career Stage">
        <div className="space-y-4">
          <p className="text-xl font-semibold text-cyan-400">
            {career.careerStage}
          </p>

          <p className="leading-8 text-zinc-300">
            {career.executiveSummary}
          </p>
        </div>
      </DashboardSection>

      <DashboardSection title="Estimated Market Value">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-emerald-400" />

          <span className="text-2xl font-bold">
            {career.estimatedMarketValue}
          </span>
        </div>
      </DashboardSection>

      <DashboardSection title="Recommended Next Career Step">
        <p className="leading-8 text-zinc-300">
          {career.nextCareerStep}
        </p>
      </DashboardSection>
    </section>
  );
}