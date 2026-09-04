import type {
  ResourceIdentity,
  ResourceRelationship,
} from "@titan/types";

const researchFinding: ResourceIdentity = {
  id: "finding-001",
  type: "finding",
  namespace: "research",
};

const researchEvidence: ResourceIdentity = {
  id: "evidence-001",
  type: "evidence",
  namespace: "research",
};

const mlModel: ResourceIdentity = {
  id: "model-001",
  type: "model",
  namespace: "ml",
};

const supportingRelationship: ResourceRelationship = {
  id: "relationship-001",
  source: researchFinding,
  target: researchEvidence,
  namespace: "research",
  type: "supports",
  createdAt: "2026-09-04T00:00:00.000Z",
};

const crossNamespaceRelationship: ResourceRelationship = {
  id: "relationship-002",
  source: researchFinding,
  target: mlModel,
  namespace: "research",
  type: "evaluated-by",
  createdAt: "2026-09-04T00:00:00.000Z",
};

const selfRelationship: ResourceRelationship = {
  id: "relationship-003",
  source: researchFinding,
  target: researchFinding,
  namespace: "research",
  type: "related-to",
  createdAt: "2026-09-04T00:00:00.000Z",
};

void supportingRelationship;
void crossNamespaceRelationship;
void selfRelationship;
