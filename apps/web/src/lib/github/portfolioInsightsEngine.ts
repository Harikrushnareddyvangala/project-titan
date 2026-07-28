import type {
  PortfolioHealth,
  RepositoryAnalytics,
} from "@/types/github";

export interface PortfolioInsights {

  strengths: string[];

  risks: string[];

  priorities: string[];

  executiveSummary: string;

}

interface PortfolioInsightsInput {

  repositories: RepositoryAnalytics[];

  portfolioHealth: PortfolioHealth;

}

export function buildPortfolioInsights({
  repositories,
  portfolioHealth,
}: PortfolioInsightsInput): PortfolioInsights {
    const strengths: string[] = [];

if (portfolioHealth.engineeringMaturity >= 85) {
  strengths.push(
    "Engineering practices are consistently strong across the portfolio.",
  );
}

if (portfolioHealth.securityReadiness >= 85) {
  strengths.push(
    "Repositories demonstrate strong security readiness.",
  );
}

if (portfolioHealth.enterpriseReadiness >= 85) {
  strengths.push(
    "Portfolio is well aligned for enterprise adoption.",
  );
}
const risks: string[] = [];

if (portfolioHealth.productionReadiness < 75) {
  risks.push(
    "Production readiness varies across repositories.",
  );
}

if (portfolioHealth.hiringReadiness < 75) {
  risks.push(
    "Engineering consistency may affect hiring perception.",
  );
}

if (repositories.length < 3) {
  risks.push(
    "Portfolio size is limited for comprehensive evaluation.",
  );
}
const priorities: string[] = [];

const rankedPriorities = [
  {
    score: portfolioHealth.securityReadiness,
    recommendation: "Increase security maturity across repositories.",
  },
  {
    score: portfolioHealth.productionReadiness,
    recommendation: "Improve production readiness before scaling.",
  },
  {
    score: portfolioHealth.enterpriseReadiness,
    recommendation: "Strengthen enterprise architecture consistency.",
  },
  {
    score: portfolioHealth.engineeringMaturity,
    recommendation: "Standardize engineering practices across projects.",
  },
  {
    score: portfolioHealth.hiringReadiness,
    recommendation: "Improve repository quality for recruiter evaluation.",
  },
];

rankedPriorities
  .sort((a, b) => a.score - b.score)
  .slice(0, 3)
  .forEach((item) => priorities.push(item.recommendation));
const executiveSummary =
  `The engineering portfolio demonstrates ${portfolioHealth.portfolioGrade} maturity with an overall score of ${portfolioHealth.overallScore}. Current portfolio risk is ${portfolioHealth.portfolioRisk.toLowerCase()}.`;
  
  
  return {

  strengths,

  risks,

  priorities,

  executiveSummary,

};

}