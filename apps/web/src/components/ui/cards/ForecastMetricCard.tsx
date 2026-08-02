import type { ReactNode } from "react";

import { BaseCard } from "./BaseCard";

interface ForecastMetricCardProps {

  title: string;

  value: number;

  subtitle?: string;

  precision?: number;

  suffix?: string;

  icon?: ReactNode;

}

export function ForecastMetricCard({

  title,

  value,

  subtitle,

  precision = 1,

  suffix = "%",

  icon,

}: ForecastMetricCardProps) {

  const color =
    value >= 90
      ? "text-emerald-400"
      : value >= 75
      ? "text-cyan-400"
      : value >= 60
      ? "text-amber-400"
      : "text-red-400";

  return (

    <BaseCard
      padding="sm"
    >

      <div className="flex items-start justify-between">

        <div>

          <div className="text-sm uppercase tracking-wide text-zinc-500">

            {title}

          </div>

          <div
            className={`mt-3 text-3xl font-bold ${color}`}
          >

            {value.toFixed(precision)}
            {suffix}

          </div>

          {subtitle && (

            <div className="mt-2 text-sm text-zinc-400">

              {subtitle}

            </div>

          )}

        </div>

        {icon}

      </div>

    </BaseCard>

  );

}