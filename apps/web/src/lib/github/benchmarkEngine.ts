export interface BenchmarkInput {

  engineeringScore: number;

  healthScore: number;

  productionScore: number;

  securityScore: number;

  devopsScore: number;

  codeQuality: number;

  enterpriseReadiness: number;

  teamHealth: number;

}

export interface BenchmarkResult {

  benchmarkEngineering: number;

  benchmarkSecurity: number;

  benchmarkDevOps: number;

  benchmarkCodeQuality: number;

  benchmarkEnterprise: number;

  engineeringGap: number;

  securityGap: number;

  devopsGap: number;

  codeQualityGap: number;

  enterpriseGap: number;

  overallBenchmarkScore: number;

  enterprisePercentile: number;

  overallRanking: string;

  benchmarkSummary: string;

}

const ENTERPRISE_BASELINE = {

  engineering: 80,

  security: 78,

  devops: 75,

  codeQuality: 82,

  enterprise: 80,

};

export function buildBenchmarkAnalysis(

  input: BenchmarkInput,

): BenchmarkResult {

  const engineeringGap =
    input.engineeringScore -
    ENTERPRISE_BASELINE.engineering;

  const securityGap =
    input.securityScore -
    ENTERPRISE_BASELINE.security;

  const devopsGap =
    input.devopsScore -
    ENTERPRISE_BASELINE.devops;

  const codeQualityGap =
    input.codeQuality -
    ENTERPRISE_BASELINE.codeQuality;

  const enterpriseGap =
    input.enterpriseReadiness -
    ENTERPRISE_BASELINE.enterprise;

  const overallBenchmarkScore = Math.round(

    (

      input.engineeringScore +

      input.securityScore +

      input.devopsScore +

      input.codeQuality +

      input.enterpriseReadiness +

      input.teamHealth

    ) / 6,

  );

  let enterprisePercentile = 50;

  if (overallBenchmarkScore >= 95)
    enterprisePercentile = 99;

  else if (overallBenchmarkScore >= 90)
    enterprisePercentile = 97;

  else if (overallBenchmarkScore >= 85)
    enterprisePercentile = 94;

  else if (overallBenchmarkScore >= 80)
    enterprisePercentile = 90;

  else if (overallBenchmarkScore >= 75)
    enterprisePercentile = 82;

  else if (overallBenchmarkScore >= 70)
    enterprisePercentile = 70;

  let overallRanking = "Average";

  if (enterprisePercentile >= 98)
    overallRanking = "Top 1%";

  else if (enterprisePercentile >= 95)
    overallRanking = "Top 5%";

  else if (enterprisePercentile >= 90)
    overallRanking = "Top 10%";

  else if (enterprisePercentile >= 80)
    overallRanking = "Above Average";

  let benchmarkSummary =

    "Repository meets enterprise engineering standards.";

  if (overallBenchmarkScore >= 95) {

    benchmarkSummary =
      "Repository significantly exceeds enterprise software engineering standards.";

  }

  else if (overallBenchmarkScore >= 85) {

    benchmarkSummary =
      "Repository performs above enterprise engineering expectations.";

  }

  else if (overallBenchmarkScore < 70) {

    benchmarkSummary =
      "Repository requires additional engineering improvements before enterprise deployment.";

  }

  return {

    benchmarkEngineering:
      ENTERPRISE_BASELINE.engineering,

    benchmarkSecurity:
      ENTERPRISE_BASELINE.security,

    benchmarkDevOps:
      ENTERPRISE_BASELINE.devops,

    benchmarkCodeQuality:
      ENTERPRISE_BASELINE.codeQuality,

    benchmarkEnterprise:
      ENTERPRISE_BASELINE.enterprise,

    engineeringGap,

    securityGap,

    devopsGap,

    codeQualityGap,

    enterpriseGap,

    overallBenchmarkScore,

    enterprisePercentile,

    overallRanking,

    benchmarkSummary,

  };

}