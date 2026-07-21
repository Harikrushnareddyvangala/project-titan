import type { RepositoryAnalytics, } from "@/types/github";

export interface ProjectInsights {

  executiveSummary: string;

  strengths: string[];

  risks: string[];

  recommendations: string[];

  hiringSignal: string;

  enterpriseSummary: string;

}

export function buildProjectInsights(

  analytics: RepositoryAnalytics,

): ProjectInsights {

  const strengths: string[] = [];

  const risks: string[] = [];

  const recommendations: string[] = [];

  //----------------------------------
  // Strengths
  //----------------------------------

  if (analytics.engineeringScore >= 85)
    strengths.push(
      "Excellent engineering quality.",
    );

  if (analytics.codeQuality >= 85)
    strengths.push(
      "High code quality standards.",
    );

  if (analytics.teamHealth >= 80)
    strengths.push(
      "Healthy contributor ecosystem.",
    );

  if (analytics.releaseReadiness >= 85)
    strengths.push(
      "Strong release readiness.",
    );

  if (analytics.enterpriseReadiness >= 85)
    strengths.push(
      "Enterprise-ready architecture.",
    );

  //----------------------------------
  // Risks
  //----------------------------------

  if (analytics.busFactor <= 1)
    risks.push(
      "Repository depends heavily on one engineer.",
    );

  if (analytics.documentationQuality < 70)
    risks.push(
      "Documentation could limit onboarding.",
    );

  if (analytics.activityTrend === "Declining")
    risks.push(
      "Development momentum is slowing.",
    );

  if (analytics.securityScore < 75)
    risks.push(
      "Security maturity requires attention.",
    );

  //----------------------------------
  // Recommendations
  //----------------------------------

  if (analytics.documentationQuality < 80)
    recommendations.push(
      "Improve technical documentation.",
    );

  if (analytics.teamHealth < 80)
    recommendations.push(
      "Increase contributor diversity.",
    );

  if (analytics.codeQuality < 80)
    recommendations.push(
      "Expand testing and code reviews.",
    );

  if (analytics.releaseReadiness < 80)
    recommendations.push(
      "Increase development stability before deployment.",
    );

  //----------------------------------
  // Hiring Signal
  //----------------------------------

  let hiringSignal = "Good";

  if (

    analytics.engineeringScore >= 90 &&

    analytics.enterpriseReadiness >= 90

  ){

    hiringSignal = "Outstanding";

  }

  else if(

    analytics.engineeringScore >= 80

  ){

    hiringSignal = "Excellent";

  }

  //----------------------------------
  // Executive Summary
  //----------------------------------

  const executiveSummary =

`This repository demonstrates ${analytics.repositoryGrade} engineering maturity with ${analytics.activityTrend.toLowerCase()} development activity, ${analytics.enterpriseReadiness}% enterprise readiness, and ${analytics.teamHealth}% team health.`;

  //----------------------------------
  // Enterprise Summary
  //----------------------------------

  const enterpriseSummary =

`Engineering score ${analytics.engineeringScore}%, release readiness ${analytics.releaseReadiness}%, and code quality ${analytics.codeQuality}% indicate ${analytics.repositoryGrade}-grade software engineering practices.`;

  return {

    executiveSummary,

    strengths,

    risks,

    recommendations,

    hiringSignal,

    enterpriseSummary,

  };

}