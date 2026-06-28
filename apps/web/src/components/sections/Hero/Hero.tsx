"use client";

import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { ScrollIndicator } from "./ScrollIndicator";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24">
        <HeroContent />
      </div>

      <ScrollIndicator />
    </section>
  );
}