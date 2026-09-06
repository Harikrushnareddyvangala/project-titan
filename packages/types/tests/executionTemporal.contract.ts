import type { ExecutionTemporalContext } from "../src/index.js";

const runningExecution: ExecutionTemporalContext = {
  startedAt: "2026-09-06T10:00:00.000Z",
};

const completedExecution: ExecutionTemporalContext = {
  startedAt: "2026-09-06T10:00:00.000Z",
  endedAt: "2026-09-06T10:30:00.000Z",
};

const historicallyIncompleteExecution: ExecutionTemporalContext = {};

if (!runningExecution.startedAt) {
  throw new Error("A known execution start time must be representable.");
}

if (!completedExecution.endedAt) {
  throw new Error("A known execution end time must be representable.");
}

if (
  "duration" in runningExecution ||
  "occurredAt" in runningExecution ||
  "observedAt" in runningExecution
) {
  throw new Error(
    "Execution temporal context must not contain derived or observation timestamps.",
  );
}

if (Object.keys(historicallyIncompleteExecution).length !== 0) {
  throw new Error(
    "Execution temporal context must allow both timestamps to be unknown.",
  );
}
