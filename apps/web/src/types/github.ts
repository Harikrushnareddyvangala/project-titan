import type {
  PortfolioSnapshot,
  SnapshotComparison,
} from "@/lib/github/repositorySnapshotService";
import type {
  PortfolioEvolution,
} from "@/lib/github/repositoryEvolutionService";
import type {
  PortfolioHistoricalTrend,
} from "@/lib/github/repositoryHistoricalTrendService";
import type {
  PortfolioForecast,
} from "@/lib/github/repositoryForecastService";
import type {
  PortfolioRisk,
} from "@/types/risk";
import type {
  ExecutiveIntelligence,
} from "./executive";
import type {
  DecisionIntelligence,
} from "./decision";
import type {
  PlanningIntelligence,
} from "./planning";
import type {
  ExecutionIntelligence,
} from "./execution";
import type {
  AdvisorIntelligence,
} from "./advisor";
import type {
  EngineeringQualityIntelligence,
} from "./quality";
import type {
  EngineeringObservability,
} from "./observability";
import type {
  UnifiedCorrelationIntelligence,
} from "./correlation";

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

export interface AIRecommendation {

  priority:
    | "High"
    | "Medium"
    | "Low";

  category: string;

  recommendation: string;

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

aiRecommendations: AIRecommendation[];

executiveReport: ExecutiveEngineeringReport;

recruiterIntelligence: RecruiterIntelligence;

developerDNA: DeveloperDNA;

careerIntelligence: CareerIntelligence;

engineeringMentor: EngineeringMentor;

teamCompatibility: TeamCompatibility;

organizationIntelligence: OrganizationIntelligence;

}

export interface ExecutiveEngineeringReport {

  title: string;

  summary: string;

  engineeringVerdict: string;

  recruiterVerdict: string;

  enterpriseVerdict: string;

  strengths: string[];

  concerns: string[];

  recommendations: Recommendation[];

}
export interface RecruiterIntelligence {

  hiringScore: number;

  engineeringLevel:
    | "Junior"
    | "Mid-Level"
    | "Senior"
    | "Staff"
    | "Principal";

  recruiterVerdict: string;

  salaryRange: string;

  hiringConfidence: number;

  recommendedRoles: string[];

}

export type GithubLanguages = Record<
  string,
  number
>;

export interface ExecutiveSummary {

  headline: string;

  summary: string;

  strengths: string[];

  improvements: string[];

  recommendation: string;

}
export interface GithubRepositoryResult {
  repository: GithubRepository | null;

  languages: GithubLanguages;

  executiveSummary: ExecutiveSummary | null;

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

  export interface PortfolioAnalytics {

  totalRepositories: number;

  totalStars: number;

  totalForks: number;

  totalLanguages: number;

  averageEngineeringScore: number;

  averageHealthScore: number;

  averageProductionScore: number;

  strongestRepository: string;

  weakestRepository: string;

  enterpriseReadiness: number;

  portfolioGrade: string;

  totalRecommendations: number;

}

export interface PortfolioIntelligence {

  totalRepositories:number;

  totalStars:number;

  totalForks:number;

  averageEngineeringScore:number;

  averageSecurityScore:number;

  averageEnterpriseReadiness:number;

  portfolioHealth:number;

  engineeringBrand:string;

  specialization:string;

  portfolioMaturity:string;

  executiveSummary:string;

}
export interface CompletePortfolioAnalytics {

  portfolio: PortfolioAnalytics;

  intelligence: PortfolioIntelligence;

}
export interface DeveloperDNA {

  archetype:
    | "Architect"
    | "Builder"
    | "Researcher"
    | "Maintainer"
    | "Full-Stack Innovator";

  innovationScore: number;

  architectureScore: number;

  executionScore: number;

  collaborationScore: number;

  learningScore: number;

  dnaSummary: string;

  strengths: string[];

}

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
export interface EngineeringMentor {

  maturityLevel:
    | "Junior"
    | "Intermediate"
    | "Advanced"
    | "Senior"
    | "Principal";

  learningPriority: string;

  recommendedSkills: string[];

  roadmap: string[];

  mentorSummary: string;

}
export interface TeamCompatibility {

  compatibilityScore:number;

  communicationStyle:
    | "Independent"
    | "Collaborative"
    | "Leadership";

  idealRole:
    | "Backend Engineer"
    | "Frontend Engineer"
    | "Full Stack Engineer"
    | "Architect"
    | "Tech Lead"
    | "Engineering Manager";

  leadershipReadiness:number;

  mentoringPotential:number;

  collaborationIndex:number;

  preferredTeamSize:string;

  executiveSummary:string;

}
export interface OrganizationIntelligence {

  engineeringCulture:number;

  deliveryMaturity:number;

  innovationCulture:number;

  technicalDebt:number;

  organizationalReadiness:number;

  scalingReadiness:number;

  engineeringGovernance:number;

  executiveSummary:string;

}

export interface RepositoryComparison {

  repositories: ComparedRepository[];

  strongestRepository: string;

  weakestRepository: string;

  engineeringLeader: string;

  securityLeader: string;

  productionLeader: string;

  enterpriseLeader: string;

  hiringLeader: string;

  averageEngineeringScore: number;

  averageSecurityScore: number;

  averageEnterpriseReadiness: number;

  averageHiringScore: number;

  highestRepositoryGrade: string;

  comparisonStrengths: string[];

  comparisonRisks: string[];

  comparisonRecommendations: Recommendation[];

  executiveSummary: string;

  executiveVerdict: string;

  rankings: RankedRepository[];

  technologyAnalysis: RepositoryTechnologyAnalysis;

  portfolioHealth: PortfolioHealth;

  portfolioInsights: PortfolioInsights;

  architectureIntelligence: ArchitectureIntelligence;

  productivityIntelligence: ProductivityIntelligence;

  repositoryRiskIntelligence: RepositoryRiskIntelligence;

  repositoryTrendIntelligence: RepositoryTrendIntelligence;

  latestSnapshot?: PortfolioSnapshot;

previousSnapshot?: PortfolioSnapshot;

snapshotComparison?: SnapshotComparison;

repositoryEvolution?: PortfolioEvolution;

historicalTrend?: PortfolioHistoricalTrend;

forecast?: PortfolioForecast;

risk?: PortfolioRisk;

executiveIntelligence?: ExecutiveIntelligence;

decisionIntelligence?: DecisionIntelligence;

planningIntelligence?: PlanningIntelligence;

executionIntelligence?: ExecutionIntelligence;

advisorIntelligence?: AdvisorIntelligence;

engineeringQuality?: EngineeringQualityIntelligence;

engineeringObservability?: EngineeringObservability;

unifiedCorrelation?: UnifiedCorrelationIntelligence;
}

export interface ComparedRepository {

  name: string;

  engineeringScore: number;

  securityScore: number;

  productionScore: number;

  enterpriseReadiness: number;

  hiringScore: number;

  repositoryGrade: string;

}
export interface RankedRepository {

  repositoryName: string;

  overallScore: number;

  engineeringScore: number;

  securityScore: number;

  productionScore: number;

  enterpriseReadiness: number;

  hiringScore: number;

  repositoryGrade: string;

  rank: number;

  medal:
    | "🥇"
    | "🥈"
    | "🥉"
    | "";

}
export interface RepositorySimilarity {
  repositoryA: string;

  repositoryB: string;

  engineeringSimilarity: number;

  securitySimilarity: number;

  productionSimilarity: number;

  enterpriseSimilarity: number;

  hiringSimilarity: number;

  technologySimilarity: number;

  overallSimilarity: number;

  relationship:
    | "Nearly Identical"
    | "Highly Similar"
    | "Moderately Similar"
    | "Different"
    | "Very Different";
}

export interface RepositorySimilarityAnalysis {
  similarities: RepositorySimilarity[];

  technology:RepositorySimilarity[];

  closestRepositories: RepositorySimilarity[];

  mostDifferentRepositories: RepositorySimilarity[];

  averageSimilarity: number;
}

export interface TechnologyUsage {
  name: string;
  category:
    | "Language"
    | "Framework"
    | "Database"
    | "Cloud"
    | "DevOps"
    | "Messaging"
    | "Monitoring"
    | "Testing"
    | "AI/ML"
    | "Security";

  repositoryCount: number;
  adoptionPercentage: number;
}

export interface TechnologyCategorySummary {
  category: string;
  technologyCount: number;
  repositoryCount: number;
  adoptionPercentage: number;
}

export interface TechnologyInsight {
  title: string;
  description: string;
  severity: "Info" | "Opportunity" | "Recommendation";
}

export interface TechnologyRecommendation {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
}

export interface RepositoryTechnologyAnalysis {
  totalRepositories: number;

  totalTechnologies: number;

  languageCount: number;

  frameworkCount: number;

  databaseCount: number;

  cloudPlatformCount: number;

  devOpsToolCount: number;

  diversityScore: number;

  technologies: TechnologyUsage[];

  categories: TechnologyCategorySummary[];

  insights: TechnologyInsight[];

  recommendations: TechnologyRecommendation[];
}

export interface PortfolioHealth {

  overallScore: number;

  engineeringMaturity: number;

  productionReadiness: number;

  securityReadiness: number;

  enterpriseReadiness: number;

  hiringReadiness: number;

  portfolioGrade: string;

  portfolioRisk: "Low" | "Medium" | "High";

}

export interface PortfolioInsights {

  strengths: string[];

  risks: string[];

  priorities: string[];

  executiveSummary: string;

}

export interface ArchitectureIntelligence {
  frontendConsistency: number;
  backendConsistency: number;
  frameworkConsistency: number;
  databaseConsistency: number;
  
  aiConsistency: number;
  technologyDiversity: number;

  architectureGrade: string;

  recommendations: string[];
}
export interface ProductivityIntelligence {
  activityScore: number;
  deliveryVelocity: number;
  maintenanceScore: number;
  collaborationScore: number;
  releaseHealth: number;

  productivityGrade: string;

  recommendations: string[];
}

export interface RepositoryRiskIntelligence {
  engineeringRisk: number;

  securityRisk: number;

  productionRisk: number;

  enterpriseRisk: number;

  hiringRisk: number;

  overallRisk: number;

  riskGrade: string;

  recommendations: string[];
}

export interface RepositoryTrendIntelligence {
  engineeringTrend: number;
  securityTrend: number;
  productionTrend: number;
  enterpriseTrend: number;
  hiringTrend: number;

  overallTrend: number;

  trendDirection:
    | "Improving"
    | "Stable"
    | "Declining";
  
  improvingRepositories: number;
stableRepositories: number;
decliningRepositories: number;

  strongestDimension: string;
strongestDimensionScore: number;

weakestDimension: string;
weakestDimensionScore: number;


  executiveSummary: string;

  executiveInsights: string[];

  recommendations: string[];
}