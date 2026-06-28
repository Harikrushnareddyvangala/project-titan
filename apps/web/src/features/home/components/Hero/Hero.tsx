import {
  HeroActions,
  HeroBadge,
  HeroDescription,
  HeroHeading,
  HeroStats,
} from ".";

import { HeroBackground } from "./HeroBackground";
import { Container } from "@/components/layout/Container";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden py-28">
      {/* Background Layer */}
      <div className="absolute inset-0">
        <HeroBackground />
      </div>

      {/* Content Layer */}
      <Container className="relative z-10">
  

        <HeroBadge />

        <HeroHeading />

        <HeroDescription />

        <HeroActions />

        <HeroStats />
      </Container>
    </section>
  );
}