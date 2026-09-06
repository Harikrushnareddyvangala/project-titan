import {
  createExecution,
  transitionExecution,
} from "../src/index.js";

const running = createExecution("execution-transition-001", {
  startedAt: "2026-09-06T10:00:00.000Z",
});

const completed = transitionExecution(running, "Completed", {
  endedAt: "2026-09-06T10:30:00.000Z",
  reason: "Execution completed successfully.",
  timestamp: "2026-09-06T10:30:01.000Z",
});

if (running.lifecycle.currentState !== "Running") {
  throw new Error("Source execution must remain Running.");
}

if (running.temporal.endedAt !== undefined) {
  throw new Error("Source execution must remain without endedAt.");
}

if (completed.lifecycle.currentState !== "Completed") {
  throw new Error("Execution must transition to Completed.");
}

if (completed.temporal.startedAt !== "2026-09-06T10:00:00.000Z") {
  throw new Error("Execution start time must be preserved.");
}

if (completed.temporal.endedAt !== "2026-09-06T10:30:00.000Z") {
  throw new Error("Execution termination time must be established.");
}

if (completed.lifecycle.transitions.length !== 1) {
  throw new Error("Execution transition must create one lifecycle history record.");
}

const failed = transitionExecution(running, "Failed", {
  endedAt: "2026-09-06T10:20:00.000Z",
});

if (failed.lifecycle.currentState !== "Failed") {
  throw new Error("Execution must support Running to Failed.");
}

if (failed.temporal.endedAt !== "2026-09-06T10:20:00.000Z") {
  throw new Error("Failed execution must preserve its termination time.");
}

let orderingRejected = false;

try {
  transitionExecution(running, "Completed", {
    endedAt: "2026-09-06T09:59:00.000Z",
  });
} catch {
  orderingRejected = true;
}

if (!orderingRejected) {
  throw new Error(
    "Execution termination before execution start must be rejected.",
  );
}

let terminalTransitionRejected = false;

try {
  transitionExecution(completed, "Failed", {
    endedAt: "2026-09-06T10:40:00.000Z",
  });
} catch {
  terminalTransitionRejected = true;
}

if (!terminalTransitionRejected) {
  throw new Error("Terminal executions must not transition again.");
}
