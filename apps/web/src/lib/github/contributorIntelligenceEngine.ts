import type { GithubContributor, } from "@/types/github";

export interface ContributorIntelligence {

  busFactor: number;

  collaborationIndex: number;

  teamHealth: number;

  topContributorShare: number;

  contributorDistribution: string;

}

export function buildContributorIntelligence(

  contributors: GithubContributor[],

): ContributorIntelligence {

  if (contributors.length === 0) {

    return {

      busFactor: 0,

      collaborationIndex: 0,

      teamHealth: 0,

      topContributorShare: 0,

      contributorDistribution: "Unknown",

    };

  }

  //----------------------------------------
  // Total commits
  //----------------------------------------

  const totalCommits = contributors.reduce(

    (sum, contributor) =>

      sum + contributor.contributions,

    0,

  );

  //----------------------------------------
  // Top contributor
  //----------------------------------------

  const topContributor =

    contributors[0]?.contributions ?? 0;

  const topContributorShare = Math.round(

    (topContributor / totalCommits) * 100,

  );

  //----------------------------------------
  // Bus Factor
  //----------------------------------------

  let cumulative = 0;

  let busFactor = 0;

  for (const contributor of contributors) {

    cumulative += contributor.contributions;

    busFactor++;

    if (

      cumulative / totalCommits >= 0.5

    ) {

      break;

    }

  }

  //----------------------------------------
  // Collaboration
  //----------------------------------------

  const collaborationIndex = Math.min(

    contributors.length * 12,

    100,

  );

  //----------------------------------------
  // Team Health
  //----------------------------------------

  let teamHealth = 100;

  if (topContributorShare > 80)

    teamHealth -= 35;

  else if (topContributorShare > 60)

    teamHealth -= 20;

  else if (topContributorShare > 40)

    teamHealth -= 10;

  teamHealth += Math.min(

    contributors.length,

    10,

  );

  teamHealth = Math.max(

    0,

    Math.min(

      100,

      teamHealth,

    ),

  );

  //----------------------------------------
  // Distribution
  //----------------------------------------

  let contributorDistribution =

    "Balanced";

  if (topContributorShare > 80)

    contributorDistribution =

      "Highly Centralized";

  else if (topContributorShare > 60)

    contributorDistribution =

      "Centralized";

  else if (topContributorShare > 40)

    contributorDistribution =

      "Moderately Distributed";

  return {

    busFactor,

    collaborationIndex,

    teamHealth,

    topContributorShare,

    contributorDistribution,

  };

}