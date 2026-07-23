import type {
  Recommendation,
} from "@/types/github";

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

}: RecommendationInput): Recommendation[] {

  const recommendations: Recommendation[] = [];

  //------------------------------------
  // Issues
  //------------------------------------

  if (issues > 10) {

    recommendations.push({

      title: "Repository Maintenance",

      description:
        "Reduce open issues to improve maintainability.",

    });

  }

  //------------------------------------
  // Stars
  //------------------------------------

  if (stars < 20) {

    recommendations.push({

      title: "Visibility",

      description:
        "Increase repository visibility using a stronger README and project demonstrations.",

    });

  }

  //------------------------------------
  // Watchers
  //------------------------------------

  if (watchers < 5) {

    recommendations.push({

      title: "Community",

      description:
        "Increase community engagement by encouraging discussions and stars.",

    });

  }

  //------------------------------------
  // Forks
  //------------------------------------

  if (forks < 3) {

    recommendations.push({

      title: "Open Source",

      description:
        "Encourage external contributors through issues and pull requests.",

    });

  }

  //------------------------------------
  // Languages
  //------------------------------------

  if (languageCount === 1) {

    recommendations.push({

      title: "Architecture",

      description:
        "Consider improving tooling and project modularity.",

    });

  }

  //------------------------------------
  // Contributors
  //------------------------------------

  if (contributorCount <= 1) {

    recommendations.push({

      title: "Collaboration",

      description:
        "Repository depends heavily on a single contributor.",

    });

  }

  //------------------------------------
  // Commits
  //------------------------------------

  if (recentCommits < 10) {

    recommendations.push({

      title: "Development",

      description:
        "Development activity has slowed during the last month.",

    });

  }

  //------------------------------------
  // Inactivity
  //------------------------------------

  if (inactiveDays > 90) {

    recommendations.push({

      title: "Maintenance",

      description:
        "Repository appears inactive. Consider regular maintenance updates.",

    });

  }

  //------------------------------------
  // Excellent
  //------------------------------------

  if (recommendations.length === 0) {

    recommendations.push({

      title: "Excellent",

      description:
        "Excellent repository health.",

    });

  }

  return recommendations;

}