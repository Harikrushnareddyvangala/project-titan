import type { RepositoryAnalytics } from "@/types/github";

import { intelligenceSections } from "@/lib/intelligence/sections";

export function getAvailableIntelligenceSections(
  analytics: RepositoryAnalytics,
) {
  return intelligenceSections
    .filter((section) => section.enabled)
    .filter((section) => {
      if (section.id === "recruiter") {
        return Boolean(
          analytics.recruiterIntelligence,
        );
      }

      return true;
    })
    .sort((a, b) => a.order - b.order);
}