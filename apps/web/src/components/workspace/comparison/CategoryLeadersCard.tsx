import {
  Award,
  Briefcase,
  Cog,
  Factory,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type {
  CategoryLeader,
  ComparisonCategory,
} from "@/lib/github/comparison/ComparativeAnalyticsEngine";

interface CategoryLeadersCardProps {
  leaders: CategoryLeader[];
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

export function CategoryLeadersCard({
  leaders,
}: CategoryLeadersCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Award className="h-5 w-5 text-emerald-400" />
          Category Leaders
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {leaders.map((leader) => (
            <div
              key={leader.category}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-all hover:border-emerald-500/40"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
                  {CATEGORY_ICONS[leader.category]}
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    {CATEGORY_LABELS[leader.category]}
                  </p>

                  <h3 className="font-semibold text-white">
                    {leader.repository.repositoryName}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">
                  {leader.score.toFixed(1)}
                </div>

                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Highest Score
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}