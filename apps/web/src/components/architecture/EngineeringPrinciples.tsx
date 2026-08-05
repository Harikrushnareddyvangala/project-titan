import {
  DashboardSection,
  BaseCard,
} from "@/components/ui";

const principles = [
  {
    title: "Platform First",
    description:
      "Every feature should strengthen TITAN as both a reusable engineering platform and a valuable product.",
  },
  {
    title: "Domain Driven",
    description:
      "Every major capability begins with a clear domain model before implementation.",
  },
  {
    title: "Explainable Intelligence",
    description:
      "Every recommendation should be supported by evidence and understandable reasoning.",
  },
  {
    title: "Composable Architecture",
    description:
      "Small, focused modules compose into larger engineering capabilities without unnecessary coupling.",
  },
  {
    title: "Developer Experience",
    description:
      "Building, debugging, testing, and extending TITAN should be enjoyable and predictable.",
  },
  {
    title: "Continuous Evolution",
    description:
      "The architecture is designed to grow over years without requiring large-scale rewrites.",
  },
];

export function EngineeringPrinciples() {
  return (
    <DashboardSection
      title="Engineering Principles"
      description="The architectural values that guide every TITAN release."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {principles.map((principle) => (
          <BaseCard
            key={principle.title}
            title={principle.title}
            className="transition-all duration-300 hover:-translate-y-1"
          >
            <p className="leading-7 text-zinc-300">
              {principle.description}
            </p>
          </BaseCard>
        ))}
      </div>
    </DashboardSection>
  );
}