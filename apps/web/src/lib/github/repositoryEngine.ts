import type {
  GithubRepository,
  GithubLanguages,
  GithubCommitWeek,
  GithubContributor,
} from "@/types/github";

import {
  buildRepositoryMetrics,
} from "./analyticsEngine";

import {
  buildTechnologyStack,
} from "./technologyEngine";

import {
  buildRepositoryScores,
} from "./scoringEngine";

import {
  buildRepositoryRecommendations,
} from "./recommendationEngine";

import {

  buildSecurityAnalysis,

} from "./securityEngine";

export function buildRepositoryAnalytics({
  repository,
  languages,
  commitActivity,
  contributors,
}: {
  repository: GithubRepository;
  languages: GithubLanguages;
  commitActivity: GithubCommitWeek[];
  contributors: GithubContributor[];
}) {

  //----------------------------------------
  // Metrics
  //----------------------------------------

  const metrics = buildRepositoryMetrics({
    repository,
    languages,
    commitActivity,
    contributors,
  });

  //----------------------------------------
  // Technology
  //----------------------------------------

  const technology = buildTechnologyStack({
    description:
      repository.description ?? "",

    topics:
      repository.topics ?? [],

    languages:
      Object.keys(languages),
  });

  //----------------------------------------
  // Scores
  //----------------------------------------

  const scores = buildRepositoryScores({
    engineeringInputs: {
      stars:
        repository.stargazers_count,

      forks:
        repository.forks_count,

      watchers:
        repository.watchers_count,

      issues:
        repository.open_issues_count,

      repositoryAge:
        metrics.repositoryAge,

      languageCount:
        metrics.languageCount,

      contributorCount:
        metrics.contributorCount,

      commitsPerWeek:
        metrics.commitsPerWeek,

      recentCommits:
        metrics.recentCommits,

      inactiveDays:
        metrics.inactiveDays,
    },
  });

  const security = buildSecurityAnalysis({

  hasLicense:

    repository.license !== null,

  archived:

    repository.archived,

  hasWiki:

    repository.has_wiki,

  hasProjects:

    repository.has_projects,

  hasIssues:

    repository.has_issues,

  productionScore:

    scores.productionScore,

});

  //----------------------------------------
  // Recommendations
  //----------------------------------------

  const recommendations =
    buildRepositoryRecommendations({

      stars:
        repository.stargazers_count,

      forks:
        repository.forks_count,

      watchers:
        repository.watchers_count,

      issues:
        repository.open_issues_count,

      inactiveDays:
        metrics.inactiveDays,

      languageCount:
        metrics.languageCount,

      contributorCount:
        metrics.contributorCount,

      recentCommits:
        metrics.recentCommits,

    });

  //----------------------------------------

  return {

    ...metrics,

    ...technology,

    ...scores,

    ...security,

    recommendations,

  };

}