import {
  HeroActions,
  HeroBadge,
  HeroDescription,
  HeroHeading,
  HeroStats,
} from ".";

import { HeroBackground } from "./HeroBackground";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden py-28">
      {/* Background Layer */}
      <div className="absolute inset-0">
        <HeroBackground />
      </div>

      {/* Content Layer */}
      <div className="container relative z-10">
        <HeroBadge />

        <HeroHeading />

        <HeroDescription />

        <HeroActions />

        <HeroStats />
      </div>
    </section>
  );
}