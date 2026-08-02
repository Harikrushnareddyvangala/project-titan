import {
  DashboardSection,
  DashboardGrid,
  MetricCard,
  ExecutiveCard,
  DeltaMetricCard,
  BaseCard,
  GrowthBadge,
  TrendBadge,  
  Database,
  Shield,
  TrendingUp,
} from "@/components/ui";

import type {
  PortfolioHistoricalTrend,
} from "@/lib/github/repositoryHistoricalTrendService";

interface RepositoryHistoricalTrendDashboardProps {
  historicalTrend: PortfolioHistoricalTrend;
}

export function RepositoryHistoricalTrendDashboard({
  historicalTrend,
}: RepositoryHistoricalTrendDashboardProps) {

  const rankedRepositories = [
    ...historicalTrend.repositories,
  ].sort(
    (a, b) =>
      b.overallGrowth -
      a.overallGrowth,
  );

  return (
    <div className="space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8">

      <DashboardSection
  title="Historical Trend Analytics"
  description="Long-term engineering intelligence across portfolio snapshots."
> 

      <DashboardGrid columns={4}>

        <MetricCard
  title="Snapshots"
  value={historicalTrend.summary.snapshotCount}
  icon={
    <Database className="h-6 w-6 text-cyan-400" />
  }
/>

<MetricCard
  title="Repositories"
  value={historicalTrend.summary.repositoryCount}
  icon={
    <Database className="h-6 w-6 text-blue-400" />
  }
/>

<MetricCard
  title="Portfolio Stability"
  value={historicalTrend.summary.portfolioStability}
  suffix="%"
  precision={1}
  icon={
    <Shield className="h-6 w-6 text-emerald-400" />
  }
/>

<MetricCard
  title="Trend Confidence"
  value={historicalTrend.summary.trendConfidence}
  suffix="%"
  precision={1}
  icon={
    <TrendingUp className="h-6 w-6 text-purple-400" />
  }
/>

      </DashboardGrid> 

      <DashboardSection
  className="mt-10"
>

  <ExecutiveCard

    title={
      historicalTrend.executiveInsight.title
    }

    summary={
      historicalTrend.executiveInsight.summary
    }

    recommendation={
      historicalTrend.executiveInsight.recommendation
    }

  />

</DashboardSection>

      <DashboardSection

  title="Portfolio Growth"

  className="mt-10"

>

  <BaseCard>

    <DashboardGrid columns={3}>

      <DeltaMetricCard

        title="Engineering"

        value={
          historicalTrend.summary
            .averageEngineeringGrowth
        }

      />

      <DeltaMetricCard

        title="Security"

        value={
          historicalTrend.summary
            .averageSecurityGrowth
        }

      />

      <DeltaMetricCard

        title="Production"

        value={
          historicalTrend.summary
            .averageProductionGrowth
        }

      />

      <DeltaMetricCard

        title="Enterprise"

        value={
          historicalTrend.summary
            .averageEnterpriseGrowth
        }

      />

      <DeltaMetricCard

        title="Hiring"

        value={
          historicalTrend.summary
            .averageHiringGrowth
        }

      />

      <DeltaMetricCard

        title="Overall"

        value={
          historicalTrend.summary
            .overallPortfolioGrowth
        }

      />

    </DashboardGrid>

  </BaseCard>

</DashboardSection>
            <DashboardSection

  title="Historical Highlights"

  className="mt-10"

>

  <BaseCard>

    <DashboardGrid columns={3}>

      <MetricCard

        title="Fastest Growing"

        value={
          historicalTrend.highlights
            .fastestGrowingRepository
        }

      />

      <MetricCard

        title="Most Stable"

        value={
          historicalTrend.highlights
            .mostStableRepository
        }

      />

      <MetricCard

        title="Highest Engineering"

        value={
          historicalTrend.highlights
            .highestEngineeringRepository
        }

      />

      <MetricCard

        title="Highest Security"

        value={
          historicalTrend.highlights
            .highestSecurityRepository
        }

      />

      <MetricCard

        title="Highest Production"

        value={
          historicalTrend.highlights
            .highestProductionRepository
        }

      />

      <MetricCard

        title="Needs Attention"

        value={
          historicalTrend.highlights
            .needsAttentionRepository
        }

      />

    </DashboardGrid>

  </BaseCard>

</DashboardSection>

      <section className="rounded-xl border border-white/10 bg-black/20 p-6">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-lg font-semibold">
              Repository Historical Trends
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              Repository evolution ranked by
              historical growth.
            </p>

          </div>

        </div>

        {rankedRepositories.length === 0 ? (

          <div className="py-10 text-center text-zinc-500">

            No historical repository data
            available.

          </div>

        ) : (

          <div className="mt-6 space-y-4">

            {rankedRepositories.map(
              (
                repository,
                index,
              ) => (

                <RepositoryTrendRow
                  key={
                    repository.repositoryName
                  }
                  repository={repository}
                  portfolioLeader={
                    index === 0
                  }
                />

              ),
            )}

          </div>

        )}

      </section>

      <footer className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <div className="grid gap-6 md:grid-cols-3">

          <div>

            <div className="text-xs uppercase tracking-widest text-cyan-400">

              Historical Intelligence

            </div>

            <div className="mt-2 text-lg font-semibold">

              Generated from{" "}
              {
                historicalTrend.summary
                  .snapshotCount
              }{" "}
              snapshots

            </div>

          </div>

          <div>

            <div className="text-xs uppercase tracking-widest text-cyan-400">

              Portfolio

            </div>

            <div className="mt-2 text-lg font-semibold">

              {
                historicalTrend.summary
                  .repositoryCount
              }{" "}
              repositories analysed

            </div>

          </div>

          <div>

            <div className="text-xs uppercase tracking-widest text-cyan-400">

              Stability

            </div>

            <div className="mt-2 text-lg font-semibold">

              {
                historicalTrend.summary
                  .portfolioStability
                  .toFixed(1)
              }%

            </div>

          </div>

        </div>

      </footer>
</DashboardSection>
    </div>

  );

}

interface RepositoryTrendRowProps {
  repository: PortfolioHistoricalTrend["repositories"][number];
  portfolioLeader?: boolean;
}

function RepositoryTrendRow({
  repository,
  portfolioLeader = false,
}: RepositoryTrendRowProps) {
  return (
    <BaseCard

  title={repository.repositoryName}

>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            

            {portfolioLeader && (
              <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                🏆 Portfolio Leader
              </span>
            )}

            <TrendBadge
              direction={repository.trendDirection}
            />

          </div>

        </div>

        <div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">

          <div>

            <div className="text-xs uppercase tracking-wider text-zinc-500">
              Average
            </div>

            <div className="mt-2 text-xl font-bold">
              {repository.overallAverage.toFixed(1)}
            </div>

          </div>

          <div>

            <div className="text-xs uppercase tracking-wider text-zinc-500">
              Growth
            </div>

            <div className="mt-2">
              <GrowthBadge
                value={repository.overallGrowth}
              />
            </div>

          </div>

          <div className="min-w-[180px]">

            <div className="text-xs uppercase tracking-wider text-zinc-500">
              Stability
            </div>

            <div className="mt-2 font-semibold">
              {repository.stabilityIndex.toFixed(1)}%
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">

              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{
                  width: `${Math.min(
                    repository.stabilityIndex,
                    100,
                  )}%`,
                }}
              />

            </div>

          </div>

          <div className="min-w-[180px]">

            <div className="text-xs uppercase tracking-wider text-zinc-500">
              Confidence
            </div>

            <div className="mt-2 font-semibold">
              {repository.confidence.toFixed(1)}%
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">

              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{
                  width: `${Math.min(
                    repository.confidence,
                    100,
                  )}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

    </BaseCard>
  );
}