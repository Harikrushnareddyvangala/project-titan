"use client";

import { AvailabilityBadge } from "./AvailabilityBadge";
import { HeroButtons } from "./HeroButtons";
import { HeroSocial } from "./HeroSocial";
import { HeroStats } from "./HeroStats";
import { HeroTyping } from "./HeroTyping";

export function HeroContent() {
  return (
    <div className="max-w-4xl space-y-2">
      <AvailabilityBadge />

      <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
        Harikrushnareddy
        <br />
        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          Vangala
        </span>
      </h1>

      <HeroTyping />

      <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
        Building enterprise-grade AI, Machine Learning,
        Data Science, Analytics and Business Intelligence
        solutions with modern cloud technologies and
        exceptional user experiences.
      </p>

      <HeroButtons />

      <HeroSocial />

      <HeroStats />
    </div>
  );
}