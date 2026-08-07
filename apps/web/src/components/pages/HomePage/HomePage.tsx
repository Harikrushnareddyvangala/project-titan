"use client";

import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { About } from "@/components/sections/About";

export function HomePage() {
  return (
    <main>
      <Hero />
      <Projects />
      <About />
    </main>
  );
}