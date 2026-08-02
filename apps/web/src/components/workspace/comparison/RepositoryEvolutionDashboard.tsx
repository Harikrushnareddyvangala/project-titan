import {

  DashboardGrid,
  DashboardSection,

  BaseCard,

  ExecutiveCard,
  MetricCard,
  DeltaMetricCard,

  EvolutionBadge,
  GrowthBadge,
  StatusBadge,

} from "@/components/ui";

import {

  Activity,
  AlertTriangle,
  Factory,
  Briefcase,
  Shield,
  TrendingUp,

} from "@/components/ui";

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
    <>
      <DashboardSection

  title="Repository Evolution Intelligence"

  description="Engineering evolution across repository snapshots."

>

<DashboardGrid columns={4}>

        <MetricCard

    title="Most Improved"

    value={evolution.highlights.mostImprovedRepository}

    icon={
        <TrendingUp
            className="h-6 w-6 text-emerald-400"
        />
    }

/>

        <MetricCard
          title="Fastest Growing"
          value={evolution.highlights.fastestGrowingRepository}
          icon={
            <TrendingUp
              className="h-6 w-6 text-emerald-400"
            />
          }
        />

        <MetricCard
          title="Most Stable"
          value={evolution.highlights.mostStableRepository}
          icon={
            <Shield
              className="h-6 w-6 text-blue-400"
            />
          }
        />

        <MetricCard
          title="Needs Attention"
          value={evolution.highlights.needsAttentionRepository}
          icon={
            <AlertTriangle
              className="h-6 w-6 text-amber-400"
            />
          }
        />

      </DashboardGrid>

</DashboardSection>

      <DashboardSection
    className="mt-10"
>

<ExecutiveCard

    title="Portfolio Evolution"

    summary={evolution.executiveSummary}

/>

</DashboardSection>

      <DashboardSection
  title="Portfolio Evolution"
  className="mt-10"
>
        <BaseCard>

        <DashboardGrid columns={3}>

          <MetricCard
            title="Engineering"
            value={evolution.summary.averageEngineeringChange}
            change={evolution.summary.averageEngineeringChange}
            suffix="%"
            icon={
              <Activity className="h-5 w-5 text-cyan-400"/>
            }
          />

          <MetricCard
            title="Security"
            value={evolution.summary.averageSecurityChange}
            change={evolution.summary.averageSecurityChange}
            suffix="%"
            icon={
              <Shield className="h-5 w-5 text-blue-400"/>
            }
          />

          <MetricCard
            title="Production"
            value={evolution.summary.averageProductionChange}
            change={evolution.summary.averageProductionChange}
            suffix="%"
            icon={
              <Factory className="h-5 w-5 text-gray-400"/>
            }
          />

          <MetricCard
            title="Enterprise"
            value={evolution.summary.averageEnterpriseChange}
            change={evolution.summary.averageEnterpriseChange}
            suffix="%"
            icon={
              <Briefcase className="h-5 w-5 text-amber-400"/>
            }
          />

          <MetricCard
            title="Hiring"
            value={evolution.summary.averageHiringChange}
            change={evolution.summary.averageHiringChange}
            suffix="%"
            icon={
              <Briefcase className="h-5 w-5 text-purple-400"/>
            }
          />
          
          <MetricCard
            title="Overall"
            value={evolution.summary.overallPortfolioChange}
            change={evolution.summary.overallPortfolioChange}
            suffix="%"
            icon={
              <TrendingUp className="h-5 w-5 text-emerald-400"/>
            }
          />

        </DashboardGrid>
          </BaseCard>
      </DashboardSection>

      <DashboardSection
  title="Repository Evolution"
  description="Repository-by-repository engineering evolution."
  className="mt-10"
>

  <div className="space-y-4">

    {evolution.repositories.map((repository) => (

      <RepositoryRow
        key={repository.repositoryName}
        repository={repository}
      />

    ))}

  </div>

</DashboardSection>

    </>
  );
}



interface RepositoryRowProps {
  repository: RepositoryEvolution;
}

function RepositoryRow({
  repository,
}: RepositoryRowProps) {
  return (
    <BaseCard
  title={repository.repositoryName}
>

      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3">

            <h4 className="font-semibold">
              {repository.repositoryName}
            </h4>

            <StatusBadge
    variant="info"
>

{repository.lifecycle}

</StatusBadge>

            <EvolutionBadge
              direction={
                repository.evolutionDirection
              }
            />

          </div>

        </div>

        <GrowthBadge

    value={repository.overallChange}

    suffix=""

    precision={2}

/>
          {/* {repository.overallChange >= 0 ? "▲ +" : "▼ "}
          {repository.overallChange.toFixed(2)}
        </div> */}

      </div>

      <div className="grid gap-4 md:grid-cols-5">

        <DeltaMetricCard

    title="Engineering"

    value={repository.engineeringChange}

    suffix=""

    precision={2}

/>

        <DeltaMetricCard
          title="Security"
          value={repository.securityChange}
          suffix=""
          precision={2}
        />

        <DeltaMetricCard
          title="Production"
          value={repository.productionChange}
          suffix=""
          precision={2}
        />

        <DeltaMetricCard
          title="Enterprise"
          value={repository.enterpriseChange}
          suffix=""
          precision={2}
        />

        <DeltaMetricCard
          title="Hiring"
          value={repository.hiringChange}
          suffix=""
          precision={2}
        />

      </div>

    </BaseCard>
  );
}
