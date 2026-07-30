import type { ProductivityIntelligence } from "@/types/github";

interface EngineeringProductivityDashboardProps {
  productivity: ProductivityIntelligence;
}

export function EngineeringProductivityDashboard({
  productivity,
}: EngineeringProductivityDashboardProps) {
  return (
    <div className="rounded-xl border p-6 space-y-6">

      <div>
        <h2 className="text-xl font-semibold">
          Engineering Productivity Intelligence
        </h2>

        <p className="text-sm text-muted-foreground">
          Portfolio-wide engineering productivity analysis.
        </p>
      </div>
        <div className="grid gap-4 md:grid-cols-4">

  <ExecutiveCard
    title="Productivity Grade"
    value={productivity.productivityGrade}
  />

  <ExecutiveCard
    title="Activity Score"
    value={`${Math.round(productivity.activityScore)}%`}
  />

  <ExecutiveCard
    title="Release Health"
    value={`${Math.round(productivity.releaseHealth)}%`}
  />

  <ExecutiveCard
    title="Recommendations"
    value={`${productivity.recommendations.length}`}
  />

</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

        <MetricCard
          title="Activity"
          value={`${Math.round(productivity.activityScore)}%`}
        />

        <MetricCard
          title="Delivery"
          value={`${Math.round(productivity.deliveryVelocity)}%`}
        />

        <MetricCard
          title="Maintenance"
          value={`${Math.round(productivity.maintenanceScore)}%`}
        />

        <MetricCard
          title="Collaboration"
          value={`${Math.round(productivity.collaborationScore)}%`}
        />

        <MetricCard
          title="Release Health"
          value={`${Math.round(productivity.releaseHealth)}%`}
        />

      </div>

      <div className="rounded-lg border p-4">

        <h3 className="font-medium mb-2">
          Productivity Grade
        </h3>

        <p className="text-3xl font-bold">
          {productivity.productivityGrade}
        </p>

      </div>

      <div className="rounded-lg border p-4">

        <h3 className="font-medium mb-2">
          Recommendations
        </h3>

        {productivity.recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
  Engineering productivity is performing well across the portfolio.
  No additional recommendations are currently required.
</p>
        ) : (
          <ul className="space-y-2">
            {productivity.recommendations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul> 
        )}

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