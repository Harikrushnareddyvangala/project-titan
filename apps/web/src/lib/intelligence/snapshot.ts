import type { IntelligenceSnapshot } from "@/types/intelligence";

export function createIntelligenceSnapshot(
  repository: string,
  analytics: IntelligenceSnapshot["analytics"],
): IntelligenceSnapshot {
  return {
    id: `snapshot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    repository,
    createdAt: new Date().toISOString(),
    analytics,
  };
}
