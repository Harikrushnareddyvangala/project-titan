import {
  DashboardSection,
  DashboardGrid,

  BaseCard,

  MetricCard,
  ExecutiveCard,
  ForecastMetricCard,
  DeltaMetricCard,

  GrowthBadge,
  StatusBadge,

  Activity,
  Database,
  Shield,
  TrendingUp,
  Factory,
  Briefcase,

} from "@/components/ui";

import type {
  PortfolioForecast,
} from "@/lib/github/repositoryForecastService";

import type {
  ForecastDirection,
} from "@/types/intelligence";

interface RepositoryForecastDashboardProps {
  forecast: PortfolioForecast;
}

export function RepositoryForecastDashboard({
  forecast,
}: RepositoryForecastDashboardProps) {

  const rankedRepositories = [
    ...forecast.repositories,
  ].sort(
    (a, b) =>
      b.overallPrediction -
      a.overallPrediction,
  );

  return (

    <>
      <DashboardSection
  title="Engineering Forecast Intelligence"
  description="AI-powered engineering prediction based on repository evolution and historical portfolio intelligence."
>

      <DashboardGrid columns={4}>

        <MetricCard
  title="Repositories"
  value={forecast.repositories.length}
  icon={
    <Database className="h-6 w-6 text-cyan-400" />
  }
/>

<MetricCard
  title="Portfolio Forecast"
  value={forecast.overallPortfolioForecast}
  suffix="%"
  precision={1}
  icon={
    <TrendingUp className="h-6 w-6 text-emerald-400" />
  }
/>

<MetricCard
  title="Forecast Confidence"
  value={forecast.forecastConfidence}
  suffix="%"
  precision={1}
  icon={
    <Shield className="h-6 w-6 text-blue-400" />
  }
/>

<MetricCard
  title="Engineering Forecast"
  value={forecast.averageEngineeringForecast}
  suffix="%"
  precision={1}
  icon={
    <Activity className="h-6 w-6 text-purple-400" />
  }
/>

      </DashboardGrid>

</DashboardSection>

      <DashboardSection
  className="mt-10"
>

  <ExecutiveCard

    title={
      forecast.executiveForecast.title
    }

    summary={
      forecast.executiveForecast.summary
    }

    recommendation={
      forecast.executiveForecast.recommendation
    }

  />

</DashboardSection>

      <DashboardSection

  title="Portfolio Forecast"

  className="mt-10"

>

  <BaseCard>

    <DashboardGrid columns={3}>

      <ForecastMetricCard

        title="Engineering"

        value={
          forecast.averageEngineeringForecast
        }
        icon={
    <Activity className="h-5 w-5 text-cyan-400" />
  }

      />

      <ForecastMetricCard

        title="Security"

        value={
          forecast.averageSecurityForecast
        }
        icon={
    <Shield className="h-5 w-5 text-blue-400" />
  }

      />

      <ForecastMetricCard

        title="Production"

        value={
          forecast.averageProductionForecast
        }
        icon={
    <Factory className="h-5 w-5 text-gray-400" />
  }

      />

      <ForecastMetricCard

        title="Enterprise"

        value={
          forecast.averageEnterpriseForecast
        }
        icon={
    <Briefcase className="h-5 w-5 text-yellow-400" />
  }

      />

      <ForecastMetricCard

        title="Hiring"

        value={
          forecast.averageHiringForecast
        }
        icon={
    <Briefcase className="h-5 w-5 text-purple-400" />
  }

      />

      <ForecastMetricCard

        title="Overall"

        value={
          forecast.overallPortfolioForecast
        }
        icon={
    <TrendingUp className="h-5 w-5 text-emerald-400" />
  }

      />

    </DashboardGrid>

  </BaseCard>

</DashboardSection>
      <DashboardSection
  title="Repository Engineering Forecast"
  description="Predicted engineering maturity based on historical repository evolution."
  className="mt-10"
>
        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-lg font-semibold">
              Repository Engineering Forecast
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Predicted engineering maturity based on historical repository evolution.
            </p>

          </div>

        </div>

        {rankedRepositories.length === 0 ? (

          <div className="py-12 text-center text-zinc-500">

            No repository forecast available.

          </div>

        ) : (

          <div className="mt-6 space-y-4">

            {rankedRepositories.map(
              (
                repository,
                index,
              ) => (

                <ForecastRepositoryRow
                  key={repository.repositoryName}
                  repository={repository}
                  portfolioLeader={
                    index === 0
                  }
                />

              ),
            )}

          </div>

        )}

      </DashboardSection>

      <section className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <h3 className="text-lg font-semibold">
          Portfolio Outlook
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div>

            <div className="text-sm uppercase tracking-wider text-cyan-300">
              Forecast Confidence
            </div>

            <div className="mt-3 text-4xl font-bold">

              {forecast.forecastConfidence.toFixed(1)}%

            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">

              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                style={{
                  width: `${forecast.forecastConfidence}%`,
                }}
              />

            </div>

          </div>

          <div>

            <div className="text-sm uppercase tracking-wider text-cyan-300">
              Predicted Portfolio Score
            </div>

            <div className="mt-3 text-4xl font-bold">

              {forecast.overallPortfolioForecast.toFixed(1)}%

            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">

              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                style={{
                  width: `${forecast.overallPortfolioForecast}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>

    </>

  );

}

function ForecastBadge({
  direction,
}: {
  direction: ForecastDirection;
}) {

  const variant =
    direction === "Strong Growth"
      ? "success"
      : direction === "Growing"
      ? "info"
      : direction === "Stable"
      ? "neutral"
      : direction === "Declining"
      ? "warning"
      : "danger";

  return (
    <StatusBadge variant={variant}>
      {direction}
    </StatusBadge>
  );
}

function RiskBadge({
  risk,
}: {
  risk: string;
}) {

  const variant =
    risk === "Very Low"
      ? "success"
      : risk === "Low"
      ? "info"
      : risk === "Moderate"
      ? "warning"
      : risk === "Elevated"
      ? "warning"
      : "danger";

  return (
    <StatusBadge variant={variant}>
      {risk}
    </StatusBadge>
  );
}
interface ForecastRepositoryRowProps {
  repository:
    PortfolioForecast["repositories"][number];

  portfolioLeader?: boolean;
}

function ForecastRepositoryRow({
  repository,
  portfolioLeader = false,
}: ForecastRepositoryRowProps) {

  const growth =
    repository.predictedEngineeringScore -
    repository.currentEngineeringScore;

  return (

    <BaseCard
  title={repository.repositoryName}
>

      <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

        <div className="min-w-[260px]">

          <div className="flex flex-wrap items-center gap-3">

            {portfolioLeader && (

              <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300">

                🏆 Forecast Leader

              </span>

            )}

            <ForecastBadge
              direction={
                repository.forecastDirection
              }
            />

          </div>

          <div className="mt-4">

            <RiskBadge
              risk={
                repository.predictedRisk
              }
            />

          </div>

        </div>

        <div className="grid flex-1 gap-6 md:grid-cols-5">

          <ForecastMetric
            title="Current"
            value={
              repository.currentEngineeringScore
            }
          />

          <ForecastMetric
            title="Predicted"
            value={
              repository.predictedEngineeringScore
            }
          />

          <DeltaMetricCard
  title="Growth"
  value={growth}
  suffix=""
  precision={2}
/>

          <ForecastProgress
            title="Confidence"
            value={
              repository.forecastConfidence
            }
            color="cyan"
          />

          <ForecastProgress
            title="Prediction"
            value={
              repository.overallPrediction
            }
            color="emerald"
          />

        </div>

      </div>

    </BaseCard>

  );

}

interface ForecastMetricProps {

  title: string;

  value: number;

  signed?: boolean;

}

function ForecastMetric({
  title,
  value,
  signed = false,
}: ForecastMetricProps) {

  const positive =
    value >= 0;

  const color =
    signed
      ? positive
        ? "text-emerald-400"
        : "text-red-400"
      : "text-white";

  return (

    <div>

      <div className="text-xs uppercase tracking-wider text-zinc-500">

        {title}

      </div>

      <div
        className={`mt-2 text-xl font-bold ${color}`}
      >

        {signed && value >= 0
          ? "+"
          : ""}

        {value.toFixed(1)}

        {!signed && "%"}

      </div>

    </div>

  );

}

interface ForecastProgressProps {

  title: string;

  value: number;

  color:
    | "cyan"
    | "emerald";

}

function ForecastProgress({
  title,
  value,
  color,
}: ForecastProgressProps) {

  const barColor =
    color === "cyan"
      ? "bg-cyan-400"
      : "bg-emerald-400";

  return (

    <div>

      <div className="text-xs uppercase tracking-wider text-zinc-500">

        {title}

      </div>

      <div className="mt-2 font-semibold">

        {value.toFixed(1)}%

      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">

        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{
            width: `${Math.min(
              value,
              100,
            )}%`,
          }}
        />

      </div>

    </div>

  );

}