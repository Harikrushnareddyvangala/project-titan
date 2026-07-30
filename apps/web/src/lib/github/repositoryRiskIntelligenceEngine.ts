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

  const engineeringRisk =
    repositories.reduce(
      (sum, repository) =>
        sum + (100 - repository.engineeringScore),
      0,
    ) / repositories.length;

  const securityRisk =
    repositories.reduce(
      (sum, repository) =>
        sum + (100 - repository.securityScore),
      0,
    ) / repositories.length;

  const productionRisk =
    repositories.reduce(
      (sum, repository) =>
        sum + (100 - repository.productionScore),
      0,
    ) / repositories.length;

  const enterpriseRisk =
    repositories.reduce(
      (sum, repository) =>
        sum +
        (100 - repository.enterpriseReadiness),
      0,
    ) / repositories.length;

  const hiringRisk =
    repositories.reduce(
      (sum, repository) =>
        sum +
        (
          100 -
          repository.recruiterIntelligence.hiringScore
        ),
      0,
    ) / repositories.length;

  const overallRisk =
    (
      engineeringRisk +
      securityRisk +
      productionRisk +
      enterpriseRisk +
      hiringRisk
    ) / 5;

  let riskGrade = "Critical";

  if (overallRisk <= 10) {
    riskGrade = "Minimal";
  } else if (overallRisk <= 20) {
    riskGrade = "Low";
  } else if (overallRisk <= 35) {
    riskGrade = "Moderate";
  } else if (overallRisk <= 50) {
    riskGrade = "High";
  }

  const recommendations: string[] = [];

  if (engineeringRisk > 30) {
    recommendations.push(
      "Improve engineering quality to reduce implementation risk.",
    );
  }

  if (securityRisk > 30) {
    recommendations.push(
      "Strengthen repository security controls and vulnerability management.",
    );
  }

  if (productionRisk > 30) {
    recommendations.push(
      "Increase production readiness through deployment automation and testing.",
    );
  }

  if (enterpriseRisk > 30) {
    recommendations.push(
      "Improve enterprise readiness by strengthening documentation and governance.",
    );
  }

  if (hiringRisk > 30) {
    recommendations.push(
      "Increase repository consistency and code quality to improve onboarding.",
    );
  }

  return {
    engineeringRisk,
    securityRisk,
    productionRisk,
    enterpriseRisk,
    hiringRisk,

    overallRisk,

    riskGrade,

    recommendations,
  };
}