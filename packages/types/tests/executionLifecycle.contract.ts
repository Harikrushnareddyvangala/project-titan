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

const firstCompletedLifecycle = transitionExecutionLifecycle(
  runningLifecycle,
  execution,
  "Completed",
  "Execution completed successfully.",
  "2026-09-06T00:00:02.000Z",
);

const firstTransition = firstCompletedLifecycle.transitions[0];

if (firstTransition?.from !== "Running") {
  throw new Error("Transition history must record the previous state.");
}

if (firstTransition?.to !== "Completed") {
  throw new Error("Transition history must record the resulting state.");
}

if (firstTransition?.execution.id !== execution.id) {
  throw new Error("Transition history must preserve execution identity.");
}

const failedExecution: ExecutionIdentity = {
  id: "execution-lifecycle-002",
};

const failedLifecycle = transitionExecutionLifecycle(
  runningLifecycle,
  failedExecution,
  "Failed",
  "Execution failed.",
  "2026-09-06T00:00:03.000Z",
);

if (failedLifecycle.currentState !== "Failed") {
  throw new Error("Failed transition must update the current state.");
}

if (failedLifecycle.transitions.length !== 1) {
  throw new Error("Failed transition must append exactly one history record.");
}

let invalidTransitionRejected = false;

try {
  transitionExecutionLifecycle(
    firstCompletedLifecycle,
    execution,
    "Running",
    "Attempted invalid terminal transition.",
    "2026-09-06T00:00:05.000Z",
  );
} catch {
  invalidTransitionRejected = true;
}

if (!invalidTransitionRejected) {
  throw new Error("Terminal lifecycle transitions must be rejected.");
}

if (firstCompletedLifecycle.currentState !== "Completed") {
  throw new Error("Rejected transitions must not mutate the lifecycle.");
}

if (firstCompletedLifecycle.transitions.length !== 1) {
  throw new Error("Rejected transitions must not append history.");
}
