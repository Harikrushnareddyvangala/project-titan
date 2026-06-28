"use client";

import * as React from "react";

import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface MobileMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open: boolean;
}

export const MobileMenuButton = React.forwardRef<
  HTMLButtonElement,
  MobileMenuButtonProps
>(function MobileMenuButton(
  {
    open,
    className,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-label={
        open
          ? "Close navigation menu"
          : "Open navigation menu"
      }
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 lg:hidden",
        className,
      )}
      {...props}
    >
      {open ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </button>
  );
});

MobileMenuButton.displayName =
  "MobileMenuButton";