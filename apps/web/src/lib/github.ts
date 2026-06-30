export const GITHUB_USERNAME =
  "Harikrushnareddyvangala";

export async function fetchRepository(
  repo: string,
) {
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}`,
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch repository",
    );
  }

  return response.json();
}