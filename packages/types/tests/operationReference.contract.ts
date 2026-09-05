import type { OperationReference } from "@titan/types";

const executionRead: OperationReference = {
  namespace: "execution",
  type: "read",
};

const executionWrite: OperationReference = {
  namespace: "execution",
  type: "write",
};

const executionProduce: OperationReference = {
  namespace: "execution",
  type: "produce",
};

const scientificObserve: OperationReference = {
  namespace: "scientific",
  type: "observe",
};

const streamingSubscribe: OperationReference = {
  namespace: "streaming",
  type: "subscribe",
};

void executionRead;
void executionWrite;
void executionProduce;
void scientificObserve;
void streamingSubscribe;
