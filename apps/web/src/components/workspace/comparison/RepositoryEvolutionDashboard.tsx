import type {
  PortfolioEvolution,
  RepositoryEvolution,
} from "@/lib/github/repositoryEvolutionService";

interface RepositoryEvolutionDashboardProps {
  evolution: PortfolioEvolution;
}

export function RepositoryEvolutionDashboard({
  evolution,
}: RepositoryEvolutionDashboardProps) {
  return (
    <div className="rounded-xl border p-6 space-y-6">

      <div>

        <h2 className="text-xl font-semibold">
          Repository Evolution Intelligence
        </h2>

        <p className="text-sm text-muted-foreground">
          Engineering evolution across repository snapshots.
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <ExecutiveCard
          title="Most Improved"
          value={evolution.highlights.mostImprovedRepository}
        />

        <ExecutiveCard
          title="Fastest Growing"
          value={evolution.highlights.fastestGrowingRepository}
        />

        <ExecutiveCard
          title="Most Stable"
          value={evolution.highlights.mostStableRepository}
        />

        <ExecutiveCard
          title="Needs Attention"
          value={evolution.highlights.needsAttentionRepository}
        />

      </div>

      <div className="rounded-lg border p-5">

        <h3 className="font-medium">
          Executive Summary
        </h3>

        <p className="mt-3 text-sm text-muted-foreground">
          {evolution.executiveSummary}
        </p>

      </div>

      <div className="rounded-lg border p-5">

        <h3 className="font-medium mb-4">
          Portfolio Evolution
        </h3>

        <div className="grid gap-4 md:grid-cols-3">

          <MetricCard
            title="Engineering"
            value={evolution.summary.averageEngineeringChange}
          />

          <MetricCard
            title="Security"
            value={evolution.summary.averageSecurityChange}
          />

          <MetricCard
            title="Production"
            value={evolution.summary.averageProductionChange}
          />

          <MetricCard
            title="Enterprise"
            value={evolution.summary.averageEnterpriseChange}
          />

          <MetricCard
            title="Hiring"
            value={evolution.summary.averageHiringChange}
          />

          <MetricCard
            title="Overall"
            value={evolution.summary.overallPortfolioChange}
          />

        </div>

      </div>

      <div className="rounded-lg border p-5">

        <h3 className="font-medium mb-4">
          Repository Evolution
        </h3>

        <div className="space-y-3">

          {evolution.repositories.map(
            (repository) => (
              <RepositoryRow
                key={repository.repositoryName}
                repository={repository}
              />
            ),
          )}

        </div>

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
    <div className="rounded-lg border p-4">

      <div className="text-sm text-muted-foreground">
        {title}
      </div>

      <div className="mt-2 text-lg font-semibold">
        {value || "N/A"}
      </div>

    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
}

function MetricCard({
  title,
  value,
}: MetricCardProps) {
  const color =
    value > 0
      ? "text-green-600"
      : value < 0
        ? "text-red-600"
        : "text-gray-500";

  const icon =
    value > 0
      ? "▲"
      : value < 0
        ? "▼"
        : "●";

  return (
    <div className="rounded-lg border p-4">

      <div className="text-sm text-muted-foreground">
        {title}
      </div>

      <div className={`mt-2 text-2xl font-bold ${color}`}>
        {icon} {value >= 0 ? "+" : ""}
        {value.toFixed(2)}
      </div>

    </div>
  );
}

interface RepositoryRowProps {
  repository: RepositoryEvolution;
}

function RepositoryRow({
  repository,
}: RepositoryRowProps) {
  return (
    <div className="rounded-lg border p-5 space-y-5">

      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3">

            <h4 className="font-semibold">
              {repository.repositoryName}
            </h4>

            <span className="rounded-full border px-2 py-1 text-xs">
              {repository.lifecycle}
            </span>

            <EvolutionBadge
              direction={
                repository.evolutionDirection
              }
            />

          </div>

        </div>

        <div
          className={
            repository.overallChange >= 0
              ? "text-green-600 font-bold"
              : "text-red-600 font-bold"
          }
        >
          {repository.overallChange >= 0 ? "▲ +" : "▼ "}
          {repository.overallChange.toFixed(2)}
        </div>

      </div>

      <div className="grid gap-3 md:grid-cols-5">

        <TrendMetricCard
          title="Engineering"
          value={repository.engineeringChange}
        />

        <TrendMetricCard
          title="Security"
          value={repository.securityChange}
        />

        <TrendMetricCard
          title="Production"
          value={repository.productionChange}
        />

        <TrendMetricCard
          title="Enterprise"
          value={repository.enterpriseChange}
        />

        <TrendMetricCard
          title="Hiring"
          value={repository.hiringChange}
        />

      </div>

    </div>
  );
}
interface TrendMetricCardProps {
  title: string;
  value: number;
}

function TrendMetricCard({
  title,
  value,
}: TrendMetricCardProps) {

  const color =
    value > 0
      ? "text-green-600"
      : value < 0
        ? "text-red-600"
        : "text-gray-500";

  const icon =
    value > 0
      ? "▲"
      : value < 0
        ? "▼"
        : "●";

  return (
    <div className="rounded-lg border p-3">

      <div className="text-xs text-muted-foreground">
        {title}
      </div>

      <div className={`mt-2 font-semibold ${color}`}>
        {icon} {value >= 0 ? "+" : ""}
        {value.toFixed(2)}
      </div>

    </div>
  );
}
interface EvolutionBadgeProps {
  direction: RepositoryEvolution["evolutionDirection"];
}

function EvolutionBadge({
  direction,
}: EvolutionBadgeProps) {

  const className = (() => {

    switch (direction) {

      case "Rapidly Improving":
        return "bg-emerald-600/20 text-emerald-400";

      case "Improving":
        return "bg-green-600/20 text-green-400";

      case "Stable":
        return "bg-gray-600/20 text-gray-300";

      case "Declining":
        return "bg-orange-600/20 text-orange-300";

      case "Critical":
        return "bg-red-600/20 text-red-400";

    }

  })();

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${className}`}
    >
      {direction}
    </span>
  );
}