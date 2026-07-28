import type {
  PortfolioHealth,
  RepositoryAnalytics,
} from "@/types/github";

interface PortfolioHealthInput {

  repositories: RepositoryAnalytics[];

}   
export function buildPortfolioHealth(
  input: PortfolioHealthInput,
): PortfolioHealth {

  const { repositories } = input;
  if (repositories.length === 0) {

  return {

    overallScore: 0,

    engineeringMaturity: 0,

    productionReadiness: 0,

    securityReadiness: 0,

    enterpriseReadiness: 0,

    hiringReadiness: 0,

    portfolioGrade: "N/A",

    portfolioRisk: "High",

  };

}const engineeringMaturity =
  repositories.reduce(
    (sum, repository) =>
      sum + repository.engineeringScore,
    0,
  ) / repositories.length;

const productionReadiness =
  repositories.reduce(
    (sum, repository) =>
      sum + repository.productionScore,
    0,
  ) / repositories.length;

const securityReadiness =
  repositories.reduce(
    (sum, repository) =>
      sum + repository.securityScore,
    0,
  ) / repositories.length;

const enterpriseReadiness =
  repositories.reduce(
    (sum, repository) =>
      sum + repository.enterpriseReadiness,
    0,
  ) / repositories.length;

const hiringReadiness =
  repositories.reduce(
    (sum, repository) =>
      sum +
      repository.recruiterIntelligence.hiringScore,
    0,
  ) / repositories.length;
  const overallScore = Math.round(

  engineeringMaturity * 0.25 +

  productionReadiness * 0.20 +

  securityReadiness * 0.20 +

  enterpriseReadiness * 0.20 +

  hiringReadiness * 0.15,

);
const portfolioGrade =
  overallScore >= 90
    ? "A+"
    : overallScore >= 80
    ? "A"
    : overallScore >= 70
    ? "B"
    : overallScore >= 60
    ? "C"
    : "D";
const portfolioRisk:
  "Low" | "Medium" | "High" =
  overallScore >= 85
    ? "Low"
    : overallScore >= 65
    ? "Medium"
    : "High";
    return {

  overallScore,

  engineeringMaturity,

  productionReadiness,

  securityReadiness,

  enterpriseReadiness,

  hiringReadiness,

  portfolioGrade,

  portfolioRisk,

};

}