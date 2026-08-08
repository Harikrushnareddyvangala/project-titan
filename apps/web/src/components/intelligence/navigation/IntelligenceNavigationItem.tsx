"use client";

import type { IntelligenceSection } from "@/lib/intelligence/types";

interface IntelligenceNavigationItemProps {
  section: IntelligenceSection;
  active: boolean;
  onClick: () => void;
}

export function IntelligenceNavigationItem({
  section,
  active,
  onClick,
}: IntelligenceNavigationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={
        active ? "page" : undefined
      }
      className={[
        "shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold",
        "transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-sm",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50",
        active
          ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
          : "border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      {section.title}
    </button>
  );
}