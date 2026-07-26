"use client";

import type { OrganizationIntelligence } from "@/types/github";

import {
  Building2,
  Lightbulb,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricGrid } from "@/components/dashboard/MetricGrid";

interface OrganizationDashboardProps {
  organization: OrganizationIntelligence;
}

export function OrganizationDashboard({
  organization,
}: OrganizationDashboardProps) {
  return (
    <section className="space-y-8">
      <DashboardHeader
        title="Organization Intelligence"
        description="AI evaluation of engineering maturity and organizational readiness."
        icon={<Building2 className="h-8 w-8 text-cyan-400" />}
      />

      <MetricGrid>
        <MetricCard
          title="Engineering Culture"
          value={`${organization.engineeringCulture}%`}
          icon={<Building2 className="h-6 w-6" />}
        />

        <MetricCard
          title="Delivery Maturity"
          value={`${organization.deliveryMaturity}%`}
          icon={<Rocket className="h-6 w-6" />}
        />

        <MetricCard
          title="Innovation Culture"
          value={`${organization.innovationCulture}%`}
          icon={<Lightbulb className="h-6 w-6" />}
        />

        <MetricCard
          title="Technical Debt"
          value={`${organization.technicalDebt}%`}
          icon={<Wrench className="h-6 w-6" />}
        />

        <MetricCard
          title="Organization Readiness"
          value={`${organization.organizationalReadiness}%`}
          icon={<ShieldCheck className="h-6 w-6" />}
        />

        <MetricCard
          title="Scaling Readiness"
          value={`${organization.scalingReadiness}%`}
          icon={<TrendingUp className="h-6 w-6" />}
        />

        <MetricCard
          title="Engineering Governance"
          value={`${organization.engineeringGovernance}%`}
          icon={<ShieldCheck className="h-6 w-6" />}
        />
      </MetricGrid>

      <DashboardSection title="Executive Summary">
        <p className="leading-8 text-zinc-300">
          {organization.executiveSummary}
        </p>
      </DashboardSection>
    </section>
  );
}