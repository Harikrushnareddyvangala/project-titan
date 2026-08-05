import {
  DashboardSection,
  BaseCard,
} from "@/components/ui";

import {
  architectureCenter,
} from "@/lib/platform/architecture/architectureCenter";

export function ArchitectureOverview() {

  return (

    <DashboardSection

      title="Platform Architecture"

      description="Explore the engineering architecture that powers TITAN."

    >

      <BaseCard

        title="Architecture Overview"

      >

        <p className="text-zinc-300 leading-7">

          TITAN is designed as a layered Engineering Intelligence Platform.
          Each layer has a clearly defined responsibility, enabling modular
          growth, independent evolution, and explainable engineering
          intelligence.

        </p>

      </BaseCard>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

  {architectureCenter.modules.map(

    (module) => (

      <BaseCard

        key={module.id}

        title={module.name}

        variant="default"

      >

        <p className="text-sm text-cyan-400">

          {module.layer}

        </p>

        <p className="mt-3 text-zinc-300">

          {module.description}

        </p>

      </BaseCard>

    ),

  )}

</div>

    </DashboardSection>

  );

}