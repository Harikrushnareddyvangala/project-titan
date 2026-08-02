import type { ReactNode } from "react";

interface DashboardGridProps {
  children: ReactNode;

  columns?: 2 | 3 | 4;

  className?: string;
}

export function DashboardGrid({
  children,
  columns = 4,
  className = "",
}: DashboardGridProps) {

  const gridColumns = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div
      className={`
        grid
        gap-6
        ${gridColumns[columns]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}