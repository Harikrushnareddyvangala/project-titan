export interface AIRecommendationInput {

  engineeringScore: number;

  securityScore: number;

  productionScore: number;

  busFactor: number;

  documentationQuality: number;

  enterpriseReadiness: number;

}

export interface AIRecommendation {

  priority:
    | "High"
    | "Medium"
    | "Low";

  category: string;

  recommendation: string;

}

export function buildAIRecommendations({

  engineeringScore,

  securityScore,

  productionScore,

  busFactor,

  documentationQuality,

  enterpriseReadiness,

}: AIRecommendationInput): AIRecommendation[] {

  const recommendations: AIRecommendation[] = [];

  //----------------------------------
  // Engineering
  //----------------------------------

  if (
    engineeringScore < 80
  ) {

    recommendations.push({

      priority: "High",

      category: "Engineering",

      recommendation:
        "Improve engineering practices by increasing testing, documentation, and code modularity.",

    });

  }

  //----------------------------------
  // Security
  //----------------------------------

  if (
    securityScore < 80
  ) {

    recommendations.push({

      priority: "High",

      category: "Security",

      recommendation:
        "Add repository license, improve security configuration, and enable GitHub Security features.",

    });

  }

  //----------------------------------
  // CI/CD
  //----------------------------------

  if (
    productionScore < 85
  ) {

    recommendations.push({

      priority: "Medium",

      category: "DevOps",

      recommendation:
        "Introduce GitHub Actions CI/CD before production deployment.",

    });

  }

  //----------------------------------
  // Team
  //----------------------------------

  if (
    busFactor <= 1
  ) {

    recommendations.push({

      priority: "Medium",

      category: "Collaboration",

      recommendation:
        "Increase contributor diversity to reduce project risk.",

    });

  }

  //----------------------------------
  // Documentation
  //----------------------------------

  if (
    documentationQuality < 80
  ) {

    recommendations.push({

      priority: "Low",

      category: "Documentation",

      recommendation:
        "Expand README, architecture documentation and API examples.",

    });

  }

  //----------------------------------
  // Enterprise
  //----------------------------------

  if (
    enterpriseReadiness > 90
  ) {

    recommendations.push({

      priority: "Low",

      category: "Architecture",

      recommendation:
        "Repository is suitable for Docker, Kubernetes and cloud deployment.",

    });

  }

  //----------------------------------

  return recommendations;

}