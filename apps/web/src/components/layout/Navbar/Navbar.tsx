"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

import { DesktopNav } from "./DesktopNav";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { useNavbarScroll } from "./use-navbar-scroll";

export function Navbar() {
  const isScrolled = useNavbarScroll();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl shadow-lg"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Resume Button */}
          <Button
            size="sm"
            className="hidden lg:inline-flex"
          >
            Resume
          </Button>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}