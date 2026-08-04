import {

  DashboardGrid,
  DashboardSection,

  BaseCard,
  ExecutiveCard,
  MetricCard,
  StatusBadge,

} from "@/components/ui";

import {

  Calendar,
  ClipboardList,
  Compass,

} from "@/components/ui";

import type {

  PlanningIntelligence,

} from "@/types/planning";

interface RepositoryPlanningDashboardProps {

  planning: PlanningIntelligence;

}

export function RepositoryPlanningDashboard({

  planning,

}: RepositoryPlanningDashboardProps) {

  return (

    <DashboardSection

      title="Strategic Planning Intelligence"

      description="Engineering roadmap and strategic initiatives generated from Decision Intelligence."

    >

      <DashboardGrid columns={3}>

        <MetricCard

          title="Planning Confidence"

          value={planning.summary.planningConfidence}

          suffix="%"

          precision={1}

          icon={
            <Compass
              className="h-6 w-6 text-cyan-400"
            />
          }

        />

        <MetricCard

          title="Roadmap Horizon"

          value={planning.summary.roadmapHorizon}

          icon={
            <Calendar
              className="h-6 w-6 text-amber-400"
            />
          }

        />

        <MetricCard

          title="Strategic Initiatives"

          value={planning.initiatives.length}

          icon={
            <ClipboardList
              className="h-6 w-6 text-emerald-400"
            />
          }

        />

      </DashboardGrid>

      <ExecutiveCard

        title="Planning Overview"

        summary={
          planning.summary.executiveOverview
        }

      />
      <DashboardSection

  title="Strategic Initiatives"

  description="Engineering initiatives prioritized by the Strategic Planning Intelligence Engine."

>

  <div className="space-y-4">

    {planning.initiatives.map(

      (initiative) => (

        <BaseCard

          key={initiative.title}

          title={initiative.title}

          variant="default"

        >

          <div className="space-y-4">

            <p className="text-sm text-zinc-300">

              {initiative.description}

            </p>

            <DashboardGrid columns={3}>

              <MetricCard

                title="Planning Horizon"

                value={initiative.horizon}

              />

              <StatusBadge

                variant={
                  initiative.priority === "Critical"
                    ? "danger"
                    : initiative.priority === "High"
                    ? "warning"
                    : initiative.priority === "Medium"
                    ? "info"
                    : "success"
                }

              >

                {initiative.priority}

              </StatusBadge>

              <StatusBadge

                variant={
                  initiative.status === "Completed"
                    ? "success"
                    : initiative.status === "Active"
                    ? "info"
                    : "neutral"
                }

              >

                {initiative.status}

              </StatusBadge>

            </DashboardGrid>

          </div>

        </BaseCard>

      ),

    )}

  </div>

</DashboardSection>

    </DashboardSection>

  );

}