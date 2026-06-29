import type { ProjectDetail } from "./project-details";

export const projectDetails: Record<
  string,
  ProjectDetail
> = {
  "Fraud Detection System": {
    title: "Fraud Detection System",

    summary:
      "Enterprise-grade fraud detection platform powered by Machine Learning and explainable AI.",

    challenge:
      "Financial institutions require real-time fraud detection while minimizing false positives.",

    solution:
      "Designed an XGBoost pipeline with feature engineering, SHAP explainability, and Streamlit dashboards.",

    features: [
  "Real-time fraud prediction engine",
  "Advanced feature engineering pipeline",
  "SHAP model explainability",
  "Interactive Streamlit dashboard",
  "High-performance XGBoost classifier",
  "Scalable transaction scoring",
],

    architecture: [
  "Transaction Data Collection",
  "Data Cleaning & Validation",
  "Feature Engineering",
  "XGBoost Model Training",
  "SHAP Explainability",
  "Real-Time Fraud Prediction",
  "Interactive Streamlit Dashboard",
],

    technologies: [
      "Python",
      "Pandas",
      "XGBoost",
      "SHAP",
      "Streamlit",
    ],

    metrics: [
      {
        label: "Accuracy",
        value: "97.8%",
      },
      {
        label: "Precision",
        value: "96.4%",
      },
      {
        label: "Recall",
        value: "95.9%",
      },
      {
        label: "F1 Score",
        value: "96.1%",
      },
    ],

    screenshots: [
      "/projects/fraud-detection.jpg",
      "/projects/fraud-dashboard.jpg",
  "/projects/fraud-model.jpg",
    ],

    github: "#",

    live: "#",
  },

  "Customer Churn Prediction": {
    title: "Customer Churn Prediction",

    summary:
      "Predictive analytics solution for customer retention.",

    challenge:
      "Identify customers likely to leave before churn occurs.",

    solution:
      "Built classification models with feature engineering and Power BI dashboards.",

    features: [
  "Customer churn prediction",
  "Automated feature engineering",
  "Model comparison dashboard",
  "Power BI reporting",
  "Customer segmentation",
  "Probability scoring",
],

    architecture: [
  "Customer Data Collection",
  "Data Preprocessing",
  "Feature Engineering",
  "Machine Learning Model Training",
  "Customer Segmentation",
  "Prediction API",
  "Power BI Dashboard",
],

    technologies: [
      "Python",
      "Scikit-learn",
      "Power BI",
    ],

    metrics: [
      {
        label: "Accuracy",
        value: "94.2%",
      },
    ],

    screenshots: [
      "/projects/churn-prediction.jpg",
      "/projects/churn-dashboard.jpg",
  "/projects/churn-report.jpg",
    ],

    github: "#",

    live: "#",
  },

  "Project TITAN": {
    title: "Project TITAN",

    summary:
      "Modern AI portfolio built with Next.js and TypeScript.",

    challenge:
      "Build a premium AI portfolio with scalable architecture.",

    solution:
      "Developed modular Next.js application using reusable components and modern UI.",

    features: [
  "Modern glassmorphism UI",
  "Responsive design",
  "Reusable React components",
  "Framer Motion animations",
  "Dark mode support",
  "SEO optimized",
],

    architecture: [
  "Next.js Application",
  "Reusable Component Architecture",
  "Tailwind CSS Styling",
  "Framer Motion Animations",
  "API Integration Layer",
  "Vercel Deployment Pipeline",
],

    technologies: [
      "Next.js",
      "TypeScript",
      "OpenAI",
      "Tailwind",
    ],

    metrics: [
      {
        label: "Performance",
        value: "100",
      },
    ],

    screenshots: [
      "/projects/project-titan.jpg",
      "/projects/project-home.jpg",
  "/projects/project-mobile.jpg",
    ],

    github: "#",

    live: "#",
  },
};