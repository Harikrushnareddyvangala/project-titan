import type {

  AdvisorInput,
  AdvisorInsight,
  AdvisorIntelligence,
  AdvisorSummary,

} from "@/types/advisor";
export function buildAdvisorIntelligence(

  input: AdvisorInput,

): AdvisorIntelligence {

  const insights =
    buildAdvisorInsights(
      input,
    );

  const summary =
    buildAdvisorSummary(
      input,
      insights,
    );

  return {

    insights,

    summary,

  };

}
function buildAdvisorInsights(

  input: AdvisorInput,

): AdvisorInsight[] {

  const insights: AdvisorInsight[] = [];

  /*
  --------------------------------------------------
  Overall Execution Progress
  --------------------------------------------------
  */

  if (
    input.execution.summary.overallProgress < 50
  ) {

    insights.push({

      title:
        "Execution Progress Below Target",

      summary:
        "Overall engineering execution is below the desired progress threshold. Prioritize completion of active initiatives before expanding the roadmap.",

      category:
        "Execution",

      severity:
        "Warning",

    });

  }

  /*
  --------------------------------------------------
  Delivery Confidence
  --------------------------------------------------
  */

  if (
    input.execution.summary.deliveryConfidence < 70
  ) {

    insights.push({

      title:
        "Low Delivery Confidence",

      summary:
        "Current delivery confidence indicates elevated uncertainty. Review execution risks and validate planning assumptions.",

      category:
        "Planning",

      severity:
        "Recommendation",

    });

  }

  /*
  --------------------------------------------------
  Execution Health
  --------------------------------------------------
  */

  if (
    input.execution.summary.executionHealth ===
    "Critical"
  ) {

    insights.push({

      title:
        "Critical Execution Health",

      summary:
        "Engineering execution health is critical. Immediate leadership attention is recommended to remove delivery blockers.",

      category:
        "Execution",

      severity:
        "Critical",

    });

  }

  /*
  --------------------------------------------------
  Positive Portfolio State
  --------------------------------------------------
  */

  if (insights.length === 0) {

    insights.push({

      title:
        "Portfolio Performing Well",

      summary:
        "Execution metrics indicate a healthy engineering portfolio. Continue monitoring delivery while preparing future strategic initiatives.",

      category:
        "Portfolio",

      severity:
        "Information",

    });

  }

  return insights;

}

function buildAdvisorSummary(

  input: AdvisorInput,

  insights: AdvisorInsight[],

): AdvisorSummary {

  const confidence =
    input.execution.summary.deliveryConfidence;

  const executiveNarrative =
    `Generated ${insights.length} engineering advisor insight${
      insights.length === 1 ? "" : "s"
    } based on execution progress of ${input.execution.summary.overallProgress.toFixed(
      1,
    )}%. Current delivery confidence is ${confidence.toFixed(
      1,
    )}%, with execution health assessed as ${input.execution.summary.executionHealth}.`;

  return {

    executiveNarrative,

    confidence,

  };

}