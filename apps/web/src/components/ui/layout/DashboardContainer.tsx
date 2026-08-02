import type { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
}

export function DashboardContainer({
  children,
}: DashboardContainerProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        {children}
      </div>
    </main>
  );
}