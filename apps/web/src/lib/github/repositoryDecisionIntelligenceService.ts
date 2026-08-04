import type {

  DecisionInput,
  DecisionIntelligence,
  DecisionSummary,
  EngineeringDecision,

} from "@/types/decision";
export function buildDecisionIntelligence(

  input: DecisionInput,

): DecisionIntelligence {

  const decisions =
    buildEngineeringDecisions(
      input,
    );

  const summary =
    buildDecisionSummary(
      input,
      decisions,
    );

  return {

    decisions,

    summary,

  };

}
function buildEngineeringDecisions(

  input: DecisionInput,

): EngineeringDecision[] {

  const decisions: EngineeringDecision[] = [];

  /*
  --------------------------------------------------
  Executive Recommendations
  --------------------------------------------------
  */

  for (const recommendation of input.executive.recommendations) {

    decisions.push({

      title: recommendation.title,

      description: recommendation.description,

      priority:
        recommendation.priority === "Immediate"
          ? "Critical"
          : recommendation.priority,

      impact:
        recommendation.priority === "Immediate"
          ? "Transformational"
          : recommendation.priority === "High"
          ? "High"
          : recommendation.priority === "Medium"
          ? "Moderate"
          : "Low",

      confidence:
        input.executive.portfolioHealth.confidence,

      status:
        "Recommended",

    });

  }

  /*
  --------------------------------------------------
  Fallback Decision
  --------------------------------------------------
  */

  if (decisions.length === 0) {

    decisions.push({

      title:
        "Continue Engineering Strategy",

      description:
        "Current portfolio intelligence indicates stable engineering performance with no immediate strategic interventions required.",

      priority:
        "Low",

      impact:
        "Low",

      confidence:
        input.executive.portfolioHealth.confidence,

      status:
        "Recommended",

    });

  }

  return decisions;

}

function buildDecisionSummary(

  input: DecisionInput,

  decisions: EngineeringDecision[],

): DecisionSummary {

  const overallConfidence =
    input.executive.portfolioHealth.confidence;

  const hasCritical =
    decisions.some(
      (decision) =>
        decision.priority === "Critical",
    );

  const hasHigh =
    decisions.some(
      (decision) =>
        decision.priority === "High",
    );

  let strategicPriority:
    DecisionSummary["strategicPriority"];

  if (hasCritical) {

    strategicPriority = "Critical";

  } else if (hasHigh) {

    strategicPriority = "High";

  } else if (
    decisions.some(
      (decision) =>
        decision.priority === "Medium",
    )
  ) {

    strategicPriority = "Medium";

  } else {

    strategicPriority = "Low";

  }

  const executiveOverview =
    `Generated ${decisions.length} engineering decision${
      decisions.length === 1 ? "" : "s"
    } with ${overallConfidence.toFixed(
      1,
    )}% confidence. Strategic priority is ${strategicPriority}.`;

  return {

    overallConfidence,

    strategicPriority,

    executiveOverview,

  };

}