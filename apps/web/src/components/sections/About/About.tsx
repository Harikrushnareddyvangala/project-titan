"use client";

import { AboutTimeline } from "./AboutTimeline";
import { AboutSkills } from "./AboutSkills";
import { AboutHeader } from "./AboutHeader";
import { AboutAchievements } from "./AboutAchievements";
export function About() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
        <AboutHeader />
      <div className="mt-20 grid gap-20 lg:grid-cols-2">
        <AboutTimeline />
        <AboutSkills />
      </div>
        <AboutAchievements />
    </section>
  );
}