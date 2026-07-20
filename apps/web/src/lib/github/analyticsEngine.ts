import type {
  GithubRepository,
  GithubLanguages,
  GithubCommitWeek,
  GithubContributor,
} from "@/types/github";

export interface RepositoryMetrics {
  repositoryAge: number;
  inactiveDays: number;

  languageCount: number;

  contributorCount: number;

  totalCommits: number;

  recentCommits: number;

  commitsPerWeek: number;
}

export interface AnalyticsEngineInput {
  repository: GithubRepository;

  languages: GithubLanguages;

  commitActivity: GithubCommitWeek[];

  contributors: GithubContributor[];
}

const DAY = 1000 * 60 * 60 * 24;

export function buildRepositoryMetrics(
  input: AnalyticsEngineInput,
): RepositoryMetrics {

  const {
    repository,
    languages,
    commitActivity,
    contributors,
  } = input;

  //----------------------------------------------------
  // Repository Dates
  //----------------------------------------------------

  const now = new Date();

  const created = new Date(
    repository.created_at,
  );

  const updated = new Date(
    repository.updated_at,
  );

  const repositoryAge = Math.floor(

    (now.getTime() - created.getTime()) /

      DAY,

  );

  const inactiveDays = Math.floor(

    (now.getTime() - updated.getTime()) /

      DAY,

  );

  //----------------------------------------------------
  // Languages
  //----------------------------------------------------

  const languageCount =
    Object.keys(languages).length;

  //----------------------------------------------------
  // Contributors
  //----------------------------------------------------

  const contributorCount =
    contributors.length;

  //----------------------------------------------------
  // Total Commits
  //----------------------------------------------------

  const totalCommits =
    commitActivity.reduce(

      (sum, week) => sum + week.total,

      0,

    );

  //----------------------------------------------------
  // Last 4 Weeks
  //----------------------------------------------------

  const recentCommits =
    commitActivity

      .slice(-4)

      .reduce(

        (sum, week) => sum + week.total,

        0,

      );

  //----------------------------------------------------
  // Average Commits
  //----------------------------------------------------

  const commitsPerWeek =

    Math.round(

      totalCommits /

        Math.max(commitActivity.length, 1),

    );

  //----------------------------------------------------

  return {

    repositoryAge,

    inactiveDays,

    languageCount,

    contributorCount,

    totalCommits,

    recentCommits,

    commitsPerWeek,

  };

}