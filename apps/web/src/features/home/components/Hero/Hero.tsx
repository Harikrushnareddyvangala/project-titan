import {
  HeroBadge,
  HeroDescription,
  HeroHeading,
} from ".";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="container">
        <HeroBadge />

        <HeroHeading />

        <HeroDescription />
      </div>
    </section>
  );
}