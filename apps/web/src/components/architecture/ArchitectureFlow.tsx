import {
  DashboardSection,
  BaseCard,
} from "@/components/ui";

import {
  architectureCenter,
} from "@/lib/platform/architecture/architectureCenter";

export function ArchitectureFlow() {

  return (

    <DashboardSection
      title="Intelligence Flow"
      description="Understand how engineering intelligence moves through TITAN."
    >

      <BaseCard
        title="Engineering Intelligence Pipeline"
      >

        <div className="space-y-2">

          <p className="text-zinc-300">

            TITAN processes engineering information through a layered
            intelligence pipeline.

          </p>

          <p className="text-zinc-400">

            Every intelligence module consumes structured outputs from
            previous layers, applies specialized reasoning, and produces
            richer knowledge for downstream modules.

          </p>

        </div>

      </BaseCard>

      <div className="mt-8 flex flex-col items-center">

        {architectureCenter.modules.map(

          (module, index) => (

            <div
              key={module.id}
              className="flex w-full max-w-2xl flex-col items-center"
            >

              <BaseCard
                title={module.name}
                variant="default"
                className="
                  w-full
                  border-cyan-500/20
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  hover:border-cyan-400/40
                "
              >

                <p className="text-sm font-medium text-cyan-400">

                  {module.layer}

                </p>

                <p className="mt-3 leading-7 text-zinc-300">

                  {module.description}

                </p>

              </BaseCard>

              {index < architectureCenter.modules.length - 1 && (

                <div className="my-4 flex h-14 items-center justify-center">

                  <div className="flex flex-col items-center">

                    <div className="h-10 w-px bg-cyan-500/40" />

                    <div className="mt-1 text-cyan-400">

                      ↓

                    </div>

                  </div>

                </div>

              )}

            </div>

          ),

        )}

      </div>

    </DashboardSection>

  );

}