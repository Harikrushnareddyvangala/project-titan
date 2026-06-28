"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "./navigation";

import { cn } from "@/lib/utils";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden items-center gap-8 lg:flex"
      aria-label="Primary navigation"
    >
      {navigation.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative text-sm font-medium transition-colors duration-200",
              active
                ? "text-white"
                : "text-zinc-400 hover:text-white",
            )}
          >
            {item.label}

            <span
              className={cn(
                "absolute -bottom-2 left-0 h-0.5 w-full origin-left rounded-full bg-blue-500 transition-transform duration-300",
                active
                  ? "scale-x-100"
                  : "scale-x-0",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}