import type { Recommendation } from "@/types/github";

export interface ExecutiveEngineeringReport {

  title: string;

  summary: string;

  engineeringVerdict: string;

  recruiterVerdict: string;

  enterpriseVerdict: string;

  strengths: string[];

  concerns: string[];

  recommendations: Recommendation[];

}

export interface ExecutiveReportInput {

  repositoryName: string;

  engineeringScore: number;

  productionScore: number;

  securityScore: number;

  codeQuality: number;

  documentationQuality: number;

  enterpriseReadiness: number;

  collaborationIndex: number;

  teamHealth: number;

  benchmarkSummary: string;

  executiveSummary: string;

  recommendations: Recommendation[];

}

export function buildExecutiveEngineeringReport({

  repositoryName,

  engineeringScore,

  productionScore,

  securityScore,

  codeQuality,

  documentationQuality,

  enterpriseReadiness,

  collaborationIndex,

  teamHealth,

  benchmarkSummary,

  executiveSummary,

  recommendations,

}: ExecutiveReportInput): ExecutiveEngineeringReport {

  //-------------------------------------------------------
  // Engineering Verdict
  //-------------------------------------------------------

  let engineeringVerdict = "";

  if (engineeringScore >= 95) {

    engineeringVerdict =
      "World-class engineering quality.";

  } else if (engineeringScore >= 90) {

    engineeringVerdict =
      "Enterprise-grade engineering.";

  } else if (engineeringScore >= 80) {

    engineeringVerdict =
      "Production-ready engineering.";

  } else {

    engineeringVerdict =
      "Growing engineering maturity.";

  }

  //-------------------------------------------------------
  // Recruiter Verdict
  //-------------------------------------------------------

  let recruiterVerdict = "";

  if (
    engineeringScore >= 90 &&
    enterpriseReadiness >= 90
  ) {

    recruiterVerdict =
      "Excellent portfolio project demonstrating senior software engineering capability.";

  } else if (
    engineeringScore >= 80
  ) {

    recruiterVerdict =
      "Strong project suitable for mid-level engineering positions.";

  } else {

    recruiterVerdict =
      "Good learning project with clear growth potential.";

  }

  //-------------------------------------------------------
  // Enterprise Verdict
  //-------------------------------------------------------

  let enterpriseVerdict = "";

  if (
    productionScore >= 90 &&
    securityScore >= 90
  ) {

    enterpriseVerdict =
      "Suitable for enterprise deployment.";

  } else if (
    productionScore >= 80
  ) {

    enterpriseVerdict =
      "Suitable for production after minor improvements.";

  } else {

    enterpriseVerdict =
      "Requires additional production hardening.";

  }

  //-------------------------------------------------------
  // Strengths
  //-------------------------------------------------------

  const strengths: string[] = [];

  if (engineeringScore >= 90)
    strengths.push("Excellent engineering practices.");

  if (securityScore >= 90)
    strengths.push("Strong security posture.");

  if (productionScore >= 90)
    strengths.push("Production-ready architecture.");

  if (codeQuality >= 90)
    strengths.push("High-quality codebase.");

  if (documentationQuality >= 85)
    strengths.push("Well-documented project.");

  if (teamHealth >= 80)
    strengths.push("Healthy contributor ecosystem.");

  if (collaborationIndex >= 80)
    strengths.push("Strong collaboration indicators.");

  //-------------------------------------------------------
  // Concerns
  //-------------------------------------------------------

  const concerns: string[] = [];

  if (securityScore < 70)
    concerns.push("Security practices require improvement.");

  if (productionScore < 70)
    concerns.push("Production readiness is limited.");

  if (documentationQuality < 60)
    concerns.push("Documentation coverage is insufficient.");

  if (teamHealth < 60)
    concerns.push("Contributor ecosystem is limited.");

  if (collaborationIndex < 60)
    concerns.push("Collaboration signals are weak.");

  //-------------------------------------------------------
  // Summary
  //-------------------------------------------------------

  const summary =

`${repositoryName} demonstrates ${engineeringVerdict.toLowerCase()} ${executiveSummary} ${benchmarkSummary}`;

  //-------------------------------------------------------

  return {

    title: "Executive Engineering Report",

    summary,

    engineeringVerdict,

    recruiterVerdict,

    enterpriseVerdict,

    strengths,

    concerns,

    recommendations,

  };

}