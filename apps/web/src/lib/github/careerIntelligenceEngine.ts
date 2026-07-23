export interface CareerIntelligence {

  careerStage:
    | "Early Career"
    | "Growing Engineer"
    | "Senior Engineer"
    | "Technical Leader"
    | "Engineering Executive";

  promotionReadiness: number;

  marketDemand: number;

  leadershipPotential: number;

  careerRisk: number;

  estimatedMarketValue: string;

  nextCareerStep: string;

  executiveSummary: string;

}

export interface CareerInput {

  engineeringScore: number;

  enterpriseReadiness: number;

  hiringScore: number;

  architectureScore: number;

  collaborationScore: number;

  innovationScore: number;

}

export function buildCareerIntelligence({

  engineeringScore,

  enterpriseReadiness,

  hiringScore,

  architectureScore,

  collaborationScore,

  innovationScore,

}: CareerInput): CareerIntelligence {

  const promotionReadiness =
    Math.round(

      (engineeringScore +
      enterpriseReadiness +
      architectureScore) / 3

    );

  const marketDemand =
    Math.round(

      (engineeringScore +
      hiringScore +
      innovationScore) / 3

    );

  const leadershipPotential =
    Math.round(

      (collaborationScore +
      architectureScore +
      enterpriseReadiness) / 3

    );

  const careerRisk =
    Math.max(

      5,

      100 - marketDemand

    );

  let careerStage:

    CareerIntelligence["careerStage"];

  if (marketDemand >= 95)

    careerStage = "Engineering Executive";

  else if (marketDemand >= 90)

    careerStage = "Technical Leader";

  else if (marketDemand >= 80)

    careerStage = "Senior Engineer";

  else if (marketDemand >= 65)

    careerStage = "Growing Engineer";

  else

    careerStage = "Early Career";

  let estimatedMarketValue = "";

  if (marketDemand >= 95)

    estimatedMarketValue = "$220k+";

  else if (marketDemand >= 90)

    estimatedMarketValue = "$180k-$220k";

  else if (marketDemand >= 80)

    estimatedMarketValue = "$140k-$180k";

  else if (marketDemand >= 65)

    estimatedMarketValue = "$90k-$140k";

  else

    estimatedMarketValue = "<$90k";

  let nextCareerStep = "";

  switch (careerStage) {

    case "Engineering Executive":

      nextCareerStep =
        "Lead organization-wide engineering strategy.";

      break;

    case "Technical Leader":

      nextCareerStep =
        "Own large-scale platform architecture.";

      break;

    case "Senior Engineer":

      nextCareerStep =
        "Mentor engineers and lead complex projects.";

      break;

    case "Growing Engineer":

      nextCareerStep =
        "Expand architectural and leadership skills.";

      break;

    default:

      nextCareerStep =
        "Focus on engineering fundamentals and portfolio growth.";

  }

  return {

    careerStage,

    promotionReadiness,

    marketDemand,

    leadershipPotential,

    careerRisk,

    estimatedMarketValue,

    nextCareerStep,

    executiveSummary:

      `${careerStage} demonstrating ${marketDemand}% market demand with strong long-term growth potential.`,

  };

}