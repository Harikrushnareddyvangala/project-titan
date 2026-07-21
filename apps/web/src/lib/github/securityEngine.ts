export interface SecurityAnalysisInput {

  hasLicense: boolean;

  archived: boolean;

  hasWiki: boolean;

  hasProjects: boolean;

  hasIssues: boolean;

  productionScore: number;

}

export interface SecurityResult {

  securityScore: number;

  devopsScore: number;

  hasLicense: boolean;

  archived: boolean;

}

export function buildSecurityAnalysis({

  hasLicense,

  archived,

  hasWiki,

  hasProjects,

  hasIssues,

  productionScore,

}: SecurityAnalysisInput): SecurityResult {

  let securityScore = 100;

  if (!hasLicense) {
    securityScore -= 15;
  }

  if (archived) {
    securityScore -= 40;
  }

  if (!hasIssues) {
    securityScore -= 15;
  }

  if (!hasProjects) {
    securityScore -= 10;
  }

  if (!hasWiki) {
    securityScore -= 5;
  }

  securityScore = Math.max(
    0,
    Math.min(100, securityScore),
  );

  const devopsScore = Math.round(
    productionScore * 0.55 +
    securityScore * 0.45,
  );

  return {

    securityScore,

    devopsScore,

    hasLicense,

    archived,

  };

}