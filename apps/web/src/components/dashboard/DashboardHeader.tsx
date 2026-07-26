"use client";

import type { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export function DashboardHeader({
  title,
  description,
  icon,
}: DashboardHeaderProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
      <div className="flex items-center gap-3">
        {icon}

        <div>
          <h2 className="text-3xl font-bold">
            {title}
          </h2>

          <p className="mt-2 text-zinc-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}