import type {
  ExecutionIdentity,
  ExecutionLifecycle,
  ExecutionLifecycleState,
  ExecutionLifecycleTransition,
} from "@titan/types";

const execution: ExecutionIdentity = {
  id: "execution-lifecycle-001",
};

const running: ExecutionLifecycleState = "Running";
const completed: ExecutionLifecycleState = "Completed";
const failed: ExecutionLifecycleState = "Failed";

const completedTransition: ExecutionLifecycleTransition = {
  id: "transition-001",
  execution,
  from: running,
  to: completed,
  timestamp: "2026-09-06T00:00:00.000Z",
};

const failedTransition: ExecutionLifecycleTransition = {
  id: "transition-002",
  execution,
  from: running,
  to: failed,
  reason: "Execution terminated before reaching its completion condition.",
  timestamp: "2026-09-06T00:00:01.000Z",
};

const lifecycle: ExecutionLifecycle = {
  currentState: completed,
  transitions: [completedTransition],
};

void failedTransition;
void lifecycle;
