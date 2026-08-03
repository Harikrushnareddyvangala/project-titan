import {
  DashboardSection,
  DashboardGrid,

  BaseCard,

  ExecutiveCard,
  MetricCard,

  StatusBadge,

  Activity,
  AlertTriangle,
  Shield,
  TrendingUp,

} from "@/components/ui";

import type {
  PortfolioRisk,
    RepositoryRisk,
} from "@/types/risk";

import {
  getRiskBadgeVariant,
  getRiskTrendBadgeVariant,
} from "@/components/ui/badges/statusBadgeUtils";

interface RepositoryRiskDashboardProps {

  risk: PortfolioRisk;

}

export function RepositoryRiskDashboard({

  risk,

}: RepositoryRiskDashboardProps) {

  return (

    <>
    <DashboardSection

  title="Repository Risk Intelligence"

  description="AI-powered engineering risk assessment across the repository portfolio."

>

  <DashboardGrid columns={4}>

    <MetricCard

      title="Repositories"

      value={risk.summary.repositoryCount}

      icon={
        <Activity className="h-6 w-6 text-cyan-400"/>
      }

    />

    <MetricCard

      title="Risk Score"

      value={risk.summary.overallScore}

      suffix="%"

      precision={1}

      icon={
        <TrendingUp className="h-6 w-6 text-emerald-400"/>
      }

    />

    <MetricCard

      title="Confidence"

      value={risk.summary.confidence}

      suffix="%"

      precision={1}

      icon={
        <Shield className="h-6 w-6 text-blue-400"/>
      }

    />

    <MetricCard

      title="Overall Risk"

      value={risk.summary.overallRisk}

      icon={
        <AlertTriangle className="h-6 w-6 text-amber-400"/>
      }

    />

  </DashboardGrid>

</DashboardSection>

<DashboardSection
  className="mt-10"
>

  <ExecutiveCard

    title={risk.executive.title}

    summary={risk.executive.summary}

    recommendation={risk.executive.recommendation}

  />

</DashboardSection>

<DashboardSection

  title="Risk Distribution"

  className="mt-10"

>

  <BaseCard>

    <DashboardGrid columns={3}>

      <MetricCard
        title="Very Low"
        value={risk.distribution.veryLow}
      />

      <MetricCard
        title="Low"
        value={risk.distribution.low}
      />

      <MetricCard
        title="Moderate"
        value={risk.distribution.moderate}
      />

      <MetricCard
        title="Elevated"
        value={risk.distribution.elevated}
      />

      <MetricCard
        title="High"
        value={risk.distribution.high}
      />

      <MetricCard
        title="Critical"
        value={risk.distribution.critical}
      />

    </DashboardGrid>

  </BaseCard>

</DashboardSection>

<DashboardSection

  title="Repository Risk Assessment"

  className="mt-10"

>

  {risk.repositories.map(

    (repository) => (

      <RepositoryRiskCard

        key={repository.repositoryName}

        repository={repository}

      />

    ),

  )}

</DashboardSection>

    </>

  );

}

interface RepositoryRiskCardProps {

  repository: RepositoryRisk;

}

function RepositoryRiskCard({

  repository,

}: RepositoryRiskCardProps) {

  return (

    <BaseCard

      title={repository.repositoryName}

      className="mb-6"

    >

      <div className="space-y-6">
        <div className="flex items-center justify-between">

  <div className="flex items-center gap-3">

    <StatusBadge
  variant={getRiskBadgeVariant(repository.level)}
>

      {repository.level}

    </StatusBadge>

  </div>

  <div className="text-right">

    <div className="text-xs uppercase tracking-wide text-zinc-500">

      Risk Score

    </div>

    <div className="text-3xl font-bold">

      {repository.score.toFixed(1)}%

    </div>

  </div>

</div>

<DashboardGrid columns={2}>

  <MetricCard

    title="Confidence"

    value={repository.confidence}

    suffix="%"

    precision={1}

    icon={
      <Shield className="h-5 w-5 text-cyan-400"/>
    }

  />

  <MetricCard

    title="Priority"

    value={repository.priority}

    icon={
      <AlertTriangle className="h-5 w-5 text-amber-400"/>
    }

  />

</DashboardGrid>

<BaseCard

  variant="default"

>

  <div className="space-y-2">

    <h4 className="font-semibold">

      Engineering Analysis

    </h4>

    <p className="text-sm text-zinc-300 leading-relaxed">

      {repository.explanation}

    </p>

  </div>

</BaseCard>
<BaseCard

  variant="success"

>

  <div className="space-y-2">

    <h4 className="font-semibold">

      Recommendation

    </h4>

    <p className="text-sm text-zinc-300 leading-relaxed">

      {repository.recommendation}

    </p>

  </div>

</BaseCard>

<div className="flex justify-end">

  <StatusBadge
  variant={getRiskTrendBadgeVariant(repository.trend)}
>

    {repository.trend}

  </StatusBadge>

</div>

      </div>

    </BaseCard>

  );

}