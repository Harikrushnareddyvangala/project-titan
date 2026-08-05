import type { ReactNode } from "react";

import type { BadgeVariant } from "./badgeTypes";

interface StatusBadgeProps {
  children: ReactNode;

  variant?: BadgeVariant;

  size?: "sm" | "md";

  rounded?: boolean;
}

const BADGE_VARIANTS: Record<
  BadgeVariant,
  string
> = {
  success:
    "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",

  info:
    "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",

  warning:
    "bg-amber-500/10 border-amber-500/30 text-amber-300",

  danger:
    "bg-red-500/10 border-red-500/30 text-red-300",

  neutral:
    "bg-zinc-500/10 border-zinc-500/30 text-zinc-300",
};

const BADGE_SIZES = {
  sm: "px-2 py-1 text-xs",

  md: "px-3 py-1 text-sm",
};

export function StatusBadge({
  children,
  variant = "neutral",
  size = "sm",
  rounded = true,
}: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        border
        font-semibold
        transition-colors
        ${BADGE_VARIANTS[variant]}
        ${BADGE_SIZES[size]}
        ${rounded ? "rounded-full" : "rounded-md"}
      `}
    >
      {children}
    </span>
  );
}