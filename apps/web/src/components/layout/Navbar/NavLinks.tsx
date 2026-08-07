"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "./navigation";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {navigation.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition-colors ${
            pathname === link.href
              ? "text-blue-500 font-semibold"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}