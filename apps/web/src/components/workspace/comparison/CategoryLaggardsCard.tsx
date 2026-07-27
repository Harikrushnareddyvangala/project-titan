import {
  AlertTriangle,
  Award,
  Briefcase,
  Cog,
  Factory,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  CategoryLaggard,
  ComparisonCategory,
} from "@/lib/github/comparison/ComparativeAnalyticsEngine";

interface CategoryLaggardsCardProps {
  laggards: CategoryLaggard[];
}

const CATEGORY_ICONS: Record<
  ComparisonCategory,
  React.ReactNode
> = {
  engineering: <Cog className="h-5 w-5" />,
  security: <ShieldCheck className="h-5 w-5" />,
  production: <Factory className="h-5 w-5" />,
  enterprise: <Briefcase className="h-5 w-5" />,
  hiring: <Award className="h-5 w-5" />,
};

const CATEGORY_LABELS: Record<
  ComparisonCategory,
  string
> = {
  engineering: "Engineering",
  security: "Security",
  production: "Production",
  enterprise: "Enterprise",
  hiring: "Hiring",
};

export function CategoryLaggardsCard({
  laggards,
}: CategoryLaggardsCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          Category Improvement Opportunities
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {laggards.map((laggard) => (
            <div
              key={laggard.category}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-all hover:border-amber-500/40"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-amber-500/10 p-3 text-amber-400">
                  {CATEGORY_ICONS[laggard.category]}
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    {CATEGORY_LABELS[laggard.category]}
                  </p>

                  <h3 className="font-semibold text-white">
                    {laggard.repository.repositoryName}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-amber-400">
                  {laggard.score.toFixed(1)}
                </div>

                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Lowest Score
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}