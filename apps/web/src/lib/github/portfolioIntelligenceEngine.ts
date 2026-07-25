import type { RepositoryAnalytics } from "@/types/github";

export interface PortfolioIntelligence {

  totalRepositories:number;

  totalStars:number;

  totalForks:number;

  averageEngineeringScore:number;

  averageSecurityScore:number;

  averageEnterpriseReadiness:number;

  portfolioHealth:number;

  engineeringBrand:string;

  specialization:string;

  portfolioMaturity:string;

  executiveSummary:string;

}

export interface PortfolioInput{

  repositories:RepositoryAnalytics[];

}

export function buildPortfolioIntelligence({

  repositories,

}:PortfolioInput):PortfolioIntelligence{

  const totalRepositories =
    repositories.length;

  const totalStars =
    repositories.reduce(
      (sum,r)=>sum+r.stars,
      0,
    );

  const totalForks =
    repositories.reduce(
      (sum,r)=>sum+r.forks,
      0,
    );

  const averageEngineeringScore =
    Math.round(

      repositories.reduce(
        (sum,r)=>sum+r.engineeringScore,
        0,
      )/Math.max(totalRepositories,1)

    );

  const averageSecurityScore =
    Math.round(

      repositories.reduce(
        (sum,r)=>sum+r.securityScore,
        0,
      )/Math.max(totalRepositories,1)

    );

  const averageEnterpriseReadiness =
    Math.round(

      repositories.reduce(
        (sum,r)=>sum+r.enterpriseReadiness,
        0,
      )/Math.max(totalRepositories,1)

    );

  const portfolioHealth =
    Math.round(

      (
        averageEngineeringScore+
        averageSecurityScore+
        averageEnterpriseReadiness
      )/3

    );

  let engineeringBrand="Growing Engineer";

  if(portfolioHealth>=95)
    engineeringBrand="Enterprise AI Architect";

  else if(portfolioHealth>=90)
    engineeringBrand="Senior AI Engineer";

  else if(portfolioHealth>=82)
    engineeringBrand="Full Stack AI Engineer";

  else if(portfolioHealth>=75)
    engineeringBrand="Software Engineer";

  let portfolioMaturity="Growing";

  if(portfolioHealth>=95)
    portfolioMaturity="Enterprise";

  else if(portfolioHealth>=88)
    portfolioMaturity="Advanced";

  else if(portfolioHealth>=75)
    portfolioMaturity="Professional";

  const specialization="Artificial Intelligence";

  return{

    totalRepositories,

    totalStars,

    totalForks,

    averageEngineeringScore,

    averageSecurityScore,

    averageEnterpriseReadiness,

    portfolioHealth,

    engineeringBrand,

    specialization,

    portfolioMaturity,

    executiveSummary:

      `${engineeringBrand} portfolio with ${portfolioHealth}% overall engineering health.`,

  };

}