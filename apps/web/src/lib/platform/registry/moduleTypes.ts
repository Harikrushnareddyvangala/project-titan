export type ModuleCategory =
  | "dashboard"
  | "workspace"
  | "analytics"
  | "intelligence"
  | "architecture"
  | "repository"
  | "portfolio"
  | "research"
  | "ai";

export interface PlatformModule {
  id: string;

  title: string;

  description: string;

  category: ModuleCategory;

  route: string;

  icon?: string;

  enabled: boolean;

  experimental?: boolean;

  priority: number;

  dependencies: string[];

  services: string[];

  widgets: string[];

  tags: string[];
}