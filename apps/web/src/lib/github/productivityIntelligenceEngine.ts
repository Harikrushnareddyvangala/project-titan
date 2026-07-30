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

  const activityScore =
  repositories.reduce(
    (sum, repository) =>
      sum + repository.engineeringScore,
    0,
  ) / repositories.length;

const deliveryVelocity =
  repositories.reduce(
    (sum, repository) =>
      sum + repository.productionScore,
    0,
  ) / repositories.length;

const maintenanceScore =
  repositories.reduce(
    (sum, repository) =>
      sum + repository.enterpriseReadiness,
    0,
  ) / repositories.length;

const collaborationScore =
  repositories.reduce(
    (sum, repository) =>
      sum +
      repository.recruiterIntelligence.hiringScore,
    0,
  ) / repositories.length;
  const releaseHealth =
  repositories.reduce(
    (sum, repository) =>
      sum +
      (
        repository.securityScore +
        repository.productionScore
      ) /
      2,
    0,
  ) / repositories.length;
  const overallScore =
  (
    activityScore +
    deliveryVelocity +
    maintenanceScore +
    collaborationScore +
    releaseHealth
  ) / 5;
  let productivityGrade = "F";

if (overallScore >= 90)
  productivityGrade = "A+";
else if (overallScore >= 80)
  productivityGrade = "A";
else if (overallScore >= 70)
  productivityGrade = "B";
else if (overallScore >= 60)
  productivityGrade = "C";
else if (overallScore >= 50)
  productivityGrade = "D";
const recommendations: string[] = [];

if (activityScore >= 90) {
  recommendations.push(
    "Engineering activity is consistently strong across the portfolio. Maintain current development practices.",
  );
} else if (activityScore >= 75) {
  recommendations.push(
    "Engineering activity is healthy. Focus on increasing consistency across repositories.",
  );
} else {
  recommendations.push(
    "Increase engineering activity by improving development cadence and repository maintenance.",
  );
}

if (deliveryVelocity >= 85) {
  recommendations.push(
    "Delivery processes demonstrate strong production readiness and deployment maturity.",
  );
} else if (deliveryVelocity >= 70) {
  recommendations.push(
    "Delivery maturity is good. Continue investing in automation and deployment workflows.",
  );
} else {
  recommendations.push(
    "Improve CI/CD pipelines and deployment automation to increase delivery velocity.",
  );
}

if (maintenanceScore >= 85) {
  recommendations.push(
    "Repository maintenance practices are well established across the portfolio.",
  );
} else if (maintenanceScore >= 70) {
  recommendations.push(
    "Continue improving documentation, refactoring, and long-term maintainability.",
  );
} else {
  recommendations.push(
    "Prioritize technical debt reduction, documentation, and maintainability improvements.",
  );
}

if (collaborationScore >= 85) {
  recommendations.push(
    "Collaboration maturity is excellent. Current engineering practices support effective teamwork.",
  );
} else if (collaborationScore >= 70) {
  recommendations.push(
    "Strengthen collaboration through code reviews, shared ownership, and engineering standards.",
  );
} else {
  recommendations.push(
    "Improve collaboration practices by encouraging reviews, documentation, and contributor engagement.",
  );
}

if (releaseHealth >= 85) {
  recommendations.push(
    "Release quality is consistently high across repositories.",
  );
} else if (releaseHealth >= 70) {
  recommendations.push(
    "Improve release reliability with expanded testing and security validation.",
  );
} else {
  recommendations.push(
    "Strengthen release health through automated testing, security checks, and deployment validation.",
  );
}
const uniqueRecommendations = [...new Set(recommendations)];
return {
  activityScore,
  deliveryVelocity,
  maintenanceScore,
  collaborationScore,
  releaseHealth,

  productivityGrade,

  recommendations: uniqueRecommendations,
};
}