import {

  DashboardGrid,
  DashboardSection,

  ExecutiveCard,
  MetricCard,
  BaseCard,
  StatusBadge,

} from "@/components/ui";

import {

  Activity,
  Award,
  Brain,
  ClipboardCheck,

} from "@/components/ui";

import type {

  ExecutiveIntelligence,

} from "@/types/executive";

interface RepositoryExecutiveDashboardProps {

  executive: ExecutiveIntelligence;

}

export function RepositoryExecutiveDashboard({

  executive,

}: RepositoryExecutiveDashboardProps) {

  return (

    <DashboardSection

      title="Executive Engineering Intelligence"

      description="Enterprise-level engineering reasoning generated from portfolio intelligence."

    >

      <DashboardGrid columns={3}>

        <MetricCard

          title="Portfolio Health"

          value={executive.portfolioHealth.score}

          suffix="%"

          precision={1}

          icon={
            <Activity
              className="h-6 w-6 text-emerald-400"
            />
          }

        />

        <MetricCard

          title="Engineering Maturity"

          value={executive.portfolioHealth.maturity}

          icon={
            <Award
              className="h-6 w-6 text-amber-400"
            />
          }

        />

        <MetricCard

          title="Confidence"

          value={executive.portfolioHealth.confidence}

          suffix="%"

          precision={1}

          icon={
            <Brain
              className="h-6 w-6 text-cyan-400"
            />
          }

        />

      </DashboardGrid>

      <ExecutiveCard

  title={executive.summary.title}

  summary={executive.summary.overview}

/>

<DashboardSection

  title="Executive Findings"

  description="Cross-domain engineering intelligence synthesized from portfolio analysis."

>

  <div className="space-y-4">

    {executive.findings.map(

      (finding) => (

        <BaseCard

          key={finding.title}

          title={finding.title}

          variant="default"

        >

          <div className="space-y-3">

            <p className="text-sm text-zinc-300">

              {finding.description}

            </p>

            <div>

              <StatusBadge
                variant={
                  finding.severity === "Critical"
                    ? "danger"
                    : finding.severity === "High"
                    ? "warning"
                    : finding.severity === "Medium"
                    ? "info"
                    : "success"
                }
              >

                {finding.severity}

              </StatusBadge>

            </div>

          </div>

        </BaseCard>

      ),

    )}

  </div>

</DashboardSection>

<DashboardSection

  title="Executive Recommendations"

  description="Strategic engineering actions recommended by the Executive Intelligence Engine."

>

  <div className="space-y-4">

    {executive.recommendations.map(

      (recommendation) => (

        <BaseCard

          key={recommendation.title}

          title={recommendation.title}

          variant="default"

        >

          <div className="space-y-3">

            <p className="text-sm text-zinc-300">

              {recommendation.description}

            </p>

            <div>

              <StatusBadge

                variant={
                  recommendation.priority === "Immediate"
                    ? "danger"
                    : recommendation.priority === "High"
                    ? "warning"
                    : recommendation.priority === "Medium"
                    ? "info"
                    : "success"
                }

              >

                {recommendation.priority}

              </StatusBadge>

            </div>

          </div>

        </BaseCard>

      ),

    )}

  </div>

</DashboardSection>
    </DashboardSection>

  );

}