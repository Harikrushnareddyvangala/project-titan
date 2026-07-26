"use client";

import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export function MetricCard({
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