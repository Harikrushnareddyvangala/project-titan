"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui";

export function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <Button
        asChild
        size="lg"
        className="group transition-transform hover:scale-[1.02]"
      >
        <Link href="/projects">
          View Projects

          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Button>

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
    </div>
  );
}