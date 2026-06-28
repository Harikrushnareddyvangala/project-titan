import { HeroBackground } from "./HeroBackground";
import { HeroButtons } from "./HeroButtons";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <HeroBackground />

      <div className="container relative z-10">
        <div className="max-w-3xl space-y-8">
          <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            Enterprise AI • Data Science • Machine Learning
          </span>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Project{" "}
            <span className="gradient-text">
              TITAN
            </span>
          </h1>

          <p className="text-lg leading-8 text-zinc-500 dark:text-zinc-400">
            Building enterprise AI solutions, interactive dashboards,
            scalable APIs, modern web applications, and production-ready
            machine learning systems.
          </p>

          <HeroButtons />
        </div>
      </div>
    </section>
  );
}