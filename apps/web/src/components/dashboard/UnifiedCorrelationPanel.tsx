import {
  DashboardSection,
  BaseCard,
  StatusBadge,
} from "@/components/ui";

import type {
  UnifiedCorrelationIntelligence,
} from "@/types/correlation";
import {

  getPriorityVariant,

  getConfidenceVariant,

} from "./utils/correlationBadgeUtils";

interface UnifiedCorrelationPanelProps {
  correlation: UnifiedCorrelationIntelligence;
}

export function UnifiedCorrelationPanel({
  correlation,
}: UnifiedCorrelationPanelProps) {

  // ✅ Handle empty state first
  if (correlation.insights.length === 0) {
    return (
      <DashboardSection
        title="Unified Intelligence"
        description="Cross-intelligence executive insights."
      >
        <BaseCard
          title="No Significant Findings"
          variant="default"
        >
          <p>
            No high-priority cross-intelligence insights were generated.
          </p>
        </BaseCard>
      </DashboardSection>
    );
  }

  // ✅ Normal rendering
  return (
    <DashboardSection
      title="Unified Intelligence"
      description="Cross-intelligence executive insights."
    >
      <BaseCard
        title="Executive Summary"
        variant="default"
      >
        <p>
          {correlation.summary.executiveNarrative}
        </p>
      </BaseCard>

      <div className="space-y-4 mt-6">
        {correlation.insights.map((insight) => (
          <BaseCard
            key={insight.title}
            title={insight.title}
            variant="default"
          >
            <div className="flex gap-2 mb-3">
              <StatusBadge

  variant={getPriorityVariant(
    insight.priority,
  )}

>

  {insight.priority}

</StatusBadge>

<StatusBadge

  variant={getConfidenceVariant(
    insight.confidence,
  )}

>

  {insight.confidence}

</StatusBadge>
            </div>

            <p>{insight.summary}</p>

            <div className="mt-4">
              <strong>Recommendation</strong>

              <p>{insight.recommendation}</p>
            </div>
          </BaseCard>
        ))}
      </div>
    </DashboardSection>
  );
}