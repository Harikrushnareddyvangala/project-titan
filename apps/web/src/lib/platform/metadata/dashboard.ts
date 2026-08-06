import type { PlatformModule } from "../registry";

export const dashboardModules: PlatformModule[] = [
  {
    id: "engineering-dashboard",

    title: "Engineering Dashboard",

    description:
      "Primary engineering intelligence dashboard.",

    category: "dashboard",

    route: "/dashboard",

    enabled: true,

    experimental: false,

    priority: 1,

    dependencies: [],

    services: [],

    widgets: [],

    tags: [
      "dashboard",
      "engineering",
      "executive",
    ],
  },
];