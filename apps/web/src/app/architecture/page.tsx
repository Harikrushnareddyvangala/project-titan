import {
  ArchitectureOverview,
} from "@/components/architecture/ArchitectureOverview";

import {
  ArchitectureFlow,
} from "@/components/architecture/ArchitectureFlow";

import {
  EngineeringPrinciples,
} from "@/components/architecture/EngineeringPrinciples";

import {
  PlatformStatistics,
} from "@/components/architecture/PlatformStatistics";

export default function ArchitecturePage() {

  return (

    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10">

      <ArchitectureOverview />

      <EngineeringPrinciples />

      <ArchitectureFlow />

      <PlatformStatistics />

    </main>

  );

}