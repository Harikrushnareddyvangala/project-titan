import {

  DashboardGrid,
  DashboardSection,

  BaseCard,
  MetricCard,

} from "@/components/ui";

import {

  ExecutiveSummary,

} from "@/components/intelligence";

import type {

  EngineeringQualityIntelligence,

} from "@/types/quality";

interface RepositoryQualityDashboardProps {

  quality: EngineeringQualityIntelligence;

}

export function RepositoryQualityDashboard({

  quality,

}: RepositoryQualityDashboardProps) {

  return (

    <DashboardSection

      title="Engineering Quality Intelligence"

      description="Portfolio-wide assessment of maintainability, technical debt, engineering complexity, and refactoring opportunities."

    >
        <DashboardGrid columns={3}>

  <MetricCard

    title="Overall Quality"

    value={quality.summary.overallScore}

  />

  <MetricCard

    title="Quality Grade"

    value={quality.summary.qualityGrade}

  />

  <MetricCard

    title="Refactoring Opportunities"

    value={quality.opportunities.length}

  />

</DashboardGrid>
<ExecutiveSummary

  title="Engineering Quality Summary"

  summary={
    quality.summary.executiveSummary
  }

/>
<DashboardGrid columns={3}>

  <BaseCard

    title="Maintainability"

    variant="default"

  >

    <p>

      {quality.maintainability.level}

    </p>

  </BaseCard>

  <BaseCard

    title="Technical Debt"

    variant="default"

  >

    <p>

      {quality.technicalDebt.level}

    </p>

  </BaseCard>

  <BaseCard

    title="Engineering Complexity"

    variant="default"

  >

    <p>

      Score: {quality.complexity.score}

    </p>

  </BaseCard>

</DashboardGrid>
<DashboardSection

  title="Refactoring Opportunities"

  description="Prioritized engineering improvements."

>

  <div className="space-y-4">

    {quality.opportunities.map(

      (opportunity) => (

        <BaseCard

          key={opportunity.title}

          title={opportunity.title}

          variant="default"

        >

          <p className="text-sm text-zinc-300">

            {opportunity.description}

          </p>

          <p className="mt-4 text-xs text-cyan-300">

            Impact: {opportunity.impact}

          </p>

        </BaseCard>

      ),

    )}

  </div>

</DashboardSection>

    </DashboardSection>

  );

}