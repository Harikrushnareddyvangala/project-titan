"use client";

import type { ReactNode } from "react";

interface GithubCardProps {
  children: ReactNode;
  className?: string;
}

export function GithubCard({
  children,
  className = "",
}: GithubCardProps) {
  return (
    <section
      className={`
        h-full
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-8
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400/30
        hover:shadow-[0_15px_40px_rgba(34,211,238,0.08)]
        ${className}
      `}
    >
      {children}
    </section>
  );
}