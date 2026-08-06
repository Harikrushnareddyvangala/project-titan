import { projects } from "./data";

export const getFeaturedProjects = () =>
  projects
    .filter((project) => project.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder);

export const getFlagshipProject = () =>
  projects.find((project) => project.flagship);

export const getProjectsByCategory = (category: string) =>
  projects.filter((project) =>
    project.categories.includes(category)
  );