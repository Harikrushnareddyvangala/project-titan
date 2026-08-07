export function isValidRepositoryName(
  repository: string,
): boolean {
  const value = repository.trim();

  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(
    value,
  );
}