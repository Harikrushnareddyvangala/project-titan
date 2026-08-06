export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export type ProjectStatus =
  | "Completed"
  | "In Progress"
  | "Research";

export interface Project {
  // Identity
  id: string;
  slug: string;
  title: string;

  // Portfolio
  featured: boolean;
  flagship?: boolean;
  displayOrder: number;

  // Timeline
  year: number;
  status: ProjectStatus;

  // Content
  shortDescription: string;
  description: string;

  // Classification
  categories: string[];
  technologies: string[];
  highlights: string[];

  // Showcase
  metrics?: ProjectMetric[];

  // Assets
  image: string;

  // External Links
  github?: string;
  live?: string;

  // Future Internal Navigation
  links?: ProjectLink[];
}
export type ProjectCategory =
  | "All"
  | "AI"
  | "Machine Learning"
  | "Deep Learning"
  | "Data Science"
  | "Analytics"
  | "Visualization"
  | "Web"
  | "NLP"
  | "Computer Vision"
  | "Generative AI"
  | "Predictive Analytics"
  | "Reinforcement Learning"
  | "Time Series"
  | "Big Data"
  | "Cloud"
  | "IoT"
  | "Robotics"
  | "Edge Computing"
  | "Cybersecurity"
  | "Blockchain"
  | "AR/VR"
  | "Quantum Computing"
  | "Bioinformatics"
  | "Healthcare"
  | "Finance"
  | "E-commerce"
  | "Social Media"
  | "Gaming"
  | "Education"
  | "Energy"
  | "Transportation"
  | "Agriculture"
  | "Manufacturing"
  | "Smart Cities"
  | "Sustainability"
  | "Ethics in AI"
  | "MLOps"
  | "Business Intelligence"
  | "Data Engineering";
