"use client";

import Link from "next/link";
import {
  ExternalLinkIcon,
  LinkIcon,
  FileText,
} from "lucide-react";

const socialLinks = [
  {
    icon: ExternalLinkIcon,
    href: "https://github.com/Harikrushnareddyvangala",
    label: "GitHub",
  },
  {
    icon: LinkIcon,
    href: "https://www.linkedin.com/in/harikrushnareddy-vangala-277aa881/",
    label: "LinkedIn",
  },
  {
    icon: FileText,
    href: "/resume.pdf",
    label: "Resume",
  },
];

export function HeroSocial() {
  return (
    <div className="mt-10 flex items-center gap-5">
      {socialLinks.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            target={
              item.href.startsWith("http")
                ? "_blank"
                : undefined
            }
            rel={
              item.href.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            aria-label={item.label}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </div>
  );
}