import type { ReactNode } from "react";

import { BaseCard } from "./BaseCard";

import { GrowthBadge } from "../badges/GrowthBadge";

interface DeltaMetricCardProps {

  title: string;

  value: number;

  subtitle?: string;

  suffix?: string;

  precision?: number;

  icon?: ReactNode;

}

export function DeltaMetricCard({

  title,

  value,

  subtitle,

  suffix = "%",

  precision = 2,

  icon,

}: DeltaMetricCardProps) {

  return (

    <BaseCard
      padding="sm"
    >

      <div className="flex items-start justify-between">

        <div>

          <div className="text-sm uppercase tracking-wide text-zinc-500">

            {title}

          </div>

          <div className="mt-3">

            <GrowthBadge
              value={value}
              suffix={suffix}
              precision={precision}
            />

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