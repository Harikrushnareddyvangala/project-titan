export interface Project {
  title: string;
  categories: ProjectCategory[];
  description: string;
  technologies: string[];
  image: string;
  github: string;
  live: string;
  featured: boolean;
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
