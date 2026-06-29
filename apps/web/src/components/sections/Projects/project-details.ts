export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectDetail {
  title: string;

  summary: string;

  challenge: string;

  solution: string;

  features: string[];

  architecture: string[];

  technologies: string[];

  metrics: ProjectMetric[];

  screenshots: string[];

  github: string;

  live: string;
}