import type { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;

  description?: string;

  action?: ReactNode;
}

export function DashboardHeader({
  title,
  description,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">

      <div>

        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        {description && (
          <p className="mt-3 text-zinc-400">
            {description}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}