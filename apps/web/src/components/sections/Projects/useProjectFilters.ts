"use client";

import { useMemo, useState } from "react";

import { projects } from "./data";
import type { ProjectCategory } from "./types";
import type { SortOption } from "./ProjectSort";

export function useProjectFilters() {
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory>("All");

  const [sortBy, setSortBy] =
    useState<SortOption>("featured");

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.categories.includes(selectedCategory);

      const matchesSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.description
          .toLowerCase()
          .includes(query) ||
        project.categories.some((category) =>
          category.toLowerCase().includes(query),
        ) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(query),
        );

      return (
        matchesCategory &&
        matchesSearch
      );
    });

    switch (sortBy) {
      case "featured":
        filtered.sort(
          (a, b) =>
            Number(b.featured) -
            Number(a.featured),
        );
        break;

      case "name":
        filtered.sort((a, b) =>
          a.title.localeCompare(b.title),
        );
        break;

      case "newest":
        break;

      case "impact":
        break;
    }

    return filtered;
  }, [
    search,
    selectedCategory,
    sortBy,
  ]);

  return {
    search,
    setSearch,

    selectedCategory,
    setSelectedCategory,

    sortBy,
    setSortBy,

    filteredProjects,
  };
}