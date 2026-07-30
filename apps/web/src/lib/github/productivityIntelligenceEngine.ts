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

if (activityScore < 75) {
  recommendations.push(
    "Increase engineering activity across repositories.",
  );
}

if (deliveryVelocity < 75) {
  recommendations.push(
    "Improve delivery automation and deployment readiness.",
  );
}

if (maintenanceScore < 75) {
  recommendations.push(
    "Invest in long-term maintainability and documentation.",
  );
}

if (collaborationScore < 75) {
  recommendations.push(
    "Strengthen collaboration and engineering best practices.",
  );
}

if (releaseHealth < 75) {
  recommendations.push(
    "Improve release stability through testing and security hardening.",
  );
}
return {
  activityScore,
  deliveryVelocity,
  maintenanceScore,
  collaborationScore,
  releaseHealth,

  productivityGrade,

  recommendations,
};
}