export interface GithubRepository {
  id: number;

node_id: string;

name: string;

full_name: string;

private: boolean;

visibility: string;

html_url: string;

description: string | null;

homepage: string | null;

language: string | null;

fork: boolean;

archived: boolean;

disabled: boolean;

default_branch: string;

size: number;

stargazers_count: number;

watchers_count: number;

forks_count: number;

open_issues_count: number;

subscribers_count?: number;

network_count?: number;
has_issues: boolean;

has_projects: boolean;

has_wiki: boolean;

has_pages: boolean;

has_downloads: boolean;

has_discussions?: boolean;

topics: string[];

license: {

key: string;

name: string;

spdx_id: string;

url: string | null;

} | null;

created_at: string;

updated_at: string;

pushed_at: string;

owner: {

login: string;

avatar_url: string;

html_url: string;

type: string;

};

clone_url: string;

ssh_url: string;

git_url: string;

svn_url: string;

watchers: number;

forks: number;

open_issues: number;

is_template: boolean;

allow_forking: boolean;

web_commit_signoff_required: boolean;

analytics?: RepositoryAnalytics;
}
export interface Recommendation {
  title: string;
  description: string;
}
  
export interface RepositoryAnalytics {

  repositoryName: string;

repositoryFullName: string;

stars: number;

forks: number;

watchers: number;

issues: number;

  repositoryAge: number;

  inactiveDays: number;

  languageCount: number;

  contributorCount: number;

  engineeringScore: number;

  healthScore: number;

  productionScore: number;

  deploymentReady: boolean;

  riskLevel:
    | "Low"
    | "Medium"
    | "High";

  quality: string;
    // | "Outstanding"
    // | "Excellent"
    // | "Good"
    // | "Growing";

  maturity: string;

  recommendations: Recommendation[];

  securityScore:number;

devopsScore:number;

hasLicense:boolean;

archived:boolean;

hasWiki:boolean;

hasProjects:boolean;

hasIssues:boolean;

frontend: string;

backend: string;

database: string;

aiFramework: string;

vectorDatabase: string;

cloud: string;

packageManager: string;

frontendFramework:string;

backendFramework:string;

aiLibrary:string;

dependencyRisk:string;

technologyMaturity:string;

codeQuality: number;

documentationQuality: number;

maintainability: number;

enterpriseReadiness: number;

repositoryGrade: string;

busFactor: number;

collaborationIndex: number;

teamHealth: number;

topContributorShare: number;

contributorDistribution: string;


executiveSummary: string;

strengths: string[];

risks: string[];

hiringSignal: string; 

enterpriseSummary: string;

totalCommits: number;
commitsPerWeek: number;
recentCommits: number;
developmentVelocity: number;
developmentMomentum: number;
engineeringStability: number;
releaseReadiness: number;
activityTrend: string;

// ------------------------------------
// Enterprise Benchmark Intelligence
// ------------------------------------

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

export interface GithubCommitWeek {
  week: number;
  total: number;
  days: number[];
}

export interface GithubContributor {
  login: string;

  avatar_url: string;

  html_url: string;

  contributions: number;
}
export interface GithubRepositoryResponse {

  repository: GithubRepository;

  analytics: RepositoryAnalytics;

  languages: GithubLanguages;

  commitActivity: GithubCommitWeek[];

  contributors: GithubContributor[];

}
export interface GithubApiError {
  message: string;
  documentation_url?: string;
}

export type GithubApiResponse =
  | GithubRepositoryResponse
  | GithubApiError;
