"use client";

import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
}

export function DashboardSection({
  title,
  children,
}: DashboardSectionProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-8">
      <h3 className="text-2xl font-bold">
        {title}
      </h3>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}