"use client";

import { StatsCards } from "./StatsCards";
import { getPortfolioAnalytics } from "./analytics";
import { TechnologyChart } from "./TechnologyChart";
import { Timeline } from "./Timeline";
import {CategoryChart} from "./CategoryChart";

export function AnalyticsSection() {
  const analytics =
    getPortfolioAnalytics();

  return (
    <section className="mb-24">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-white">
          Portfolio Analytics
        </h2>

        <p className="mt-4 max-w-3xl text-zinc-400">
          A live overview of my projects,
          technologies and expertise.
        </p>
      </div>

      <StatsCards stats={analytics} />
      <div className="mt-10 grid gap-8 xl:grid-cols-2">
  <TechnologyChart
    technologies={analytics.technologies}
  />

  <CategoryChart
    categories={analytics.categories}
  />
</div>

<div className="mt-10">
  <Timeline />
</div>
    </section>
  );
}