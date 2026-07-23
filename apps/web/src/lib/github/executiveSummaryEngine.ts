import type {
  PortfolioAnalytics,
} from "@/types/github";

export interface ExecutiveSummary {

  headline: string;

  summary: string;

  strengths: string[];

  improvements: string[];

  recommendation: string;

}

export function buildExecutiveSummary(

  portfolio: PortfolioAnalytics,

): ExecutiveSummary {

  const strengths: string[] = [];

  const improvements: string[] = [];

  //------------------------------------
  // Strengths
  //------------------------------------

  if (portfolio.averageEngineeringScore >= 90) {

    strengths.push(
      "Excellent engineering quality."
    );

  }

  if (portfolio.enterpriseReadiness >= 90) {

    strengths.push(
      "Enterprise-ready architecture."
    );

  }

  if (portfolio.totalRepositories >= 5) {

    strengths.push(
      "Strong project diversity."
    );

  }

  //------------------------------------
  // Improvements
  //------------------------------------

  if (portfolio.averageHealthScore < 80) {

    improvements.push(
      "Repository maintenance should improve."
    );

  }

  if (portfolio.totalRepositories < 5) {

    improvements.push(
      "Expand the portfolio with additional projects."
    );

  }

  if (portfolio.averageProductionScore < 85) {

    improvements.push(
      "Production readiness can be strengthened."
    );

  }

  //------------------------------------
  // Headline
  //------------------------------------

  let headline =
    "Strong Engineering Portfolio";

  if (portfolio.enterpriseReadiness >= 95) {

    headline =
      "Enterprise Engineering Excellence";

  }

  //------------------------------------
  // Recommendation
  //------------------------------------

  let recommendation =
    "Suitable for Senior Software Engineering positions.";

  if (portfolio.enterpriseReadiness >= 90) {

    recommendation =
      "Strong candidate for Staff Engineer or Technical Lead roles.";

  }

  if (portfolio.enterpriseReadiness >= 95) {

    recommendation =
      "Suitable for Principal Engineer and Engineering Manager opportunities.";

  }

  //------------------------------------

  return {

    headline,

    summary:

      `This portfolio contains ${portfolio.totalRepositories} repositories with an overall engineering readiness of ${portfolio.enterpriseReadiness}%.`,

    strengths,

    improvements,

    recommendation,

  };

}