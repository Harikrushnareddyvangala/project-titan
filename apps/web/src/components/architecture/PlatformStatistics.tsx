import {
  DashboardSection,
  BaseCard,
} from "@/components/ui";

import {
  architectureCenter,
} from "@/lib/platform/architecture/architectureCenter";

export function PlatformStatistics() {

  return (

    <DashboardSection
      title="Platform Statistics"
      description="A snapshot of TITAN's engineering scale."
    >

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {architectureCenter.statistics.map(

          (statistic) => (

            <BaseCard
              key={statistic.label}
              className="text-center"
            >

              <div className="text-4xl font-bold text-cyan-400">

                {statistic.value}

              </div>

              <div className="mt-3 text-lg font-semibold text-white">

                {statistic.label}

              </div>

              <p className="mt-2 text-zinc-400">

                {statistic.description}

              </p>

            </BaseCard>

          ),

        )}

      </div>

    </DashboardSection>

  );

}