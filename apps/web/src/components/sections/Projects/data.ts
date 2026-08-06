import type { Project } from "./types";

export const projects: Project[] = [
  {
  id: "fraud-detection",

  slug: "fraud-detection",

  title: "Fraud Detection System",

  featured: true,

  flagship: false,

  displayOrder: 2,

  year: 2024,

  status: "Completed",

  shortDescription:
    "AI-powered Financial Fraud Detection Platform",

  description:
    "Designed and developed an end-to-end fraud detection platform that identifies suspicious financial transactions using advanced feature engineering, ensemble learning, and explainable AI. The solution leverages XGBoost with SHAP-based interpretability to deliver accurate, transparent, and business-ready fraud risk predictions through an interactive analytics dashboard.",

  categories: [
    "Machine Learning",
    "Analytics",
    "AI",
    "Data Science",
  ],

  technologies: [
    "Python",
    "Pandas",
    "XGBoost",
    "SHAP",
    "Streamlit",
  ],

  highlights: [
    "Fraud Risk Prediction",
    "Explainable AI",
    "Financial Analytics",
    "Feature Engineering",
    "Interactive Dashboard",
  ],

  metrics: [
    {
      label: "Domain",
      value: "FinTech",
    },
    {
      label: "AI Engine",
      value: "XGBoost",
    },
    {
      label: "Explainability",
      value: "SHAP",
    },
  ],

  image: "/projects/fraud-detection.jpg",

  github: "#",

  live: "#",

  links: [],
},

  {
  id: "customer-churn",

  slug: "customer-churn",

  title: "Customer Churn Prediction",

  featured: true,

  flagship: false,

  displayOrder: 3,

  year: 2023,

  status: "Completed",

  shortDescription:
    "Predictive Customer Retention Platform",

  description:
    "Built a customer churn prediction platform that combines predictive machine learning with business intelligence to identify at-risk customers before attrition occurs. The solution integrates feature engineering, model evaluation, and interactive Power BI dashboards to transform customer behavior into actionable retention strategies.",

  categories: [
    "Machine Learning",
    "Analytics",
    "Business Intelligence",
    "Data Science",
  ],

  technologies: [
    "Python",
    "Scikit-learn",
    "Power BI",
    "Pandas",
    "SQL",
  ],

  highlights: [
    "Customer Churn Prediction",
    "Predictive Analytics",
    "Business Intelligence",
    "Interactive Dashboard",
    "Feature Engineering",
  ],

  metrics: [
    {
      label: "Domain",
      value: "CRM",
    },
    {
      label: "ML Framework",
      value: "Scikit-learn",
    },
    {
      label: "Visualization",
      value: "Power BI",
    },
  ],

  image: "/projects/churn-prediction.jpg",

  github: "#",

  live: "#",

  links: [],
},

  {
    id: "project-titan",

    title: "Project TITAN",

    slug: "project-titan",

    shortDescription:
        "Engineering Intelligence Platform",

    description:
        "A production-grade engineering intelligence platform that combines AI, software architecture, engineering analytics and interactive portfolio experiences.",

    featured: true,

    flagship: true,

    displayOrder: 1,

    status: "In Progress",

    year: 2026,

    categories: [
        "AI",
        "Engineering",
        "Portfolio",
        "Analytics"
    ],

    technologies: [
        "Next.js",
        "TypeScript",
        "OpenAI",
        "Tailwind CSS",
        "Framer Motion"
    ],

    highlights: [
        "Architecture Center",
        "Engineering Intelligence",
        "AI Advisor",
        "Repository Analytics",
        "Workspace Platform"
    ],

    metrics: [
        {
            label: "Commits",
            value: "235+"
        },
        {
            label: "Modules",
            value: "20+"
        },
        {
            label: "Components",
            value: "500+"
        }
    ],

    image: "/projects/project-titan.jpg",

    github: "#",

    live: "#"
},
];