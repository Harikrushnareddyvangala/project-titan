import type {
  Execution,
  ExecutionIdentity,
  ExecutionLifecycle,
  ExecutionTemporalContext,
} from "../src/index.js";

const identity: ExecutionIdentity = {
  id: "execution-001",
};

const lifecycle: ExecutionLifecycle = {
  currentState: "Running",
  transitions: [],
};

const temporal: ExecutionTemporalContext = {
  startedAt: "2026-09-06T10:00:00.000Z",
};

const execution: Execution = {
  identity,
  lifecycle,
  temporal,
};

if (execution.identity !== identity) {
  throw new Error("Execution must preserve its canonical identity.");
}

if (execution.lifecycle !== lifecycle) {
  throw new Error("Execution must compose its lifecycle directly.");
}

if (execution.temporal !== temporal) {
  throw new Error("Execution must compose its temporal context directly.");
}

if ("id" in execution) {
  throw new Error(
    "Execution must not duplicate the execution identity at the top level.",
  );
}

if ("participations" in execution) {
  throw new Error(
    "Execution must not embed actor participation collections.",
  );
}

if ("interactions" in execution) {
  throw new Error(
    "Execution must not embed resource interaction collections.",
  );
}
