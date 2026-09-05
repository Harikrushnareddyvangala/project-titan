import type {
  ActorIdentity,
  ExecutionActorParticipation,
  ExecutionIdentity,
  RoleReference,
} from "@titan/types";

const humanActor: ActorIdentity = {
  id: "actor-human-001",
};

const systemActor: ActorIdentity = {
  id: "actor-system-001",
};

const execution: ExecutionIdentity = {
  id: "execution-001",
};

const initiatorRole: RoleReference = {
  namespace: "execution",
  type: "initiator",
};

const executorRole: RoleReference = {
  namespace: "execution",
  type: "executor",
};

const humanInitiator: ExecutionActorParticipation = {
  id: "participation-001",
  execution,
  actor: humanActor,
  role: initiatorRole,
  createdAt: "2026-01-01T00:00:00.000Z",
};

const humanExecutor: ExecutionActorParticipation = {
  id: "participation-002",
  execution,
  actor: humanActor,
  role: executorRole,
  createdAt: "2026-01-01T00:00:01.000Z",
};

const systemExecutor: ExecutionActorParticipation = {
  id: "participation-003",
  execution,
  actor: systemActor,
  role: executorRole,
  createdAt: "2026-01-01T00:00:02.000Z",
};

void humanInitiator;
void humanExecutor;
void systemExecutor;
