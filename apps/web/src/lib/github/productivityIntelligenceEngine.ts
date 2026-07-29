import type {
  ProductivityIntelligence,
  RepositoryAnalytics,
} from "@/types/github";

interface ProductivityIntelligenceInput {
  repositories: RepositoryAnalytics[];
}

export function buildProductivityIntelligence({
  repositories,
}: ProductivityIntelligenceInput): ProductivityIntelligence {

  if (repositories.length === 0) {
    return {
      activityScore: 0,
      deliveryVelocity: 0,
      maintenanceScore: 0,
      collaborationScore: 0,
      releaseHealth: 0,

      productivityGrade: "N/A",

      recommendations: [],
    };
  }

  return {
    activityScore: 82,
    deliveryVelocity: 79,
    maintenanceScore: 84,
    collaborationScore: 77,
    releaseHealth: 81,

    productivityGrade: "A",

    recommendations: [],
  };
}