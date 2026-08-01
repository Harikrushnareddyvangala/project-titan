import type {
  PortfolioHistoricalTrend,
  TrendDirection,
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

      <div>

        <h2 className="text-2xl font-bold">
          Historical Trend Analytics
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Long-term engineering intelligence across portfolio snapshots.
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <MetricCard
          title="Snapshots"
          value={
            historicalTrend.summary.snapshotCount
          }
        />

        <MetricCard
          title="Repositories"
          value={
            historicalTrend.summary.repositoryCount
          }
        />

        <MetricCard
          title="Portfolio Stability"
          value={`${historicalTrend.summary.portfolioStability.toFixed(
            1,
          )}%`}
        />

        <MetricCard
          title="Trend Confidence"
          value={`${historicalTrend.summary.trendConfidence.toFixed(
            1,
          )}%`}
        />

      </div>

      <section className="rounded-xl border border-white/10 bg-black/20 p-6">

        <h3 className="text-lg font-semibold">
          Executive Intelligence
        </h3>

        <div className="mt-5 space-y-5">

          <div>

            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Title
            </div>

            <div className="mt-2 text-xl font-bold">
              {historicalTrend.executiveInsight.title}
            </div>

          </div>

          <div>

            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Summary
            </div>

            <p className="mt-2 leading-7 text-zinc-300">
              {
                historicalTrend.executiveInsight
                  .summary
              }
            </p>

          </div>

          <div>

            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Recommendation
            </div>

            <p className="mt-2 leading-7 text-cyan-300">
              {
                historicalTrend.executiveInsight
                  .recommendation
              }
            </p>

          </div>

        </div>

      </section>

      <section className="rounded-xl border border-white/10 bg-black/20 p-6">

        <h3 className="mb-5 text-lg font-semibold">
          Portfolio Growth
        </h3>

        <div className="grid gap-4 md:grid-cols-3">

          <GrowthCard
            title="Engineering"
            value={
              historicalTrend.summary
                .averageEngineeringGrowth
            }
          />

          <GrowthCard
            title="Security"
            value={
              historicalTrend.summary
                .averageSecurityGrowth
            }
          />

          <GrowthCard
            title="Production"
            value={
              historicalTrend.summary
                .averageProductionGrowth
            }
          />

          <GrowthCard
            title="Enterprise"
            value={
              historicalTrend.summary
                .averageEnterpriseGrowth
            }
          />

          <GrowthCard
            title="Hiring"
            value={
              historicalTrend.summary
                .averageHiringGrowth
            }
          />

          <GrowthCard
            title="Overall"
            value={
              historicalTrend.summary
                .overallPortfolioGrowth
            }
          />

        </div>

      </section>
            <section className="rounded-xl border border-white/10 bg-black/20 p-6">

        <h3 className="mb-5 text-lg font-semibold">
          Historical Highlights
        </h3>

        <div className="grid gap-4 md:grid-cols-3">

          <ExecutiveCard
            title="Fastest Growing"
            value={
              historicalTrend.highlights
                .fastestGrowingRepository
            }
          />

          <ExecutiveCard
            title="Most Stable"
            value={
              historicalTrend.highlights
                .mostStableRepository
            }
          />

          <ExecutiveCard
            title="Highest Engineering"
            value={
              historicalTrend.highlights
                .highestEngineeringRepository
            }
          />

          <ExecutiveCard
            title="Highest Security"
            value={
              historicalTrend.highlights
                .highestSecurityRepository
            }
          />

          <ExecutiveCard
            title="Highest Production"
            value={
              historicalTrend.highlights
                .highestProductionRepository
            }
          />

          <ExecutiveCard
            title="Needs Attention"
            value={
              historicalTrend.highlights
                .needsAttentionRepository
            }
          />

        </div>

      </section>

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

    </div>

  );

}
interface MetricCardProps {
  title: string;
  value: string | number;
}

function MetricCard({
  title,
  value,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-5">

      <div className="text-sm uppercase tracking-wider text-zinc-500">
        {title}
      </div>

      <div className="mt-3 text-3xl font-bold text-white">
        {value}
      </div>

    </div>
  );
}

interface GrowthCardProps {
  title: string;
  value: number;
}

function GrowthCard({
  title,
  value,
}: GrowthCardProps) {

  const positive = value > 0;
  const negative = value < 0;

  const color = positive
    ? "text-emerald-400"
    : negative
      ? "text-red-400"
      : "text-zinc-300";

  const icon = positive
    ? "▲"
    : negative
      ? "▼"
      : "●";

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-5">

      <div className="text-sm uppercase tracking-wider text-zinc-500">
        {title}
      </div>

      <div className={`mt-3 text-3xl font-bold ${color}`}>

        {icon}{" "}
        {value >= 0 ? "+" : ""}
        {value.toFixed(2)}

      </div>

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

    <div className="rounded-xl border border-white/10 bg-black/30 p-5">

      <div className="text-sm uppercase tracking-wider text-zinc-500">
        {title}
      </div>

      <div className="mt-3 text-lg font-semibold text-white">

        {value || "N/A"}

      </div>

    </div>

  );

}

function GrowthBadge({
  value,
}: {
  value: number;
}) {

  const positive = value > 0;
  const negative = value < 0;

  const color = positive
    ? "text-emerald-400"
    : negative
      ? "text-red-400"
      : "text-zinc-300";

  const icon = positive
    ? "▲"
    : negative
      ? "▼"
      : "●";

  return (

    <span className={`font-semibold ${color}`}>

      {icon}{" "}
      {value >= 0 ? "+" : ""}
      {value.toFixed(2)}

    </span>

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
    <div className="rounded-xl border border-white/10 bg-black/30 p-6">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <div className="text-lg font-semibold">
              {repository.repositoryName}
            </div>

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

    </div>
  );
}

function TrendBadge({
  direction,
}: {
  direction: TrendDirection;
}) {

  const styles: Record<
    TrendDirection,
    string
  > = {
    "Rapid Growth":
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

    Growing:
      "border-green-500/30 bg-green-500/10 text-green-300",

    Stable:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",

    Declining:
      "border-orange-500/30 bg-orange-500/10 text-orange-300",

    Critical:
      "border-red-500/30 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[direction]}`}
    >
      {direction}
    </span>
  );
}