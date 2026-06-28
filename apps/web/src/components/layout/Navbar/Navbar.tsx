"use client";

import { Button } from "@/components/ui";
import { useNavbarScroll } from "./use-navbar-scroll";
import { DesktopNav } from "./DesktopNav";
import { Logo } from "./Logo";

import { cn } from "@/lib/utils";

export function Navbar() {
  const scrolled = useNavbarScroll();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <Logo />

        <DesktopNav />

        <Button size="sm">
          Resume
        </Button>
      </div>
    </header>
  );
}