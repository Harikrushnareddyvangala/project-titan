"use client";

import { AboutTimeline } from "./AboutTimeline";
import { AboutSkills } from "./AboutSkills";

export function About() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-4xl font-bold text-white">
        About Me
      </h2>

      <p className="mt-4 max-w-2xl text-zinc-400">
        A structured journey through my evolution in data,
        analytics, and AI engineering.
      </p>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <AboutTimeline />
        <AboutSkills />
      </div>
    </section>
  );
}