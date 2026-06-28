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
    <section className="relative overflow-hidden py-28">
      <HeroBackground />

      <div className="container relative">
        <HeroBadge />

        <HeroHeading />

        <HeroDescription />

        <HeroActions />

        <HeroStats />
      </div>
    </section>
  );
}