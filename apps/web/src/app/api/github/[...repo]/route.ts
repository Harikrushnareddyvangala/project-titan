import { NextResponse } from "next/server";
import type { GithubCommitWeek, GithubContributor } from "@/types/github";
import {
  buildRepositoryAnalytics,
} from "@/lib/github/repositoryEngine";
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
const analytics =
  buildRepositoryAnalytics({

    repository:
      repositoryData,

    languages:
      languageData,

    commitActivity:
      commitActivityData,

    contributors:
      contributorsData,

  });



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