"use client";

import { useMemo } from "react";
import type { GithubRepository } from "@/types/github";

export interface RepositoryAnalytics {
  repositoryAge: number;
  inactiveDays: number;

  engineeringScore: number;
  healthScore: number;
  productionScore: number;

  deploymentReady: boolean;

  riskLevel: "Low" | "Medium" | "High";

  quality:
    | "Outstanding"
    | "Excellent"
    | "Good"
    | "Growing";

  recommendations: string[];
}

const DAY_MS = 1000 * 60 * 60 * 24;

export function useRepositoryAnalytics(
  repository: GithubRepository | null,
): RepositoryAnalytics {

  return useMemo(() => {

    if (!repository) {
      return {
        repositoryAge: 0,
        inactiveDays: 0,

        engineeringScore: 0,
        healthScore: 0,
        productionScore: 0,

        deploymentReady: false,

        riskLevel: "Low",

        quality: "Growing",

        recommendations: [],
      };
    }

    //--------------------------------------------------
    // Repository Age
    //--------------------------------------------------

    const created = new Date(repository.created_at);
    const updated = new Date(repository.updated_at);

    const repositoryAge = Math.floor(
      (updated.getTime() - created.getTime()) / DAY_MS,
    );

    const inactiveDays = Math.max(
      0,
      Math.floor(
        (updated.getTime() - created.getTime()) / DAY_MS,
      ),
    );

    //--------------------------------------------------
    // Engineering Score
    //--------------------------------------------------

    let engineeringScore = 70;

    engineeringScore += Math.min(
      repository.stargazers_count,
      10,
    );

    engineeringScore += Math.min(
      repository.forks_count,
      10,
    );

    engineeringScore += Math.min(
      repository.watchers_count,
      10,
    );

    engineeringScore -= Math.min(
      repository.open_issues_count,
      15,
    );

    engineeringScore = Math.max(
      0,
      Math.min(engineeringScore, 100),
    );

    //--------------------------------------------------
    // Health Score
    //--------------------------------------------------

    let healthScore = 100;

    healthScore -= repository.open_issues_count * 2;

    healthScore -= Math.floor(
      inactiveDays / 15,
    );

    healthScore = Math.max(
      0,
      Math.min(healthScore, 100),
    );

    //--------------------------------------------------
    // Production Score
    //--------------------------------------------------

    const productionScore = Math.round(

      engineeringScore * 0.45 +

      healthScore * 0.35 +

      Math.min(
        repository.watchers_count * 2,
        20,
      ),

    );

    //--------------------------------------------------
    // Risk Level
    //--------------------------------------------------

    let riskLevel:
      | "Low"
      | "Medium"
      | "High";

    if (productionScore >= 85) {
      riskLevel = "Low";
    } else if (productionScore >= 65) {
      riskLevel = "Medium";
    } else {
      riskLevel = "High";
    }

    //--------------------------------------------------
    // Quality
    //--------------------------------------------------

    let quality:
      | "Outstanding"
      | "Excellent"
      | "Good"
      | "Growing";

    if (productionScore >= 90) {
      quality = "Outstanding";
    } else if (productionScore >= 80) {
      quality = "Excellent";
    } else if (productionScore >= 65) {
      quality = "Good";
    } else {
      quality = "Growing";
    }

    //--------------------------------------------------
    // Deployment Ready
    //--------------------------------------------------

    const deploymentReady =
      productionScore >= 80 &&
      repository.open_issues_count < 10 &&
      inactiveDays < 90;

    //--------------------------------------------------
    // Recommendations
    //--------------------------------------------------

    const recommendations: string[] = [];

    if (repository.open_issues_count > 10) {
      recommendations.push(
        "Reduce open issues to improve maintainability.",
      );
    }

    if (repository.stargazers_count < 20) {
      recommendations.push(
        "Increase repository visibility through an improved README and project demonstrations.",
      );
    }

    if (repository.watchers_count < 5) {
      recommendations.push(
        "Increase community engagement with documentation and releases.",
      );
    }

    if (repository.forks_count < 3) {
      recommendations.push(
        "Encourage community contributions by adding contribution guidelines.",
      );
    }

    if (inactiveDays > 90) {
      recommendations.push(
        "Repository appears inactive. Schedule regular maintenance updates.",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Excellent repository health. Continue following current engineering practices.",
      );
    }

    //--------------------------------------------------

    return {

      repositoryAge,

      inactiveDays,

      engineeringScore,

      healthScore,

      productionScore,

      deploymentReady,

      riskLevel,

      quality,

      recommendations,

    };

  }, [repository]);

}