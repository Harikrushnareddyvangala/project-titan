export interface RepositoryScoreInput {

  engineeringInputs: {

    stars: number;

    forks: number;

    watchers: number;

    issues: number;

    repositoryAge: number;

    languageCount: number;

    contributorCount: number;

    commitsPerWeek: number;

    recentCommits: number;

    inactiveDays: number;

  };

}

export interface RepositoryScores {

  engineeringScore: number;

  healthScore: number;

  productionScore: number;

  riskLevel: string;

  quality: string;

  deploymentReady: boolean;

}

export function buildRepositoryScores({

  engineeringInputs,

}: RepositoryScoreInput): RepositoryScores {

  const {

    stars,

    forks,

    watchers,

    issues,

    repositoryAge,

    languageCount,

    contributorCount,

    commitsPerWeek,

    recentCommits,

    inactiveDays,

  } = engineeringInputs;

  //----------------------------------------------------
  // Engineering Score
  //----------------------------------------------------

  let engineeringScore = 0;

  engineeringScore += Math.min(stars, 25);

  engineeringScore += Math.min(forks * 2, 20);

  engineeringScore += Math.min(watchers, 10);

  engineeringScore += Math.min(languageCount * 4, 12);

  engineeringScore += Math.min(contributorCount * 3, 12);

  engineeringScore += Math.min(commitsPerWeek, 12);

  engineeringScore += Math.min(

    Math.floor(repositoryAge / 365),

    6,

  );

  engineeringScore -= Math.min(issues, 15);

  engineeringScore = Math.max(

    0,

    Math.min(

      100,

      Math.round(engineeringScore),

    ),

  );

  //----------------------------------------------------
  // Health Score
  //----------------------------------------------------

  let healthScore = 100;

  healthScore -= Math.floor(

    inactiveDays / 20,

  );

  healthScore -= issues;

  if (contributorCount < 3) {

    healthScore -= 8;

  }

  if (recentCommits < 10) {

    healthScore -= 12;

  }

  healthScore = Math.max(

    0,

    Math.min(

      100,

      healthScore,

    ),

  );

  //----------------------------------------------------
  // Production Score
  //----------------------------------------------------

  const productionScore = Math.round(

    engineeringScore * 0.45 +

    healthScore * 0.30 +

    Math.min(contributorCount * 3, 10) +

    Math.min(recentCommits / 2, 15),

  );

  //----------------------------------------------------
  // Risk
  //----------------------------------------------------

  const riskLevel =

    productionScore >= 85

      ? "Low"

      : productionScore >= 65

      ? "Medium"

      : "High";

  //----------------------------------------------------
  // Quality
  //----------------------------------------------------

  const quality =

    productionScore >= 90

      ? "Outstanding"

      : productionScore >= 80

      ? "Excellent"

      : productionScore >= 65

      ? "Good"

      : "Growing";

  //----------------------------------------------------
  // Deployment
  //----------------------------------------------------

  const deploymentReady =

    productionScore >= 80 &&

    issues < 10 &&

    inactiveDays < 90;

  return {

    engineeringScore,

    healthScore,

    productionScore,

    riskLevel,

    quality,

    deploymentReady,

  };

}