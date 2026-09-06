import { createExecution } from "../src/index.js";

const execution = createExecution("execution-construction-001");

if (execution.identity.id !== "execution-construction-001") {
  throw new Error("Execution construction must preserve the supplied identity.");
}

if (execution.lifecycle.currentState !== "Running") {
  throw new Error("A constructed execution must begin at Running.");
}

if (execution.lifecycle.transitions.length !== 0) {
  throw new Error(
    "Execution construction must not create a lifecycle transition.",
  );
}

if (Object.keys(execution.temporal).length !== 0) {
  throw new Error(
    "Execution construction must not fabricate temporal timestamps.",
  );
}

if ("startedAt" in execution.temporal) {
  throw new Error(
    "Execution construction must not fabricate startedAt.",
  );
}

if ("participations" in execution) {
  throw new Error(
    "Execution construction must not embed actor participation.",
  );
}

if ("interactions" in execution) {
  throw new Error(
    "Execution construction must not embed resource interactions.",
  );
}
