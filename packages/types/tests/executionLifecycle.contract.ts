import {
  canTransitionExecutionLifecycle,
  transitionExecutionLifecycle,
} from "@titan/types";

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

const runningLifecycle: ExecutionLifecycle = {
  currentState: "Running",
  transitions: [],
};

if (!canTransitionExecutionLifecycle(runningLifecycle.currentState, "Completed")) {
  throw new Error("Running → Completed should be valid.");
}

if (!canTransitionExecutionLifecycle(runningLifecycle.currentState, "Failed")) {
  throw new Error("Running → Failed should be valid.");
}

if (canTransitionExecutionLifecycle("Completed", "Running")) {
  throw new Error("Completed → Running should be invalid.");
}

if (canTransitionExecutionLifecycle("Failed", "Running")) {
  throw new Error("Failed → Running should be invalid.");
}

if (canTransitionExecutionLifecycle("Running", "Running")) {
  throw new Error("Running → Running should be invalid.");
}

const completedLifecycle = transitionExecutionLifecycle(
  runningLifecycle,
  execution,
  "Completed",
  "Execution completed successfully.",
  "2026-09-06T00:00:02.000Z",
);

if (completedLifecycle.currentState !== "Completed") {
  throw new Error("Transition should update the current state.");
}

if (completedLifecycle.transitions.length !== 1) {
  throw new Error("Transition should append exactly one history record.");
}

if (completedLifecycle.transitions[0]?.execution.id !== execution.id) {
  throw new Error("Transition should preserve execution identity.");
}
