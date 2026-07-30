import type {
  RepositoryAnalytics,
  RepositoryRiskIntelligence,
} from "@/types/github";

interface RepositoryRiskInput {
  repositories: RepositoryAnalytics[];
}

export function buildRepositoryRiskIntelligence({
  repositories,
}: RepositoryRiskInput): RepositoryRiskIntelligence {

  if (repositories.length === 0) {
    return {
      engineeringRisk: 0,
      securityRisk: 0,
      productionRisk: 0,
      enterpriseRisk: 0,
      hiringRisk: 0,

      overallRisk: 0,

      riskGrade: "N/A",

      recommendations: [],
    };
  }

  return {
    engineeringRisk: 18,
    securityRisk: 21,
    productionRisk: 15,
    enterpriseRisk: 24,
    hiringRisk: 19,

    overallRisk: 19,

    riskGrade: "Low",

    recommendations: [],
  };
}