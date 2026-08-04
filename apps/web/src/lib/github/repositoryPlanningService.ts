import type {

  PlanningInput,
  PlanningIntelligence,
  PlanningSummary,
  StrategicInitiative,

} from "@/types/planning";

export function buildPlanningIntelligence(

  input: PlanningInput,

): PlanningIntelligence {

  const initiatives =
    buildStrategicInitiatives(
      input,
    );

  const summary =
    buildPlanningSummary(
      input,
      initiatives,
    );

  return {

    initiatives,

    summary,

  };

}

function buildStrategicInitiatives(

  input: PlanningInput,

): StrategicInitiative[] {

  const initiatives: StrategicInitiative[] = [];

  /*
  --------------------------------------------------
  Convert Engineering Decisions into Initiatives
  --------------------------------------------------
  */

  for (const decision of input.decision.decisions) {

    initiatives.push({

      title: decision.title,

      description: decision.description,

      priority:
        decision.priority,

      status:
        "Planned",

      horizon:
        decision.priority === "Critical"
          ? "30 Days"
          : decision.priority === "High"
          ? "90 Days"
          : decision.priority === "Medium"
          ? "6 Months"
          : "12 Months",

    });

  }

  /*
  --------------------------------------------------
  Default Initiative
  --------------------------------------------------
  */

  if (initiatives.length === 0) {

    initiatives.push({

      title:
        "Maintain Engineering Excellence",

      description:
        "Continue incremental engineering improvements while monitoring portfolio intelligence.",

      priority:
        "Low",

      status:
        "Planned",

      horizon:
        "12 Months",

    });

  }

  return initiatives;

}

function buildPlanningSummary(

  input: PlanningInput,

  initiatives: StrategicInitiative[],

): PlanningSummary {

  const planningConfidence =
    input.decision.summary.overallConfidence;

  const activeInitiatives =
    initiatives.filter(
      (initiative) =>
        initiative.status === "Active",
    ).length;

  const roadmapHorizon =
    initiatives.some(
      (initiative) =>
        initiative.horizon === "12 Months",
    )
      ? "12 Months"
      : initiatives.some(
            (initiative) =>
              initiative.horizon === "6 Months",
          )
        ? "6 Months"
        : initiatives.some(
              (initiative) =>
                initiative.horizon === "90 Days",
            )
          ? "90 Days"
          : "30 Days";

  const executiveOverview =
    `Generated ${initiatives.length} strategic initiative${
      initiatives.length === 1 ? "" : "s"
    } with ${planningConfidence.toFixed(
      1,
    )}% planning confidence. Primary roadmap horizon is ${roadmapHorizon}.`;

  return {

    planningConfidence,

    activeInitiatives,

    roadmapHorizon,

    executiveOverview,

  };

}