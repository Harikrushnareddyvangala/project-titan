import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "Fraud Detection System",
    categories: [
      "Machine Learning",
      "Analytics",
      "AI",
      "Data Science",
    ],
    description:
      "Built a fraud detection pipeline using ensemble learning, feature engineering, XGBoost, SHAP explainability, and financial transaction analytics.",
    technologies: [
      "Python",
      "Pandas",
      "XGBoost",
      "SHAP",
      "Streamlit",
    ],
    image: "/projects/fraud-detection.jpg",
    github: "#",
    live: "#",
    featured: true,
  },

  {
    title: "Customer Churn Prediction",
    categories: [
      "Machine Learning",
      "Analytics",
      "Business Intelligence",
      "Data Science",
    ],
    description:
      "Developed a predictive analytics model for customer churn using feature engineering, model evaluation, and interactive Power BI dashboards.",
    technologies: [
      "Python",
      "Scikit-learn",
      "Power BI",
    ],
    image: "/projects/churn-prediction.jpg",
    github: "#",
    live: "#",
    featured: true,
  },

  {
    title: "Project TITAN",
    categories: [
      "AI",
      "Web",
      "Visualization",
    ],
    description:
      "Enterprise AI portfolio built with Next.js, TypeScript, RAG architecture, OpenAI integration, and modern interactive UI.",
    technologies: [
      "Next.js",
      "TypeScript",
      "OpenAI",
      "RAG",
    ],
    image: "/projects/project-titan.jpg",
    github: "#",
    live: "#",
    featured: true,
  },
];