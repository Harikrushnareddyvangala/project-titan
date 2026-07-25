"use client";

import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Cpu,
} from "lucide-react";

import { Button } from "@/components/ui";

export function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap gap-4">

      {/* View Projects */}

      <Button
        asChild
        size="lg"
        className="group transition-transform hover:scale-[1.02]"
      >
        <Link href="/projects">

          View Projects

          <ArrowRight
            className="
            ml-2
            h-5
            w-5
            transition-transform
            duration-300
            group-hover:translate-x-1
            "
          />

        </Link>
      </Button>

      {/* Contact */}

      <Button
        asChild
        variant="outline"
        size="lg"
        className="group transition-transform hover:scale-[1.02]"
      >
        <Link href="/contact">

          <Mail className="mr-2 h-5 w-5" />

          Contact Me

        </Link>
      </Button>

      {/* AI Workspace */}

      <Button
        asChild
        variant="outline"
        size="lg"
        className="
        group
        border-cyan-400/40
        text-cyan-300
        transition-all
        hover:scale-[1.02]
        hover:border-cyan-400
        hover:bg-cyan-500/10
        "
      >
        <Link href="/workspace">

          <Cpu className="mr-2 h-5 w-5" />

          Launch AI Workspace

        </Link>
      </Button>

    </div>
  );
}