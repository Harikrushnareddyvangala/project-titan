import type {

  ExecutionInput,
  ExecutionIntelligence,
  ExecutionItem,
  ExecutionSummary,

} from "@/types/execution"; 

export function buildExecutionIntelligence(

  input: ExecutionInput,

): ExecutionIntelligence {

  const executions =
    buildExecutionItems(
      input,
    );

  const summary =
    buildExecutionSummary(
      input,
      executions,
    );

  return {

    executions,

    summary,

  };

}

function buildExecutionItems(

  input: ExecutionInput,

): ExecutionItem[] {

  const executions: ExecutionItem[] = [];

  /*
  --------------------------------------------------
  Convert Strategic Initiatives into Execution Items
  --------------------------------------------------
  */

  for (const initiative of input.planning.initiatives) {

    const progress =
      initiative.status === "Completed"
        ? 100
        : initiative.status === "Active"
        ? 50
        : 0;

    const confidence =
      input.planning.summary.planningConfidence;

    executions.push({

      title: initiative.title,

      description: initiative.description,

      status:
        initiative.status === "Completed"
          ? "Completed"
          : initiative.status === "Active"
          ? "In Progress"
          : "Not Started",

      progress,

      confidence,

    });

  }

  /*
  --------------------------------------------------
  Default Execution Item
  --------------------------------------------------
  */

  if (executions.length === 0) {

    executions.push({

      title:
        "Portfolio Execution",

      description:
        "No active strategic initiatives available for execution tracking.",

      status:
        "Not Started",

      progress: 0,

      confidence:
        input.planning.summary.planningConfidence,

    });

  }

  return executions;

}

function buildExecutionSummary(

  input: ExecutionInput,

  executions: ExecutionItem[],

): ExecutionSummary {

  const overallProgress =
    executions.length === 0
      ? 0
      : executions.reduce(
          (sum, execution) =>
            sum + execution.progress,
          0,
        ) / executions.length;

  const deliveryConfidence =
    input.planning.summary.planningConfidence;

  let executionHealth:
    ExecutionSummary["executionHealth"];

  if (overallProgress >= 90) {

    executionHealth = "Excellent";

  } else if (overallProgress >= 70) {

    executionHealth = "Good";

  } else if (overallProgress >= 40) {

    executionHealth = "Needs Attention";

  } else {

    executionHealth = "Critical";

  }

  const executiveOverview =
    `Execution progress is ${overallProgress.toFixed(
      1,
    )}% across ${executions.length} tracked execution item${
      executions.length === 1 ? "" : "s"
    }. Delivery confidence is ${deliveryConfidence.toFixed(
      1,
    )}% with overall execution health rated as ${executionHealth}.`;

  return {

    overallProgress,

    executionHealth,

    deliveryConfidence,

    executiveOverview,

  };

}