import {

  DashboardGrid,
  DashboardSection,

  BaseCard,
  ExecutiveCard,
  MetricCard,
  StatusBadge,

} from "@/components/ui";

import {

  Brain,
  ClipboardCheck,
  Target,

} from "@/components/ui";

import type {

  DecisionIntelligence,

} from "@/types/decision";

interface RepositoryDecisionDashboardProps {

  decision: DecisionIntelligence;

}

export function RepositoryDecisionDashboard({

  decision,

}: RepositoryDecisionDashboardProps) {

  return (

    <DashboardSection

      title="Portfolio Decision Intelligence"

      description="Strategic engineering decisions generated from executive intelligence."

    >

      <DashboardGrid columns={3}>

        <MetricCard

          title="Decision Confidence"

          value={decision.summary.overallConfidence}

          suffix="%"

          precision={1}

          icon={
            <Brain
              className="h-6 w-6 text-cyan-400"
            />
          }

        />

        <MetricCard

          title="Strategic Priority"

          value={decision.summary.strategicPriority}

          icon={
            <Target
              className="h-6 w-6 text-amber-400"
            />
          }

        />

        <MetricCard

          title="Engineering Decisions"

          value={decision.decisions.length}

          icon={
            <ClipboardCheck
              className="h-6 w-6 text-emerald-400"
            />
          }

        />

      </DashboardGrid>

      <ExecutiveCard

        title="Decision Overview"

        summary={
          decision.summary.executiveOverview
        }

      />

        <DashboardSection

  title="Engineering Decisions"

  description="Prioritized engineering actions recommended by the Decision Intelligence Engine."

>

  <div className="space-y-4">

    {decision.decisions.map(

      (engineeringDecision) => (

        <BaseCard

          key={engineeringDecision.title}

          title={engineeringDecision.title}

          variant="default"

        >

          <div className="space-y-4">

            <p className="text-sm text-zinc-300">

              {engineeringDecision.description}

            </p>

            <DashboardGrid columns={3}>

              <MetricCard

                title="Impact"

                value={engineeringDecision.impact}

              />

              <MetricCard

                title="Confidence"

                value={engineeringDecision.confidence}

                suffix="%"

                precision={1}

              />

              <StatusBadge

                variant={
                  engineeringDecision.priority === "Critical"
                    ? "danger"
                    : engineeringDecision.priority === "High"
                    ? "warning"
                    : engineeringDecision.priority === "Medium"
                    ? "info"
                    : "success"
                }

              >

                {engineeringDecision.priority}

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