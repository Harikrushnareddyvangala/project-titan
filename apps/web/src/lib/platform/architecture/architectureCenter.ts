import type {
  ArchitectureCenter,
} from "@/types/architectureCenter";

export const architectureCenter: ArchitectureCenter = {

  modules: [

    {
      id: "analytics",
      name: "Repository Analytics",
      layer: "Analytics",
      description:
        "Collects and computes repository metrics.",
    },

    {
      id: "quality",
      name: "Engineering Quality",
      layer: "Engineering Intelligence",
      description:
        "Evaluates maintainability, complexity and technical debt.",
    },

    {
      id: "observability",
      name: "Engineering Observability",
      layer: "Engineering Intelligence",
      description:
        "Tracks KPIs, regressions and release readiness.",
    },

    {
      id: "correlation",
      name: "Unified Correlation",
      layer: "Engineering Intelligence",
      description:
        "Correlates multiple intelligence modules into executive insights.",
    },

    {
      id: "advisor",
      name: "AI Advisor",
      layer: "Executive Intelligence",
      description:
        "Generates explainable engineering recommendations.",
    },

  ],

  connections: [

    {
      source: "analytics",
      target: "quality",
    },

    {
      source: "quality",
      target: "observability",
    },

    {
      source: "observability",
      target: "correlation",
    },

    {
      source: "correlation",
      target: "advisor",
    },

  ],

  statistics: [

  {

    label: "Architecture Layers",

    value: "6",

    description:
      "Logical layers composing TITAN.",

  },

  {

    label: "Intelligence Modules",

    value: "20+",

    description:
      "Engineering intelligence capabilities.",

  },

  {

    label: "Correlation Rules",

    value: "4",

    description:
      "Rule Engine reasoning modules.",

  },

  {

    label: "Platform Services",

    value: "30+",

    description:
      "Reusable orchestration services.",

  },

  {

    label: "Reusable UI Components",

    value: "70+",

    description:
      "Shared design system components.",

  },

  {

    label: "TypeScript",

    value: "Strict",

    description:
      "Strict type-safe engineering.",

  },

],

};