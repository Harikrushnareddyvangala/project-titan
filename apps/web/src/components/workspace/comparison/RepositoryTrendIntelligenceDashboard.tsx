import type { RepositoryTrendIntelligence } from "@/types/github";

interface RepositoryTrendIntelligenceDashboardProps {
  trend: RepositoryTrendIntelligence;
}

export function RepositoryTrendIntelligenceDashboard({
  trend,
}: RepositoryTrendIntelligenceDashboardProps) {
  return (
    <div className="rounded-xl border p-6 space-y-6">

      <div>
        <h2 className="text-xl font-semibold">
          Repository Trend Intelligence
        </h2>

        <p className="text-sm text-muted-foreground">
          Historical engineering trends and portfolio momentum.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <ExecutiveCard
          title="Trend Direction"
          value={trend.trendDirection}
        />

        <ExecutiveCard
          title="Overall Trend"
          value={`${Math.round(trend.overallTrend)}`}
        />

        <ExecutiveCard
          title="Strongest Trend"
          value={`${Math.round(
            Math.max(
              trend.engineeringTrend,
              trend.securityTrend,
              trend.productionTrend,
              trend.enterpriseTrend,
              trend.hiringTrend,
            ),
          )}`}
        />

        <ExecutiveCard
          title="Recommendations"
          value={`${trend.recommendations.length}`}
        />

      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

        <MetricCard
          title="Engineering"
          value={`${Math.round(trend.engineeringTrend)}`}
        />

        <MetricCard
          title="Security"
          value={`${Math.round(trend.securityTrend)}`}
        />

        <MetricCard
          title="Production"
          value={`${Math.round(trend.productionTrend)}`}
        />

        <MetricCard
          title="Enterprise"
          value={`${Math.round(trend.enterpriseTrend)}`}
        />

        <MetricCard
          title="Hiring"
          value={`${Math.round(trend.hiringTrend)}`}
        />

      </div>
      <div className="rounded-lg border p-4">

  <h3 className="font-medium mb-2">
    Executive Summary
  </h3>

  <p className="text-sm text-muted-foreground">
    {trend.executiveSummary}
  </p>

</div>
<div>

  <h3 className="font-medium mb-4">
    Repository Distribution
  </h3>

  <div className="grid gap-4 md:grid-cols-3">

    <MetricCard
      title="Improving"
      value={`${trend.improvingRepositories}`}
    />

    <MetricCard
      title="Stable"
      value={`${trend.stableRepositories}`}
    />

    <MetricCard
      title="Declining"
      value={`${trend.decliningRepositories}`}
    />

  </div>

</div>
<div>

  <h3 className="font-medium mb-4">
    Trend Breakdown
  </h3>

  <div className="grid gap-4 md:grid-cols-2">

    <div className="rounded-lg border p-4">

      <div className="text-sm text-muted-foreground">
        Strongest Dimension
      </div>

      <div className="mt-2 text-xl font-semibold">
        {trend.strongestDimension}
      </div>

      <div className="text-muted-foreground">
        {trend.strongestDimensionScore.toFixed(1)}
      </div>

    </div>

    <div className="rounded-lg border p-4">

      <div className="text-sm text-muted-foreground">
        Weakest Dimension
      </div>

      <div className="mt-2 text-xl font-semibold">
        {trend.weakestDimension}
      </div>

      <div className="text-muted-foreground">
        {trend.weakestDimensionScore.toFixed(1)}
      </div>

    </div>

  </div>

</div>  
<div className="rounded-lg border p-4">

  <h3 className="font-medium mb-4">
    Executive Insights
  </h3>

  <ul className="space-y-2">

    {trend.executiveInsights.map((insight) => (
      <li key={insight}>
        • {insight}
      </li>
    ))}

  </ul>

</div>

      <div className="rounded-lg border p-4">

        <h3 className="font-medium mb-2">
          Trend Recommendations
        </h3>

        {trend.recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Historical trend analysis will become available
            as repository snapshots accumulate.
          </p>
        ) : (
          <ul className="space-y-2">
            {trend.recommendations.map((recommendation) => (
              <li key={recommendation}>
                • {recommendation}
              </li>
            ))}
          </ul>
        )}

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
    <div className="rounded-xl border p-5">

      <div className="text-sm text-muted-foreground">
        {title}
      </div>

      <div className="mt-3 text-3xl font-bold">
        {value}
      </div>

    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
}

function MetricCard({
  title,
  value,
}: MetricCardProps) {
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