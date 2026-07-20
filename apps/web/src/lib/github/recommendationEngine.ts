export interface RecommendationInput {

  stars: number;

  forks: number;

  watchers: number;

  issues: number;

  inactiveDays: number;

  languageCount: number;

  contributorCount: number;

  recentCommits: number;

}

export function buildRepositoryRecommendations({

  stars,

  forks,

  watchers,

  issues,

  inactiveDays,

  languageCount,

  contributorCount,

  recentCommits,

}: RecommendationInput): string[] {

  const recommendations: string[] = [];

  //------------------------------------
  // Issues
  //------------------------------------

  if (issues > 10) {

    recommendations.push(

      "Reduce open issues to improve maintainability."

    );

  }

  //------------------------------------
  // Stars
  //------------------------------------

  if (stars < 20) {

    recommendations.push(

      "Increase repository visibility using a stronger README and project demonstrations."

    );

  }

  //------------------------------------
  // Watchers
  //------------------------------------

  if (watchers < 5) {

    recommendations.push(

      "Increase community engagement."

    );

  }

  //------------------------------------
  // Forks
  //------------------------------------

  if (forks < 3) {

    recommendations.push(

      "Encourage external contributors."

    );

  }

  //------------------------------------
  // Languages
  //------------------------------------

  if (languageCount === 1) {

    recommendations.push(

      "Consider improving tooling and project modularity."

    );

  }

  //------------------------------------
  // Contributors
  //------------------------------------

  if (contributorCount <= 1) {

    recommendations.push(

      "Repository depends heavily on a single contributor."

    );

  }

  //------------------------------------
  // Commits
  //------------------------------------

  if (recentCommits < 10) {

    recommendations.push(

      "Development activity has slowed during the last month."

    );

  }

  //------------------------------------
  // Inactivity
  //------------------------------------

  if (inactiveDays > 90) {

    recommendations.push(

      "Repository appears inactive. Consider regular maintenance updates."

    );

  }

  //------------------------------------

  if (recommendations.length === 0) {

    recommendations.push(

      "Excellent repository health."

    );

  }

  return recommendations;

}