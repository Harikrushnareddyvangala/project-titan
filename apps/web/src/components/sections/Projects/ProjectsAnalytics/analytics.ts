import { projects } from "../data";

export function getPortfolioAnalytics() {
  const technologies = new Map<
    string,
    number
  >();

  const categories = new Map<
    string,
    number
  >();

  let featuredProjects = 0;

  projects.forEach((project) => {
    if (project.featured)
      featuredProjects++;

    project.technologies.forEach((tech) => {
      technologies.set(
        tech,
        (technologies.get(tech) ?? 0) + 1,
      );
    });

    project.categories.forEach((category) => {
      categories.set(
        category,
        (categories.get(category) ?? 0) + 1,
      );
    });
  });

  return {
    totalProjects: projects.length,

    featuredProjects,

    totalTechnologies:
      technologies.size,

    categories: [...categories.entries()]
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value),

    technologies: [
      ...technologies.entries(),
    ]
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10),
  };
}