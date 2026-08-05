import type {

  EngineeringQualityIntelligence,
  EngineeringQualitySummary,
  MaintainabilityAnalysis,
  TechnicalDebtAnalysis,
  ComplexityAnalysis,
  RefactoringOpportunity,

} from "@/types/quality";

import type {

  RepositoryComparison,

} from "@/types/github";

export function buildEngineeringQuality(

  comparison: RepositoryComparison,

): EngineeringQualityIntelligence {

  const maintainability =
    buildMaintainability(
      comparison,
    );

  const technicalDebt =
    buildTechnicalDebt(
      comparison,
    );

  const complexity =
    buildComplexity(
      comparison,
    );

  const opportunities =
    buildRefactoringOpportunities(
      comparison,
    );

  const summary =
    buildQualitySummary({

      maintainability,

      technicalDebt,

      complexity,

      opportunities,

    });

  return {

    maintainability,

    technicalDebt,

    complexity,

    opportunities,

    summary,

  };

}

function buildMaintainability(

  comparison: RepositoryComparison,

): MaintainabilityAnalysis {

  const score =
    comparison.averageEngineeringScore;

  const level =
    score >= 90
      ? "Excellent"
      : score >= 75
      ? "Good"
      : score >= 60
      ? "Fair"
      : "Poor";

  const strengths: string[] = [];

  const weaknesses: string[] = [];

  if (score >= 85) {

    strengths.push(
      "Engineering practices are consistently applied across repositories.",
    );

  }

  if (comparison.averageSecurityScore >= 80) {

    strengths.push(
      "Security posture contributes positively to long-term maintainability.",
    );

  }

  if (score < 75) {

    weaknesses.push(
      "Engineering consistency should be improved across repositories.",
    );

  }

  if (comparison.averageEnterpriseReadiness < 70) {

    weaknesses.push(
      "Enterprise readiness should be strengthened to improve maintainability.",
    );

  }

  return {

    score,

    level,

    strengths,

    weaknesses,

  };

}

function buildTechnicalDebt(

  comparison: RepositoryComparison,

): TechnicalDebtAnalysis {

  const engineering =
    comparison.averageEngineeringScore;

  const enterprise =
    comparison.averageEnterpriseReadiness;

  const security =
    comparison.averageSecurityScore;

  const score =
    Math.round(
      (
        engineering +
        enterprise +
        security
      ) / 3,
    );

  const level =
    score >= 90
      ? "Very Low"
      : score >= 80
      ? "Low"
      : score >= 65
      ? "Moderate"
      : score >= 50
      ? "High"
      : "Critical";

  const debtDrivers: string[] = [];

  if (engineering < 75) {

    debtDrivers.push(
      "Engineering consistency requires improvement.",
    );

  }

  if (enterprise < 70) {

    debtDrivers.push(
      "Enterprise readiness is below the desired maturity level.",
    );

  }

  if (security < 75) {

    debtDrivers.push(
      "Security maturity contributes to technical debt.",
    );

  }

  if (debtDrivers.length === 0) {

    debtDrivers.push(
      "No significant technical debt indicators detected.",
    );

  }

  const estimatedRefactoringEffort =
    level === "Very Low"
      ? "Minimal"
      : level === "Low"
      ? "Small"
      : level === "Moderate"
      ? "Medium"
      : level === "High"
      ? "Large"
      : "Extensive";

  return {

    score,

    level,

    estimatedRefactoringEffort,

    debtDrivers,

  };

}

function buildComplexity(

  comparison: RepositoryComparison,

): ComplexityAnalysis {

  const score =
    Math.round(
      (
        comparison.averageEngineeringScore +
        comparison.averageEnterpriseReadiness
      ) / 2,
    );

  const hotspots: string[] = [];

  const recommendations: string[] = [];

  if (
    comparison.averageEngineeringScore < 75
  ) {

    hotspots.push(
      "Engineering consistency across repositories.",
    );

    recommendations.push(
      "Standardize engineering practices and coding conventions.",
    );

  }

  if (
    comparison.averageEnterpriseReadiness < 70
  ) {

    hotspots.push(
      "Enterprise architecture maturity.",
    );

    recommendations.push(
      "Improve architectural documentation and modularization.",
    );

  }

  if (
    comparison.averageSecurityScore < 75
  ) {

    hotspots.push(
      "Security engineering processes.",
    );

    recommendations.push(
      "Strengthen secure engineering practices.",
    );

  }

  if (hotspots.length === 0) {

    hotspots.push(
      "No significant engineering complexity hotspots detected.",
    );

    recommendations.push(
      "Continue monitoring engineering quality while maintaining existing standards.",
    );

  }

  return {

    score,

    hotspots,

    recommendations,

  };

}

function buildRefactoringOpportunities(

  comparison: RepositoryComparison,

): RefactoringOpportunity[] {

  const opportunities: RefactoringOpportunity[] = [];

  if (
    comparison.averageEngineeringScore < 75
  ) {

    opportunities.push({

      title:
        "Standardize Engineering Practices",

      description:
        "Improve consistency by introducing shared engineering standards, reusable components, and common development workflows.",

      impact:
        "High",

    });

  }

  if (
    comparison.averageEnterpriseReadiness < 70
  ) {

    opportunities.push({

      title:
        "Improve Enterprise Architecture",

      description:
        "Increase modularization, architectural documentation, and service boundaries to improve long-term maintainability.",

      impact:
        "High",

    });

  }

  if (
    comparison.averageSecurityScore < 75
  ) {

    opportunities.push({

      title:
        "Strengthen Security Engineering",

      description:
        "Address security engineering gaps through secure development practices, automated validation, and dependency reviews.",

      impact:
        "Medium",

    });

  }

  if (
    comparison.averageHiringScore < 75
  ) {

    opportunities.push({

      title:
        "Improve Repository Readability",

      description:
        "Improve documentation, project structure, and onboarding experience to increase hiring readiness.",

      impact:
        "Medium",

    });

  }

  if (
    opportunities.length === 0
  ) {

    opportunities.push({

      title:
        "Maintain Current Engineering Standards",

      description:
        "Engineering quality is healthy. Continue monitoring the portfolio and apply continuous improvement practices.",

      impact:
        "Low",

    });

  }

  return opportunities;

}

function buildQualitySummary(

  input: {

    maintainability: MaintainabilityAnalysis;

    technicalDebt: TechnicalDebtAnalysis;

    complexity: ComplexityAnalysis;

    opportunities: RefactoringOpportunity[];

  },

): EngineeringQualitySummary {

  const overallScore =
    Math.round(
      (
        input.maintainability.score +
        input.technicalDebt.score +
        input.complexity.score
      ) / 3,
    );

  const qualityGrade =
    overallScore >= 95
      ? "A+"
      : overallScore >= 90
      ? "A"
      : overallScore >= 80
      ? "B+"
      : overallScore >= 70
      ? "B"
      : overallScore >= 60
      ? "C"
      : "D";

  const executiveSummary =
    `Engineering quality is assessed as ${qualityGrade} with an overall score of ${overallScore}. ` +
    `The portfolio contains ${input.opportunities.length} prioritized refactoring opportunit${
      input.opportunities.length === 1 ? "y" : "ies"
    }. ` +
    `Maintainability is ${input.maintainability.level.toLowerCase()} while technical debt is ${input.technicalDebt.level.toLowerCase()}.`;

  return {

    overallScore,

    qualityGrade,

    executiveSummary,

  };

}