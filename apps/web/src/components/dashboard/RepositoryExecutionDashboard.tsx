import {

  DashboardGrid,
  DashboardSection,

  BaseCard,
  ExecutiveCard,
  MetricCard,
  StatusBadge,

} from "@/components/ui";

import {

  Activity,
  CheckCircle,
  Gauge,

} from "@/components/ui";
import { statusBadge, } from "@/components/ui/badges/utils";

import type {

  ExecutionIntelligence,

} from "@/types/execution";

interface RepositoryExecutionDashboardProps {

  execution: ExecutionIntelligence;

}

export function RepositoryExecutionDashboard({

  execution,

}: RepositoryExecutionDashboardProps) {

  return (

    <DashboardSection

      title="Engineering Execution Intelligence"

      description="Operational delivery tracking generated from Strategic Planning Intelligence."

    >

      <DashboardGrid columns={3}>

        <MetricCard

          title="Overall Progress"

          value={execution.summary.overallProgress}

          suffix="%"

          precision={1}

          icon={
            <Activity
              className="h-6 w-6 text-cyan-400"
            />
          }

        />

        <MetricCard

          title="Execution Health"

          value={execution.summary.executionHealth}

          icon={
            <Gauge
              className="h-6 w-6 text-amber-400"
            />
          }

        />

        <MetricCard

          title="Delivery Confidence"

          value={execution.summary.deliveryConfidence}

          suffix="%"

          precision={1}

          icon={
            <CheckCircle
              className="h-6 w-6 text-emerald-400"
            />
          }

        />

      </DashboardGrid>

      <ExecutiveCard

        title="Execution Overview"

        summary={
          execution.summary.executiveOverview
        }

      />
      <DashboardSection

  title="Execution Items"

  description="Operational execution items generated from Strategic Planning Intelligence."

>

  <div className="space-y-4">

    {execution.executions.map(

      (item) => (

        <BaseCard

          key={item.title}

          title={item.title}

          variant="default"

        >

          <div className="space-y-4">

            <p className="text-sm text-zinc-300">

              {item.description}

            </p>

            <DashboardGrid columns={3}>

              <MetricCard

                title="Progress"

                value={item.progress}

                suffix="%"

                precision={0}

              />

              <MetricCard

                title="Confidence"

                value={item.confidence}

                suffix="%"

                precision={1}

              />

              <StatusBadge

                variant={statusBadge(item.status)}

              >

                {item.status}

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