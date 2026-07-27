import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ExecutiveObservation } from "@/lib/github/comparison/ComparativeAnalyticsEngine";

interface ExecutivePortfolioInsightsProps {
  observations: ExecutiveObservation[];
}

const SEVERITY_CONFIG = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    iconClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
    backgroundClass: "bg-emerald-500/5",
    badgeClass:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    label: "Strength",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    iconClass: "text-cyan-400",
    borderClass: "border-cyan-500/30",
    backgroundClass: "bg-cyan-500/5",
    badgeClass:
      "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    label: "Insight",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    iconClass: "text-amber-400",
    borderClass: "border-amber-500/30",
    backgroundClass: "bg-amber-500/5",
    badgeClass:
      "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    label: "Attention",
  },
} as const;

export function ExecutivePortfolioInsights({
  observations,
}: ExecutivePortfolioInsightsProps) {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          Executive Portfolio Insights
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {observations.map((observation, index) => {
            const config =
              SEVERITY_CONFIG[observation.severity];

            return (
              <div
                key={`${observation.title}-${index}`}
                className={`rounded-xl border p-4 transition-all ${config.borderClass} ${config.backgroundClass}`}
              >
                <div className="flex items-start gap-4">
                  <div className={config.iconClass}>
                    {config.icon}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {observation.title}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.badgeClass}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-300">
                      {observation.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {observations.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
              <p className="text-slate-400">
                No executive observations are available for
                the selected repository portfolio.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}