export interface ProjectDetail {
  title: string;

  summary: string;

  challenge: string;

  solution: string;

  features: string[];

  architecture: string[];

  metrics: {
    label: string;
    value: string;
  }[];

  screenshots: string[];
}