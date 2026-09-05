import type { ExecutionIdentity } from "@titan/types";

const trainingExecution: ExecutionIdentity = {
  id: "execution-training-001",
};

const researchExecution: ExecutionIdentity = {
  id: "execution-research-001",
};

const anotherExecutionWithDifferentContext: ExecutionIdentity = {
  id: "execution-001",
};

void trainingExecution;
void researchExecution;
void anotherExecutionWithDifferentContext;
