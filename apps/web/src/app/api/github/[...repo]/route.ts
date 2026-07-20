import { NextResponse } from "next/server";
import type { GithubCommitWeek, GithubContributor } from "@/types/github";
import { buildRepositoryMetrics,} from "@/lib/github/analyticsEngine";
import { buildTechnologyStack } from "@/lib/github/technologyEngine";
import { buildRepositoryScores, } from "@/lib/github/scoringEngine";
import { buildRepositoryRecommendations, } from "@/lib/github/recommendationEngine";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      repo: string[];
    }>;
  },
) {
  const { repo } = await params;

  if (!repo || repo.length < 2) {
    return NextResponse.json(
      {
        error: "Invalid repository",
      },
      {
        status: 400,
      },
    );
  }

  const owner = repo[0];
  const repository = repo[1];

  const baseUrl = `https://api.github.com/repos/${owner}/${repository}`;

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };

  try {
    const [repoResponse, languageResponse, commitResponse, contributorResponse,] =
      await Promise.all([
        
        fetch(baseUrl, {
          headers,
          next: {
            revalidate: 600,
          },
        }),

        fetch(`${baseUrl}/languages`, {
          headers,
          next: {
            revalidate: 600,
          },
        }),
        fetch(`${baseUrl}/stats/commit_activity`, {
          headers,
          next: {
            revalidate: 600,
          },
        }),
        fetch(`${baseUrl}/contributors`, {
          headers,
          next: {
            revalidate: 600,
          },
        }),
      ]);
      console.log({
  repository,
  repoStatus: repoResponse.status,
  languageStatus: languageResponse.status,
  commitStatus: commitResponse.status,
  contributorStatus: contributorResponse.status,
});

    if (!repoResponse.ok) {
      const error = await repoResponse.json();

      return NextResponse.json(error, {
        status: repoResponse.status,
      });
    }

    const repositoryData =
      await repoResponse.json();
// ------------------------------------------------------
// Load Supporting GitHub Data
// ------------------------------------------------------

const languageData = languageResponse.ok
  ? await languageResponse.json()
  : {};

const commitActivityData: GithubCommitWeek[] =
  commitResponse.status === 200
    ? ((await commitResponse.json()) as GithubCommitWeek[])
    : [];

const contributorsData: GithubContributor[] =
  contributorResponse.status === 200
    ? ((await contributorResponse.json()) as GithubContributor[])
    : [];

// ------------------------------------------------------
// Repository Intelligence Metrics
// ------------------------------------------------------
const {

repositoryAge,

inactiveDays,

languageCount,

contributorCount,

totalCommits,

recentCommits,

commitsPerWeek,

}=buildRepositoryMetrics({

repository:repositoryData,

languages:languageData,

commitActivity:commitActivityData,

contributors:contributorsData,

});





    //----------------------------------------------------
// Repository Analytics Engine
//----------------------------------------------------






//--------------------------------------
// Engineering Score
//--------------------------------------



//--------------------------------------
// Production Score
//--------------------------------------



//--------------------------------------
// Risk Level
//--------------------------------------


//--------------------------------------
// Quality
//--------------------------------------


//--------------------------------------
// Repository Maturity
//--------------------------------------


//--------------------------------------
// Deployment Ready
//--------------------------------------

const {

engineeringScore,

healthScore,

productionScore,

riskLevel,

quality,

deploymentReady,

}=buildRepositoryScores({

engineeringInputs:{

stars:

repositoryData.stargazers_count,

forks:

repositoryData.forks_count,

watchers:

repositoryData.watchers_count,

issues:

repositoryData.open_issues_count,

repositoryAge,

languageCount,

contributorCount,

commitsPerWeek,

recentCommits,

inactiveDays,

},

});

const recommendations =

buildRepositoryRecommendations({

stars:

repositoryData.stargazers_count,

forks:

repositoryData.forks_count,

watchers:

repositoryData.watchers_count,

issues:

repositoryData.open_issues_count,

inactiveDays,

languageCount,

contributorCount,

recentCommits,

});
//--------------------------------------
// Recommendations
//--------------------------------------



//--------------------------------------
// Security & DevOps
//--------------------------------------

const hasLicense =
  repositoryData.license !== null;

const archived =
  repositoryData.archived;

const hasWiki =
  repositoryData.has_wiki;

const hasProjects =
  repositoryData.has_projects;

const hasIssues =
  repositoryData.has_issues;

const releases =
  repositoryData.releases_url
    ? true
    : false;

let securityScore = 100;

if (!hasLicense) securityScore -= 15;

if (archived) securityScore -= 40;

if (!hasIssues) securityScore -= 15;

if (!hasProjects) securityScore -= 10;

if (!hasWiki) securityScore -= 5;

securityScore = Math.max(
  0,
  Math.min(100, securityScore),
);

const devopsScore =
  Math.round(

    productionScore * 0.55 +

    securityScore * 0.45,

  );

  //--------------------------------------
// Technology Stack Detection
//--------------------------------------
const {

  frontend,

  backend,

  aiFramework,

  database,

  vectorDatabase,

  cloud,

  packageManager,

} = buildTechnologyStack({

  description:

    repositoryData.description ?? "",

  topics:

    repositoryData.topics ?? [],

  languages:

    Object.keys(languageData),

});

//------------------------------------------------------
// Dependency Intelligence Engine
//------------------------------------------------------
let frontendFramework = "Unknown";

let backendFramework = "Unknown";

let aiLibrary = "None";

let dependencyRisk = "Medium";

let technologyMaturity = "Standard";

if (frontend === "Next.js") {

  frontendFramework = "React Ecosystem";

}

if (backend === "FastAPI") {

  backendFramework = "FastAPI";

}

if (backend === "Django") {

  backendFramework = "Django";

}

if (aiFramework === "LangChain") {

  aiLibrary = "LangChain";

}

if (aiFramework === "OpenAI") {

  aiLibrary = "OpenAI SDK";

}

if (

engineeringScore > 90 &&

productionScore > 85

){

technologyMaturity = "Enterprise";

dependencyRisk = "Low";

}

else if(

engineeringScore > 75

){

technologyMaturity = "Production";

dependencyRisk = "Medium";

}

else{

technologyMaturity = "Learning";

dependencyRisk = "High";

}
const maturity = technologyMaturity;
    
const analytics={

repositoryAge,

inactiveDays,

languageCount,

contributorCount,

totalCommits,

recentCommits,

engineeringScore,

healthScore,

productionScore,

deploymentReady,

riskLevel,

quality,

maturity,

recommendations,

securityScore,

devopsScore,

hasLicense,

archived,

hasWiki,

hasProjects,

hasIssues,

frontend,

backend,

database,

aiFramework,

cloud,

packageManager,

vectorDatabase,

frontendFramework,

backendFramework,

aiLibrary,

dependencyRisk,

technologyMaturity,

};


    return NextResponse.json({
  repository: repositoryData,

  analytics,

  languages: languageData,

  commitActivity: commitActivityData,

  contributors: contributorsData,
});
  } catch(error: unknown) {
    console.error("GitHub API Route Error:", error);
    return NextResponse.json(
      {
        error: "GitHub unavailable",
      },
      {
        status: 500,
      },
    );
  }
}