import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "Fraud Detection System",
    category: "Machine Learning",
    description:
      "Built a fraud detection pipeline using ensemble learning and feature engineering for financial transactions.",
    technologies: [
      "Python",
      "Pandas",
      "XGBoost",
      "SHAP",
      "Streamlit",
    ],
    github: "#",
    live: "#",
    featured: true,
  },
  {
    title: "Customer Churn Prediction",
    category: "Predictive Analytics",
    description:
      "Developed a churn prediction model with extensive feature engineering and model evaluation.",
    technologies: [
      "Python",
      "Scikit-learn",
      "Power BI",
    ],
    github: "#",
    live: "#",
    featured: true,
  },
  {
    title: "Project TITAN",
    category: "Generative AI",
    description:
      "Enterprise AI portfolio built with Next.js, TypeScript, RAG architecture and modern UI.",
    technologies: [
      "Next.js",
      "TypeScript",
      "OpenAI",
      "RAG",
    ],
    github: "#",
    live: "#",
    featured: true,
  },
];