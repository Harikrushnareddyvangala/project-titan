"use client";

import {
  Activity,
  Gauge,
  Timer,
  TrendingUp,
} from "lucide-react";

import { MetricCard } from "./MetricCard";

interface Metric {
  label: string;
  value: string;
}

interface MetricsDashboardProps {
  metrics: Metric[];
}

function extractNumber(value: string) {
  const match = value.match(/\d+/);

  return match
    ? Number(match[0])
    : 0;
}

export function MetricsDashboard({
  metrics,
}: MetricsDashboardProps) {
  const icons = [
    TrendingUp,
    Activity,
    Gauge,
    Timer,
  ];

  return (
    <section className="space-y-8">

      <div>

        <h2 className="text-3xl font-bold text-white">
          Performance Dashboard
        </h2>

        <p className="mt-2 text-zinc-400">
          Key performance indicators for this project.
        </p>

      </div>

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {metrics.map(
          (metric, index) => {
            const Icon =
              icons[
                index %
                  icons.length
              ];

            return (
              <MetricCard
                key={metric.label}
                title={metric.label}
                description={`Measured project ${metric.label.toLowerCase()}.`}
                value={extractNumber(metric.value)}
                trend={2 + index}
                icon={Icon}
              />
            );
          },
        )}
      </div>

    </section>
  );
}