"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
              "relative py-2 text-sm font-medium transition-colors duration-200",
              active
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            )}
          >
            {item.label}

            {active && (
              <motion.span
                layoutId="navbar-indicator"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
                className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.7)]"
            
            />  )}
          </Link>
        );
      })}
    </nav>
  );
}