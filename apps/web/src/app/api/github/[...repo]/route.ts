import { NextResponse } from "next/server";

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

let engineeringScore = 70;

engineeringScore += Math.min(
  repositoryData.stargazers_count,
  10,
);

engineeringScore += Math.min(
  repositoryData.forks_count,
  10,
);

engineeringScore += Math.min(
  repositoryData.watchers_count,
  10,
);

engineeringScore -= Math.min(
  repositoryData.open_issues_count,
  15,
);

engineeringScore = Math.max(
  0,
  Math.min(engineeringScore, 100),
);

//--------------------------------------
// Health Score
//--------------------------------------

let healthScore = 100;

healthScore -=
  repositoryData.open_issues_count * 2;

healthScore -= Math.floor(
  inactiveDays / 15,
);

healthScore = Math.max(
  0,
  Math.min(healthScore, 100),
);

//--------------------------------------
// Production Score
//--------------------------------------

const productionScore = Math.round(

  engineeringScore * 0.45 +

  healthScore * 0.35 +

  Math.min(
    repositoryData.watchers_count * 2,
    20,
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

if (recommendations.length === 0) {
  recommendations.push(
    "Excellent repository health.",
  );
}

const analytics = {
  repositoryAge,
  inactiveDays,
  engineeringScore,
  healthScore,
  productionScore,
  deploymentReady,
  riskLevel,
  quality,
  recommendations,
};

    const languageData =
      languageResponse.ok
        ? await languageResponse.json()
        : {};
    let commitActivityData = [];
    let contributorsData = [];

    if (commitResponse.status === 200) {
  commitActivityData =
    await commitResponse.json();
} else {
  commitActivityData = [];
}
 if (contributorResponse.status === 200) {
  contributorsData =
    await contributorResponse.json();
} else {
  contributorsData = [];
}
    return NextResponse.json({
  repository: repositoryData,

  analytics,

  languages: languageData,

  commitActivity: commitActivityData,

  contributors: contributorsData,
});
  } catch(error) {
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