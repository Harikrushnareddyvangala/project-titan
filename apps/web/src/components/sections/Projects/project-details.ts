export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectDetail {
  title: string;

  summary: string;

  challenge: string;

  solution: string;

  role?: string;

  duration?: string;

  team?: string;

  status?: string;

  type?: string;

  date?: string;

  featured?: boolean;

  impact?: string;

  features: string[];

  architecture: string[];

  technologies: string[];

  metrics: ProjectMetric[];

  screenshots: string[];

  github: string;

  githubRepo: string;

  live: string;
}