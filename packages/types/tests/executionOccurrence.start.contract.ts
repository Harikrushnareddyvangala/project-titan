import {
  createExecution,
  establishExecutionStart,
  transitionExecution,
} from "../src/index.js";

const execution = createExecution("execution-start-001");

const started = establishExecutionStart(
  execution,
  "2026-09-06T10:00:00.000Z",
);

if (execution.temporal.startedAt !== undefined) {
  throw new Error("Source execution must remain without startedAt.");
}

if (started.temporal.startedAt !== "2026-09-06T10:00:00.000Z") {
  throw new Error("Execution start time must be established.");
}

if (started.lifecycle.currentState !== "Running") {
  throw new Error("Establishing start time must not change lifecycle state.");
}

if (started.lifecycle.transitions.length !== 0) {
  throw new Error(
    "Establishing start time must not create lifecycle history.",
  );
}

if (started.temporal.endedAt !== undefined) {
  throw new Error(
    "Establishing start time must not fabricate execution termination.",
  );
}

let duplicateRejected = false;

try {
  establishExecutionStart(
    started,
    "2026-09-06T10:05:00.000Z",
  );
} catch {
  duplicateRejected = true;
}

if (!duplicateRejected) {
  throw new Error(
    "An already-established execution start time must not be overwritten.",
  );
}

const historicallyCompleted = transitionExecution(
  execution,
  "Completed",
  {
    endedAt: "2026-09-06T10:30:00.000Z",
  },
);

const historicallyStarted = establishExecutionStart(
  historicallyCompleted,
  "2026-09-06T10:00:00.000Z",
);
if (
  historicallyStarted.temporal.startedAt !==
  "2026-09-06T10:00:00.000Z"
) {
  throw new Error(
    "A historical execution may establish a start time after termination is known.",
  );
}

let orderingRejected = false;

try {
  establishExecutionStart(
    historicallyCompleted,
    "2026-09-06T10:31:00.000Z",
  );
} catch {
  orderingRejected = true;
}

if (!orderingRejected) {
  throw new Error(
    "Execution start time after termination must be rejected.",
  );
}
