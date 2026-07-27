import {
  Award,
  BarChart3,
  GitCompare,
  Shield,
  Trophy,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ComparativeAnalytics } from "@/lib/github/comparison/ComparativeAnalyticsEngine";

interface PortfolioComparisonSummaryProps {
  analytics: ComparativeAnalytics;
}

interface SummaryMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
}

function SummaryMetric({
  icon,
  label,
  value,
  subtitle,
}: SummaryMetricProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-cyan-500/40">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <h3 className="text-xl font-bold text-white">
            {value}
          </h3>

          <p className="text-sm text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="rounded-lg bg-cyan-500/10 p-3 text-cyan-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function PortfolioComparisonSummary({
  analytics,
}: PortfolioComparisonSummaryProps) {
  const largestGap = analytics.metricGaps.reduce(
    (largest, current) =>
      current.gap > largest.gap ? current : largest,
  );

  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <GitCompare className="h-5 w-5 text-cyan-400" />
          Portfolio Comparison Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryMetric
            icon={<Trophy className="h-5 w-5" />}
            label="Portfolio Leader"
            value={analytics.strongestRepository.repositoryName}
            subtitle={`${analytics.strongestRepository.overallScore.toFixed(
              1,
            )} Overall Score`}
          />

          <SummaryMetric
            icon={<Award className="h-5 w-5" />}
            label="Most Balanced"
            value={analytics.mostBalancedRepository.repositoryName}
            subtitle="Lowest metric variance"
          />

          <SummaryMetric
            icon={<Shield className="h-5 w-5" />}
            label="Largest Portfolio Gap"
            value={largestGap.category}
            subtitle={`${largestGap.gap.toFixed(
              1,
            )} point difference`}
          />

          <SummaryMetric
            icon={<BarChart3 className="h-5 w-5" />}
            label="Repositories Compared"
            value={String(
              analytics.repositoryGaps.length,
            )}
            subtitle="Engineering intelligence analysis"
          />
        </div>
      </CardContent>
    </Card>
  );
}