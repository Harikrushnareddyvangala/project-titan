"use client";

import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  open: boolean;
  onClick: () => void;
}

export function MobileMenuButton({
  open,
  onClick,
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={open}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 lg:hidden"
    >
      {open ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </button>
  );
}