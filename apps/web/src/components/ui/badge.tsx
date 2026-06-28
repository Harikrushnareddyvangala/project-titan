import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white",

        secondary:
          "border-transparent bg-zinc-800 text-white",

        outline:
          "border-zinc-700 text-zinc-300",

        success:
          "border-green-500/20 bg-green-500/10 text-green-400",

        warning:
          "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",

        destructive:
          "border-red-500/20 bg-red-500/10 text-red-400",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}