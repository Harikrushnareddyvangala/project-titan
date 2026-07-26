"use client";

import type { ReactNode } from "react";

interface MetricGridProps {
  children: ReactNode;
}

export function MetricGrid({
  children,
}: MetricGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
}