"use client";

import type { OrganizationIntelligence } from "@/types/github";

import {
  Building2,
  Rocket,
  Lightbulb,
  Wrench,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface OrganizationDashboardProps {
  organization: OrganizationIntelligence;
}

export function OrganizationDashboard({
  organization,
}: OrganizationDashboardProps) {
  return (
    <section className="space-y-8">
      {/* Header */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-cyan-400" />

          <div>
            <h2 className="text-3xl font-bold">
              Organization Intelligence
            </h2>

            <p className="mt-2 text-zinc-400">
              AI evaluation of engineering maturity and organizational readiness.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
      </div>

      {/* Executive Summary */}

      <div className="rounded-3xl border border-white/10 bg-black/30 p-8">
        <h3 className="text-2xl font-bold">
          Executive Summary
        </h3>

        <p className="mt-6 leading-8 text-zinc-300">
          {organization.executiveSummary}
        </p>
      </div>
    </section>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({
  title,
  value,
  icon,
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