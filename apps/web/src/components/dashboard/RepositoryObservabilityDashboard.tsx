import {

  DashboardGrid,
  DashboardSection,

  BaseCard,
  MetricCard,

} from "@/components/ui";

import {

  ExecutiveSummary,

} from "@/components/intelligence";

import type {

  EngineeringObservability,

} from "@/types/observability";

interface RepositoryObservabilityDashboardProps {

  observability: EngineeringObservability;

}
export function RepositoryObservabilityDashboard({

  observability,

}: RepositoryObservabilityDashboardProps) {

  return (

    <DashboardSection

      title="Engineering Observability"

      description="Longitudinal engineering trends, regression detection, and release readiness."

    >

    
<DashboardGrid columns={3}>

  <MetricCard

    title="Engineering KPIs"

    value={observability.kpis.length}

  />

  <MetricCard

    title="Regression Alerts"

    value={observability.regressions.length}

  />

  <MetricCard

    title="Release Readiness"

    value={observability.releaseReadiness.score}

    suffix="%"

  />

</DashboardGrid>
<ExecutiveSummary

  title="Observability Summary"

  summary={
    observability.summary.executiveNarrative
  }

/>
<DashboardSection

  title="Engineering KPIs"

  description="Current engineering performance indicators."

>

  <div className="space-y-4">

    {observability.kpis.map((kpi) => (

      <BaseCard

        key={kpi.title}

        title={kpi.title}

        variant="default"

      >

        <p>

          Current: {kpi.currentValue}

        </p>

        <p>

          Previous: {kpi.previousValue}

        </p>

        <p>

          Change: {kpi.change}

        </p>

        <p>

          Trend: {kpi.direction}

        </p>

      </BaseCard>

    ))}

  </div>

</DashboardSection>
<DashboardSection

  title="Regression Alerts"

  description="Engineering regressions requiring attention."

>

  <div className="space-y-4">

    {observability.regressions.length === 0 ? (

      <BaseCard

        title="No Active Regressions"

        variant="default"

      >

        <p>

          No engineering regressions detected.

        </p>

      </BaseCard>

    ) : (

      observability.regressions.map(

        (alert) => (

          <BaseCard

            key={alert.title}

            title={alert.title}

            variant="default"

          >

            <p>

              {alert.description}

            </p>

            <p className="mt-2 text-xs text-amber-300">

              Severity: {alert.severity}

            </p>

          </BaseCard>

        ),

      )

    )}

  </div>

</DashboardSection>
</DashboardSection>

  );

}