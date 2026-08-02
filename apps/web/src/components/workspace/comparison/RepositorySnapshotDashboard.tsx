import {
  DashboardSection,
  DashboardGrid,
  MetricCard,
  BaseCard,
} from "@/components/ui";

import {
  Activity,
  Briefcase,
  Factory,
  Database,
  Layers,
  Shield,
} from "@/components/ui";

import type {
  PortfolioSnapshot,
  SnapshotComparison,
} from "@/lib/github/repositorySnapshotService";
interface RepositorySnapshotDashboardProps {
  latestSnapshot?: PortfolioSnapshot;
  previousSnapshot?: PortfolioSnapshot;
  snapshotComparison?: SnapshotComparison;
}
export function RepositorySnapshotDashboard({

  latestSnapshot,

  previousSnapshot,

  snapshotComparison,

}: RepositorySnapshotDashboardProps) {

  if (!latestSnapshot) {

    return (

      <DashboardSection
        title="Repository Snapshot Service"
        description="Historical snapshot collection for engineering intelligence."
      >

        <BaseCard variant="warning" title="No Snapshot Available">

          <p className="text-sm text-zinc-300">

            Repository analysis has not yet produced
            a portfolio snapshot.

            Run the snapshot service to generate
            the first engineering intelligence report.

          </p>

        </BaseCard>

      </DashboardSection>

    );

  }

  const latest = latestSnapshot;

  return (

<DashboardSection

  title="Repository Snapshot Service"

  description="Historical snapshot collection for engineering intelligence."

  className="mt-10"

>
<BaseCard>
      <DashboardGrid columns={3}>

        {/* <ExecutiveCard
          title="Snapshots"
          value={`${history.length}`}
        /> */}

        <MetricCard

  title="Repositories"

  value={latest.metrics.repositoryCount}

  icon={
    <Database
      className="h-6 w-6 text-cyan-400"
    />
  }

/>

        <MetricCard

  title="Portfolio Score"

  value={latest.metrics.overallPortfolioScore}

  precision={1}

  suffix="%"

  icon={
    <Activity
      className="h-6 w-6 text-emerald-400"
    />
  }

/>

       <MetricCard

  title="Version"

  value={latest.metadata.version}

  icon={
    <Layers
      className="h-6 w-6 text-amber-400"
    />
  }

/>

      </DashboardGrid>
      </BaseCard>

      <DashboardSection
  title="Repository Snapshots"
  description="Compare the latest portfolio snapshot against the previous capture."
  className="mt-10"
>

        <DashboardGrid columns={2}>

  <SnapshotCard
    title="Latest Snapshot"
    snapshot={latestSnapshot}
  />

  {previousSnapshot && (

    <SnapshotCard
      title="Previous Snapshot"
      snapshot={previousSnapshot}
    />

  )}

</DashboardGrid>


      </DashboardSection>
          {snapshotComparison && (

  <DashboardSection
    title="Portfolio Change"
    description="Engineering evolution compared with the previous snapshot."
  >
    <BaseCard>
    <DashboardGrid
  columns={3}
  className="mt-4"
>

      <MetricCard
  title="Engineering"
  value={latest.metrics.averageEngineeringScore}
  suffix="%"
  change={snapshotComparison.engineeringDelta}
  precision={1}
  icon={
    <Activity className="h-5 w-5 text-cyan-400" />
  }
/>
<MetricCard
  title="Security"
  value={latest.metrics.averageSecurityScore}
  suffix="%"
  change={snapshotComparison.securityDelta}
  precision={1}
  icon={
    <Shield className="h-5 w-5 text-emerald-400" />
  }
/>
<MetricCard
  title="Production"
  value={latest.metrics.averageProductionScore}
  suffix="%"
  change={snapshotComparison.productionDelta}
  precision={1}
  icon={
    <Factory className="h-5 w-5 text-amber-400" />
  }
/>
      
      <MetricCard
  title="Enterprise"
  value={latest.metrics.averageEnterpriseScore}
  suffix="%"
  change={snapshotComparison.enterpriseDelta}
  precision={1}
  icon={
    <Layers className="h-5 w-5 text-purple-400" />
  }
/>

<MetricCard
  title="Hiring"
  value={latest.metrics.averageHiringScore}
  suffix="%"
  change={snapshotComparison.hiringDelta}
  precision={1}
  icon={
    <Briefcase className="h-5 w-5 text-blue-400" />
  }
/>
      
<MetricCard
  title="Overall"
  value={latest.metrics.overallPortfolioScore}
  suffix="%"
  change={snapshotComparison.overallDelta}
  precision={1}
  icon={
    <Activity className="h-5 w-5 text-red-400" />
  }
/>


    </DashboardGrid>
    </BaseCard>

  </DashboardSection>
)}
    </DashboardSection>
    
  );
  
}




interface SnapshotCardProps {

  title: string;

  snapshot: PortfolioSnapshot;

}

function SnapshotCard({

  title,

  snapshot,

}: SnapshotCardProps) {

  return (

    <BaseCard
      title={title}
      variant="default"
    >

      <div className="space-y-4">

        <SnapshotMetric
          label="Captured"
          value={snapshot.metadata.capturedAt.toLocaleString()}
        />

        <SnapshotMetric
          label="Repositories"
          value={snapshot.metrics.repositoryCount}
        />

        <SnapshotMetric
          label="Portfolio Score"
          value={`${snapshot.metrics.overallPortfolioScore.toFixed(
            1,
          )}%`}
        />

        <SnapshotMetric
          label="Version"
          value={snapshot.metadata.version}
        />

      </div>

    </BaseCard>

  );

}
interface SnapshotMetricProps {

  label: string;

  value: string | number;

}

function SnapshotMetric({

  label,

  value,

}: SnapshotMetricProps) {

  return (

    <div className="flex items-center justify-between">

      <span className="text-sm text-zinc-400">

        {label}

      </span>

      <span className="font-medium">

        {value}

      </span>

    </div>

  );

}