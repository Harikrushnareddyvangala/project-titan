export interface GithubRepository {
  id: number;

  name: string;

  full_name: string;

  description: string | null;

  html_url: string;

  homepage: string | null;

  language: string | null;

  default_branch: string;

  stargazers_count: number;

  watchers_count: number;

  forks_count: number;

  open_issues_count: number;

  subscribers_count: number;

  size: number;

  visibility: string;

  archived: boolean;

  disabled: boolean;

  created_at: string;

  updated_at: string;

  pushed_at: string;

  topics?: string[];
}

export type GithubLanguages = Record<
  string,
  number
>;

export interface GithubRepositoryResult {
  repository: GithubRepository | null;

  languages: GithubLanguages;

  loading: boolean;

  error: string | null;
}