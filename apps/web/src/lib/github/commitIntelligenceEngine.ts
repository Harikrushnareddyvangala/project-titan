import type {
  GithubCommitWeek,
} from "@/types/github";

export interface CommitIntelligence {

  totalCommits: number;

  commitsPerWeek: number;

  recentCommits: number;

  developmentVelocity: number;

  developmentMomentum: number;

  engineeringStability: number;

  releaseReadiness: number;

  activityTrend: string;

}

export function buildCommitIntelligence(

  commitActivity: GithubCommitWeek[],

): CommitIntelligence {

  if (commitActivity.length === 0) {

    return {

      totalCommits: 0,

      commitsPerWeek: 0,

      recentCommits: 0,

      developmentVelocity: 0,

      developmentMomentum: 0,

      engineeringStability: 0,

      releaseReadiness: 0,

      activityTrend: "Unknown",

    };

  }

  //----------------------------------

  // Totals

  //----------------------------------

  const totalCommits = commitActivity.reduce(

    (sum, week) => sum + week.total,

    0,

  );

  const commitsPerWeek = Math.round(

    totalCommits /

    commitActivity.length,

  );

  const recentCommits = commitActivity

    .slice(-4)

    .reduce(

      (sum, week) =>

        sum + week.total,

      0,

    );

  //----------------------------------

  // Velocity

  //----------------------------------

  const developmentVelocity = Math.min(

    commitsPerWeek * 5,

    100,

  );

  //----------------------------------

  // Momentum

  //----------------------------------

  const previousFourWeeks = commitActivity

    .slice(-8, -4)

    .reduce(

      (sum, week) =>

        sum + week.total,

      0,

    );

  let activityTrend = "Stable";

  if (recentCommits > previousFourWeeks)

    activityTrend = "Increasing";

  else if (recentCommits < previousFourWeeks)

    activityTrend = "Declining";

  const developmentMomentum = Math.min(

    Math.round(

      recentCommits * 2.5,

    ),

    100,

  );

  //----------------------------------

  // Stability

  //----------------------------------

  const weeklyTotals = commitActivity.map(

    (week) => week.total,

  );

  const mean =

    totalCommits /

    commitActivity.length;

  const variance = weeklyTotals.reduce(

    (sum, value) =>

      sum +

      Math.pow(

        value - mean,

        2,

      ),

    0,

  ) / weeklyTotals.length;

  const deviation = Math.sqrt(

    variance,

  );

  const engineeringStability = Math.max(

    0,

    Math.min(

      100,

      Math.round(

        100 - deviation * 3,

      ),

    ),

  );

  //----------------------------------

  // Release Readiness

  //----------------------------------

  const releaseReadiness = Math.round(

    developmentVelocity * 0.35 +

    developmentMomentum * 0.35 +

    engineeringStability * 0.30,

  );

  return {

    totalCommits,

    commitsPerWeek,

    recentCommits,

    developmentVelocity,

    developmentMomentum,

    engineeringStability,

    releaseReadiness,

    activityTrend,

  };

}