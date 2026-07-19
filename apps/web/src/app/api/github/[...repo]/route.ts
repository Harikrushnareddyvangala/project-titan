import { NextResponse } from "next/server";
import type { GithubCommitWeek, GithubContributor } from "@/types/github";

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

const languageCount =
  Object.keys(languageData).length;

const contributorCount =
  contributorsData.length;

const totalCommits =
  commitActivityData.reduce(
    (sum: number, week: GithubCommitWeek) => sum + week.total,
    0,
  );

const recentCommits =
  commitActivityData
    .slice(-4)
    .reduce(
      (sum: number, week: GithubCommitWeek) => sum + week.total,
      0,
    );

const commitsPerWeek =
  Math.round(
    totalCommits /
      Math.max(commitActivityData.length, 1),
  );
    //----------------------------------------------------
// Repository Analytics Engine
//----------------------------------------------------

const DAY = 1000 * 60 * 60 * 24;

const now = new Date();

const created = new Date(
  repositoryData.created_at,
);

const updated = new Date(
  repositoryData.updated_at,
);

const repositoryAge = Math.floor(
  (now.getTime() - created.getTime()) /
    DAY,
);

const inactiveDays = Math.floor(
  (now.getTime() - updated.getTime()) /
    DAY,
);

//--------------------------------------
// Engineering Score
//--------------------------------------

let engineeringScore = 0;

// Repository popularity

engineeringScore +=

Math.min(
repositoryData.stargazers_count,
25,
);

// Community contribution

engineeringScore +=

Math.min(
repositoryData.forks_count*2,
20,
);

// Repository followers

engineeringScore +=

Math.min(
repositoryData.watchers_count,
10,
);

// Language diversity

engineeringScore +=

Math.min(
languageCount*4,
12,
);

// Contributor diversity

engineeringScore +=

Math.min(
contributorCount*3,
12,
);

// Commit activity

engineeringScore +=

Math.min(
commitsPerWeek,
12,
);

// Repository maturity

engineeringScore +=

Math.min(

Math.floor(repositoryAge/365),

6,

);

// Issues penalty

engineeringScore -=

Math.min(

repositoryData.open_issues_count,

15,

);

engineeringScore=Math.max(

0,

Math.min(

100,

Math.round(engineeringScore),

),

);

//--------------------------------------
// Health Score
//--------------------------------------

let healthScore=100;

// inactivity

healthScore-=Math.floor(

inactiveDays/20,

);

// issues

healthScore-=

repositoryData.open_issues_count;

// low contributors

if(contributorCount<3){

healthScore-=8;

}

// inactive commits

if(recentCommits<10){

healthScore-=12;

}

healthScore=Math.max(

0,

Math.min(

100,

healthScore,

),

);

//--------------------------------------
// Production Score
//--------------------------------------

const productionScore=

Math.round(

engineeringScore*0.45+

healthScore*0.30+

Math.min(

contributorCount*3,

10,

)+

Math.min(

recentCommits/2,

15,

),

);

//--------------------------------------
// Risk Level
//--------------------------------------

const riskLevel =
  productionScore >= 85
    ? "Low"
    : productionScore >= 65
      ? "Medium"
      : "High";

//--------------------------------------
// Quality
//--------------------------------------

const quality =
  productionScore >= 90
    ? "Outstanding"
    : productionScore >= 80
      ? "Excellent"
      : productionScore >= 65
        ? "Good"
        : "Growing";
//--------------------------------------
// Repository Maturity
//--------------------------------------

let maturity = "Prototype";

if (productionScore >= 90) {
  maturity = "World Class";
}
else if (productionScore >= 80) {
  maturity = "Enterprise";
}
else if (productionScore >= 65) {
  maturity = "Production Ready";
}
else if (productionScore >= 45) {
  maturity = "Developing";
}
else {
  maturity = "Prototype";
}
//--------------------------------------
// Deployment Ready
//--------------------------------------

const deploymentReady =
  productionScore >= 80 &&
  repositoryData.open_issues_count < 10 &&
  inactiveDays < 90;

//--------------------------------------
// Recommendations
//--------------------------------------

const recommendations: string[] = [];

if (
  repositoryData.open_issues_count > 10
) {
  recommendations.push(
    "Reduce open issues to improve maintainability.",
  );
}

if (
  repositoryData.stargazers_count < 20
) {
  recommendations.push(
    "Increase repository visibility using an improved README and demonstrations.",
  );
}

if (
  repositoryData.watchers_count < 5
) {
  recommendations.push(
    "Increase community engagement.",
  );
}

if (
  repositoryData.forks_count < 3
) {
  recommendations.push(
    "Encourage community contributions.",
  );
}

if (inactiveDays > 90) {
  recommendations.push(
    "Repository appears inactive. Consider regular maintenance updates.",
  );
}
if(languageCount===1){

recommendations.push(

"Support additional tooling or languages where appropriate."

);

}

if(contributorCount<=1){

recommendations.push(

"Repository depends on a single contributor."

);

}

if(recentCommits<10){

recommendations.push(

"Development activity has slowed during the last month."

);

}
if (recommendations.length === 0) {
  recommendations.push(
    "Excellent repository health.",
  );
}
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