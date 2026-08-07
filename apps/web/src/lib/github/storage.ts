const LAST_REPOSITORY_KEY =
  "titan:last-repository";

const RECENT_REPOSITORIES_KEY =
  "titan:recent-repositories";

const MAX_RECENT_REPOSITORIES = 5;

/* -------------------------------------------------------------------------- */
/*                               Last Repository                              */
/* -------------------------------------------------------------------------- */

export function getLastRepository(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    LAST_REPOSITORY_KEY,
  );
}

export function saveLastRepository(
  repository: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    LAST_REPOSITORY_KEY,
    repository,
  );
}

/* -------------------------------------------------------------------------- */
/*                            Recent Repositories                             */
/* -------------------------------------------------------------------------- */

export function getRecentRepositories(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = localStorage.getItem(
    RECENT_REPOSITORIES_KEY,
  );

  if (!value) {
    return [];
  }

  try {
    const repositories = JSON.parse(value);

    return Array.isArray(repositories)
      ? repositories
      : [];
  } catch {
    return [];
  }
}

export function saveRecentRepository(
  repository: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const repositories = getRecentRepositories().filter(
    (item) => item !== repository,
  );

  repositories.unshift(repository);

  localStorage.setItem(
    RECENT_REPOSITORIES_KEY,
    JSON.stringify(
      repositories.slice(
        0,
        MAX_RECENT_REPOSITORIES,
      ),
    ),
  );
}

export function removeRecentRepository(
  repository: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const repositories = getRecentRepositories().filter(
    (item) => item !== repository,
  );

  localStorage.setItem(
    RECENT_REPOSITORIES_KEY,
    JSON.stringify(repositories),
  );
}

export function clearRecentRepositories(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    RECENT_REPOSITORIES_KEY,
  );
}