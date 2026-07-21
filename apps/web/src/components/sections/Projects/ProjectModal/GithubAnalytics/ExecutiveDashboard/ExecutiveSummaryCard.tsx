"use client";

import {
  ShieldCheck,
  Award,
  TrendingUp,
  Building2,
} from "lucide-react";

import type { RepositoryAnalytics } from "@/types/github";

interface Props {
  analytics: RepositoryAnalytics;
}

export function ExecutiveSummaryCard({
  analytics,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-xl">

      <div className="flex items-center gap-3">

        <Award
          size={32}
          className="text-yellow-400"
        />

        <div>

          <h3 className="text-2xl font-bold">
            Executive Summary
          </h3>

          <p className="text-sm text-muted-foreground">
            AI-generated repository assessment
          </p>

        </div>

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <div>

          <h4 className="text-lg font-semibold mb-3">
            Executive Overview
          </h4>

          <p className="leading-7 text-muted-foreground">
            {analytics.executiveSummary}
          </p>

        </div>

        <div>

          <h4 className="text-lg font-semibold mb-3">
            Enterprise Assessment
          </h4>

          <p className="leading-7 text-muted-foreground">
            {analytics.enterpriseSummary}
          </p>

        </div>

      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">

        <SummaryMetric
          icon={<ShieldCheck size={22} />}
          title="Engineering"
          value={`${analytics.engineeringScore}%`}
        />

        <SummaryMetric
          icon={<TrendingUp size={22} />}
          title="Production"
          value={`${analytics.productionScore}%`}
        />

        <SummaryMetric
          icon={<Building2 size={22} />}
          title="Enterprise"
          value={`${analytics.enterpriseReadiness}%`}
        />

        <SummaryMetric
          icon={<Award size={22} />}
          title="Repository Grade"
          value={analytics.repositoryGrade}
        />

      </div>

      <div className="mt-10">

        <h4 className="font-semibold text-lg mb-4">
          Engineering Highlights
        </h4>

        <div className="grid gap-3">

          {analytics.strengths.map((item) => (

            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
            >

              <ShieldCheck
                size={18}
                className="text-emerald-400"
              />

              <span>{item}</span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

interface MetricProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function SummaryMetric({
  icon,
  title,
  value,
}: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <div className="mb-4 flex items-center gap-2 text-cyan-400">
        {icon}
      </div>

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h4 className="mt-2 text-3xl font-bold">
        {value}
      </h4>

    </div>
  );
}