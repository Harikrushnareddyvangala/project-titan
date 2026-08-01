import type {
  PortfolioForecast,
  ForecastDirection,
} from "@/lib/github/repositoryForecastService";

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

    <div className="space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8">

      <div>

        <h2 className="text-2xl font-bold">
          Engineering Forecast Intelligence
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          AI-powered engineering prediction based on repository evolution and historical portfolio intelligence.
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <MetricCard
          title="Repositories"
          value={forecast.repositories.length}
        />

        <MetricCard
          title="Portfolio Forecast"
          value={`${forecast.overallPortfolioForecast.toFixed(
            1,
          )}%`}
        />

        <MetricCard
          title="Forecast Confidence"
          value={`${forecast.forecastConfidence.toFixed(
            1,
          )}%`}
        />

        <MetricCard
          title="Engineering Forecast"
          value={`${forecast.averageEngineeringForecast.toFixed(
            1,
          )}%`}
        />

      </div>

      <section className="rounded-xl border border-white/10 bg-black/20 p-6">

        <h3 className="text-lg font-semibold">
          Executive Forecast
        </h3>

        <div className="mt-6 space-y-5">

          <div>

            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Forecast
            </div>

            <div className="mt-2 text-2xl font-bold">

              {forecast.executiveForecast.title}

            </div>

          </div>

          <div>

            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Summary
            </div>

            <p className="mt-2 leading-7 text-zinc-300">

              {forecast.executiveForecast.summary}

            </p>

          </div>

          <div>

            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Recommendation
            </div>

            <p className="mt-2 leading-7 text-cyan-300">

              {forecast.executiveForecast.recommendation}

            </p>

          </div>

        </div>

      </section>

      <section className="rounded-xl border border-white/10 bg-black/20 p-6">

        <h3 className="mb-5 text-lg font-semibold">
          Portfolio Forecast
        </h3>

        <div className="grid gap-4 md:grid-cols-3">

          <ForecastCard
            title="Engineering"
            value={forecast.averageEngineeringForecast}
          />

          <ForecastCard
            title="Security"
            value={forecast.averageSecurityForecast}
          />

          <ForecastCard
            title="Production"
            value={forecast.averageProductionForecast}
          />

          <ForecastCard
            title="Enterprise"
            value={forecast.averageEnterpriseForecast}
          />

          <ForecastCard
            title="Hiring"
            value={forecast.averageHiringForecast}
          />

          <ForecastCard
            title="Overall"
            value={forecast.overallPortfolioForecast}
          />

        </div>

      </section>
            <section className="rounded-xl border border-white/10 bg-black/20 p-6">

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

      </section>

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

interface ForecastCardProps {
  title: string;
  value: number;
}

function ForecastCard({
  title,
  value,
}: ForecastCardProps) {

  const positive = value >= 80;
  const warning = value >= 60 && value < 80;

  const color = positive
    ? "text-emerald-400"
    : warning
      ? "text-amber-400"
      : "text-red-400";

  return (

    <div className="rounded-xl border border-white/10 bg-black/30 p-5">

      <div className="text-sm uppercase tracking-wider text-zinc-500">
        {title}
      </div>

      <div className={`mt-3 text-3xl font-bold ${color}`}>

        {value.toFixed(1)}%

      </div>

    </div>

  );

}

function ForecastBadge({
  direction,
}: {
  direction: ForecastDirection;
}) {

  const styles: Record<
    ForecastDirection,
    string
  > = {

    "Strong Growth":
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

    Growing:
      "border-green-500/30 bg-green-500/10 text-green-300",

    Stable:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",

    Declining:
      "border-orange-500/30 bg-orange-500/10 text-orange-300",

    "High Risk":
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

function RiskBadge({
  risk,
}: {
  risk: string;
}) {

  const color =
    risk === "Very Low"
      ? "text-emerald-400"
      : risk === "Low"
        ? "text-green-400"
        : risk === "Moderate"
          ? "text-yellow-400"
          : risk === "Elevated"
            ? "text-orange-400"
            : "text-red-400";

  return (

    <span className={`font-semibold ${color}`}>

      {risk}

    </span>

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

    <div className="rounded-xl border border-white/10 bg-black/30 p-6">

      <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

        <div className="min-w-[260px]">

          <div className="flex flex-wrap items-center gap-3">

            <div className="text-lg font-semibold">

              {repository.repositoryName}

            </div>

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

          <ForecastMetric
            title="Growth"
            value={growth}
            signed
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

    </div>

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