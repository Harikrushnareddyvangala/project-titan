"use client";

import { Button } from "@/components/ui";

import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export function NavbarRight() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />

      <Button
  asChild
  size="sm"
  className="hidden lg:inline-flex"
>
  <Link
    href="/resume.pdf" >
    Resume
  </Link>
</Button>

      <MobileNav />
    </div>
  );
}