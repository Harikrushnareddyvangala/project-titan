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
    const [repoResponse, languageResponse, commitResponse] =
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
      ]);

    if (!repoResponse.ok) {
      const error = await repoResponse.json();

      return NextResponse.json(error, {
        status: repoResponse.status,
      });
    }

    const repositoryData =
      await repoResponse.json();

    const languageData =
      languageResponse.ok
        ? await languageResponse.json()
        : {};
    let commitActivityData = [];

    if (commitResponse.status === 200) {
  commitActivityData = await commitResponse.json();
} else if (commitResponse.status === 202) {
  commitActivityData = [];
}

    return NextResponse.json({
      repository: repositoryData,
      languages: languageData,
      commitActivity: commitActivityData,
    });
  } catch {
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