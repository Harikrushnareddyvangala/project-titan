import type {
  ResourceIdentity,
  ResourceRevision,
} from "@titan/types";

const researchFinding: ResourceIdentity = {
  id: "finding-001",
  type: "finding",
  namespace: "research",
};

const intelligenceArtifact: ResourceIdentity = {
  id: "artifact-001",
  type: "artifact",
  namespace: "intelligence",
};

const researchFindingRevision: ResourceRevision = {
  resourceId: researchFinding.id,
  version: "1",
  createdAt: "2026-09-04T00:00:00.000Z",
};

const intelligenceArtifactRevision: ResourceRevision = {
  resourceId: intelligenceArtifact.id,
  version: "1.0.0",
  createdAt: "2026-09-04T00:00:00.000Z",
};

void researchFinding;
void intelligenceArtifact;
void researchFindingRevision;
void intelligenceArtifactRevision;
