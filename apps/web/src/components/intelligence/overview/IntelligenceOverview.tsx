"use client";

import type { RepositoryAnalytics } from "@/types/github";

import { getAvailableIntelligenceSections } from "../shared";

import { IntelligenceOverviewCard } from "./IntelligenceOverviewCard";

interface IntelligenceOverviewProps {
  analytics: RepositoryAnalytics;
}

export function IntelligenceOverview({
  analytics,
}: IntelligenceOverviewProps) {
  const availableSections =
    getAvailableIntelligenceSections(analytics);

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(
      `intelligence-${sectionId}`,
    );

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (availableSections.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Intelligence Overview
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Repository Intelligence Map
        </h2>

        <p className="mt-3 max-w-3xl text-zinc-400">
          Explore the intelligence domains available for
          this repository.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {availableSections.map((section) => (
          <IntelligenceOverviewCard
            key={section.id}
            title={section.title}
            description={section.description}
            onClick={() =>
              handleNavigate(section.id)
            }
          />
        ))}
      </div>
    </section>
  );
}