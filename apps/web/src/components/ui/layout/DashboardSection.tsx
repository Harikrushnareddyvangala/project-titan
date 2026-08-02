import type { ReactNode } from "react";

interface DashboardSectionProps {
  children: ReactNode;

  title?: string;

  description?: string;

  className?: string;
}

export function DashboardSection({
  children,
  title,
  description,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={className}>

      {(title || description) && (
        <div className="mb-6">

          {title && (
            <h2 className="text-2xl font-bold">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-2 text-zinc-400">
              {description}
            </p>
          )}

        </div>
      )}

      {children}

    </section>
  );
}