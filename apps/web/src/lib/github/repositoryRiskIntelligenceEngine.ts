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


if (engineeringRisk <= 15) {
  recommendations.push(
    "Engineering risk is well controlled across the portfolio. Maintain current engineering standards.",
  );
} else if (engineeringRisk <= 30) {
  recommendations.push(
    "Engineering quality is generally healthy. Continue improving consistency across repositories.",
  );
} else {
  recommendations.push(
    "Reduce engineering risk by improving code quality, testing, and maintainability.",
  );
}

if (securityRisk <= 15) {
  recommendations.push(
    "Security posture is strong across the portfolio.",
  );
} else if (securityRisk <= 30) {
  recommendations.push(
    "Strengthen vulnerability management and security reviews.",
  );
} else {
  recommendations.push(
    "Prioritize security improvements including dependency updates, vulnerability remediation, and secure development practices.",
  );
}

if (productionRisk <= 15) {
  recommendations.push(
    "Production readiness is consistently high.",
  );
} else if (productionRisk <= 30) {
  recommendations.push(
    "Continue improving deployment automation and operational stability.",
  );
} else {
  recommendations.push(
    "Increase production reliability through CI/CD improvements, automated testing, monitoring, and rollback strategies.",
  );
}

if (enterpriseRisk <= 15) {
  recommendations.push(
    "Enterprise readiness demonstrates strong governance and maintainability.",
  );
} else if (enterpriseRisk <= 30) {
  recommendations.push(
    "Continue improving documentation and engineering governance.",
  );
} else {
  recommendations.push(
    "Reduce enterprise risk through stronger documentation, architecture governance, and repository standardization.",
  );
}

if (hiringRisk <= 15) {
  recommendations.push(
    "Repository quality supports efficient onboarding and hiring evaluation.",
  );
} else if (hiringRisk <= 30) {
  recommendations.push(
    "Improve repository consistency to simplify onboarding and collaboration.",
  );
} else {
  recommendations.push(
    "Improve code organization, documentation, and engineering consistency to reduce hiring and onboarding risk.",
  );
}
const uniqueRecommendations = [
  ...new Set(recommendations),
];
  return {
    engineeringRisk,
    securityRisk,
    productionRisk,
    enterpriseRisk,
    hiringRisk,

    overallRisk,

    riskGrade,

    recommendations: uniqueRecommendations,
  };
}