import type { ReactNode } from "react";

import { BaseCard } from "./BaseCard";
import { TrendIndicator } from "../indicators/TrendIndicator";

interface MetricCardProps {

  title: string;

  value: string | number;

  subtitle?: string;

  change?: number;

  suffix?: string;

  precision?: number;

  icon?: ReactNode;

}

export function MetricCard({

  title,

  value,

  subtitle,

  change,

  suffix = "",

  precision = 1,

  icon,

}: MetricCardProps) {

  const formattedValue =
    typeof value === "number"
      ? value.toFixed(precision)
      : value;

  return (

    <BaseCard>

      <div className="flex items-center justify-between">

        <div>

          <div className="text-sm uppercase tracking-wide text-zinc-500">

            {title}

          </div>

          <div className="mt-3 text-3xl font-bold">

            {formattedValue}
            {suffix}

          </div>

          {subtitle && (

            <div className="mt-1 text-sm text-zinc-400">

              {subtitle}

            </div>

          )}

          {change !== undefined && (

            <div className="mt-3">

              <TrendIndicator
                value={change}
                suffix={suffix}
              />

            </div>

          )}

        </div>

        {icon}

      </div>

    </BaseCard>

  );

}