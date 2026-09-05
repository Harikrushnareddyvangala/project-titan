import type {
  ExecutionIdentity,
  ExecutionResourceInteraction,
  OperationReference,
  ResourceIdentity,
  ResourceRevision,
} from "@titan/types";

const execution: ExecutionIdentity = {
  id: "execution-001",
};

const dataset: ResourceIdentity = {
  id: "dataset-001",
  type: "dataset",
  namespace: "research",
};

const datasetRevision: ResourceRevision = {
  resource: dataset,
  version: "17",
  createdAt: "2026-09-04T00:00:00.000Z",
};

const readOperation: OperationReference = {
  namespace: "execution",
  type: "read",
};

const observeOperation: OperationReference = {
  namespace: "scientific",
  type: "observe",
};

const resourceLevelInteraction: ExecutionResourceInteraction = {
  id: "interaction-001",
  execution,
  target: dataset,
  operation: readOperation,
  createdAt: "2026-09-04T00:00:00.000Z",
};

const repeatedResourceReadInteraction: ExecutionResourceInteraction = {
  id: "interaction-004",
  execution,
  target: dataset,
  operation: readOperation,
  createdAt: "2026-09-04T00:00:01.000Z",
};

const revisionLevelInteraction: ExecutionResourceInteraction = {
  id: "interaction-002",
  execution,
  target: datasetRevision,
  operation: readOperation,
  createdAt: "2026-09-04T00:00:00.000Z",
};

const observationInteraction: ExecutionResourceInteraction = {
  id: "interaction-003",
  execution,
  target: dataset,
  operation: observeOperation,
  createdAt: "2026-09-04T00:00:00.000Z",
};

void resourceLevelInteraction;
void revisionLevelInteraction;
void observationInteraction;
void repeatedResourceReadInteraction;
