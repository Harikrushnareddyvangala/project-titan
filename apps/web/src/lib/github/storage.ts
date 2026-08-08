const LAST_REPOSITORY_KEY =
  "titan:last-repository";

const RECENT_REPOSITORIES_KEY =
  "titan:recent-repositories";

const MAX_RECENT = 5;

export function getLastRepository(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(
    LAST_REPOSITORY_KEY,
  );

  if (!value) {
    return null;
  }

  /*
   * Ignore accidentally persisted JSON from the
   * previous implementation.
   */
  if (
    value.startsWith("[") ||
    value.startsWith("{")
  ) {
    return null;
  }

  return value;
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

  window.dispatchEvent(
    new Event(
      "titan:last-repository-change",
    ),
  );
}

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
    const parsed: unknown =
      JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is string =>
        typeof item === "string",
    );
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

  const repositories =
    getRecentRepositories().filter(
      (item) => item !== repository,
    );

  repositories.unshift(repository);

  localStorage.setItem(
    RECENT_REPOSITORIES_KEY,
    JSON.stringify(
      repositories.slice(
        0,
        MAX_RECENT,
      ),
    ),
  );

  window.dispatchEvent(
    new Event(
      "titan:recent-repositories-change",
    ),
  );
}

export function subscribeToRepositoryStorage(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorageChange = () => {
    callback();
  };

  window.addEventListener(
    "storage",
    handleStorageChange,
  );

  window.addEventListener(
    "titan:last-repository-change",
    handleStorageChange,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorageChange,
    );

    window.removeEventListener(
      "titan:last-repository-change",
      handleStorageChange,
    );
  };
}

export function subscribeToRecentRepositories(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorageChange = () => {
    callback();
  };

  window.addEventListener(
    "storage",
    handleStorageChange,
  );

  window.addEventListener(
    "titan:recent-repositories-change",
    handleStorageChange,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorageChange,
    );

    window.removeEventListener(
      "titan:recent-repositories-change",
      handleStorageChange,
    );
  };
}