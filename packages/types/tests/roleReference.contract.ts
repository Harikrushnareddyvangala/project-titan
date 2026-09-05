import type { RoleReference } from "@titan/types";

const executionInitiator: RoleReference = {
  namespace: "execution",
  type: "initiator",
};

const executionExecutor: RoleReference = {
  namespace: "execution",
  type: "executor",
};

const researchValidator: RoleReference = {
  namespace: "research",
  type: "validator",
};

const crossDomainRole: RoleReference = {
  namespace: "agent",
  type: "tool-user",
};

void executionInitiator;
void executionExecutor;
void researchValidator;
void crossDomainRole;
