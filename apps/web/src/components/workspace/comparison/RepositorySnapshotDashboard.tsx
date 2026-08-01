import { TrendMetricCard } from "@/components/ui/TrendMetricCard";
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
    
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">
        Repository Snapshot Service
      </h2>

      <p className="mt-4 text-sm text-muted-foreground">
        No repository snapshot is available.
      </p>
    </div>
  );
}

  const latest = latestSnapshot;
//   if (!latest) {
//     return (
//       <div className="rounded-xl border p-6">
//         <h2 className="text-xl font-semibold">
//           Repository Snapshot Service
//         </h2>

//         <p className="mt-4 text-sm text-muted-foreground">
//           No repository snapshots have been captured.
//         </p>
//       </div>
//     );
//   }

  return (
    <div className="rounded-xl border p-6 space-y-6">

      <div>

        <h2 className="text-xl font-semibold">
          Repository Snapshot Service
        </h2>

        <p className="text-sm text-muted-foreground">
          Historical snapshot collection for engineering intelligence.
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-3">

        {/* <ExecutiveCard
          title="Snapshots"
          value={`${history.length}`}
        /> */}

        <ExecutiveCard
          title="Repositories"
          value={`${latest.metrics.repositoryCount}`}
        />

        <ExecutiveCard
          title="Portfolio Score"
          value={`${Math.round(
            latest.metrics.overallPortfolioScore,
          )}`}
        />

        <ExecutiveCard
          title="Version"
          value={latest.metadata.version}
        />

      </div>

      <div className="rounded-lg border p-4">

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


      </div>
          {snapshotComparison && (
  <div className="rounded-lg border p-4">

    <h3 className="font-semibold">
      Portfolio Change
    </h3>

    <div className="mt-4 grid gap-4 md:grid-cols-3">

      <TrendMetricCard
  title="Engineering"
  value={latestSnapshot.metrics.averageEngineeringScore}
  delta={snapshotComparison.engineeringDelta}
/>
<TrendMetricCard
  title="Security"
  value={latestSnapshot.metrics.averageSecurityScore}
  delta={snapshotComparison.securityDelta}
/>
<TrendMetricCard
  title="Production"
  value={latestSnapshot.metrics.averageProductionScore}
  delta={snapshotComparison.productionDelta}
/>
      
      <TrendMetricCard
  title="Enterprise"
  value={latestSnapshot.metrics.averageEnterpriseScore}
  delta={snapshotComparison.enterpriseDelta}
/>

<TrendMetricCard
  title="Hiring"
  value={latestSnapshot.metrics.averageHiringScore}
  delta={snapshotComparison.hiringDelta}
/>
      
<TrendMetricCard
  title="Overall"
  value={latestSnapshot.metrics.overallPortfolioScore}
  delta={snapshotComparison.overallDelta}
/>


    </div>

  </div>
)}
    </div>
    
  );
  
}

interface ExecutiveCardProps {
  title: string;
  value: string;
}

function ExecutiveCard({
  title,
  value,
}: ExecutiveCardProps) {
  return (
    <div className="rounded-lg border p-4">

      <div className="text-sm text-muted-foreground">
        {title}
      </div>

      <div className="mt-2 text-2xl font-bold">
        {value}
      </div>

    </div>
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

    <div className="rounded-xl border p-5 space-y-4">

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <div className="space-y-2 text-sm">

        <div className="flex justify-between">

          <span className="text-muted-foreground">
            Captured
          </span>

          <span>
            {snapshot.metadata.capturedAt.toLocaleString()}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-muted-foreground">
            Repositories
          </span>

          <span>
            {snapshot.metrics.repositoryCount}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-muted-foreground">
            Portfolio Score
          </span>

          <span className="font-semibold">
            {snapshot.metrics.overallPortfolioScore.toFixed(2)}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-muted-foreground">
            Version
          </span>

          <span>
            {snapshot.metadata.version}
          </span>

        </div>

      </div>

    </div>

  );

}