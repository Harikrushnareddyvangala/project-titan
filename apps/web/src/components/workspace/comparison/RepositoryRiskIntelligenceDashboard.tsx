import type { RepositoryRiskIntelligence } from "@/types/github";

interface RepositoryRiskIntelligenceDashboardProps {
  risk: RepositoryRiskIntelligence;
}

export function RepositoryRiskIntelligenceDashboard({
  risk,
}: RepositoryRiskIntelligenceDashboardProps) {
  return (
    <div className="rounded-xl border p-6 space-y-6">

      <div>
        <h2 className="text-xl font-semibold">
          Repository Risk Intelligence
        </h2>

        <p className="text-sm text-muted-foreground">
          Portfolio-wide engineering risk assessment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <ExecutiveCard
          title="Risk Grade"
          value={risk.riskGrade}
        />

        <ExecutiveCard
          title="Overall Risk"
          value={`${Math.round(risk.overallRisk)}%`}
        />

        <ExecutiveCard
    title="Highest Risk"
    value={`${Math.round(
      Math.max(
        risk.engineeringRisk,
        risk.securityRisk,
        risk.productionRisk,
        risk.enterpriseRisk,
        risk.hiringRisk,
      ),
    )}%`}
  />

        <ExecutiveCard
          title="Recommendations"
          value={`${risk.recommendations.length}`}
        />

      </div>
    
        
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

        <MetricCard
          title="Engineering"
          value={`${Math.round(risk.engineeringRisk)}%`}
        />

        <MetricCard
          title="Security"
          value={`${Math.round(risk.securityRisk)}%`}
        />

        <MetricCard
          title="Production"
          value={`${Math.round(risk.productionRisk)}%`}
        />

        <MetricCard
          title="Enterprise"
          value={`${Math.round(risk.enterpriseRisk)}%`}
        />

        <MetricCard
          title="Hiring"
          value={`${Math.round(risk.hiringRisk)}%`}
        />

      </div>

      <div className="rounded-lg border p-4">

        <h3 className="font-medium mb-2">
          Risk Recommendations
        </h3>

        {risk.recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
  The portfolio currently demonstrates a healthy engineering
  risk profile. Continue monitoring repositories to maintain
  engineering quality and operational stability.
</p>
        ) : (
          <ul className="space-y-2">
            {risk.recommendations.map((item) => (
              <li key={item}>
                • {item}
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