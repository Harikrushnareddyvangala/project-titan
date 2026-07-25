export interface OrganizationIntelligence {

  engineeringCulture:number;

  deliveryMaturity:number;

  innovationCulture:number;

  technicalDebt:number;

  organizationalReadiness:number;

  scalingReadiness:number;

  engineeringGovernance:number;

  executiveSummary:string;

}

export interface OrganizationInput{

  engineeringScore:number;

  enterpriseReadiness:number;

  collaborationScore:number;

  leadershipReadiness:number;

  productionScore:number;

  securityScore:number;

}

export function buildOrganizationIntelligence({

  engineeringScore,

  enterpriseReadiness,

  collaborationScore,

  leadershipReadiness,

  productionScore,

  securityScore,

}:OrganizationInput):OrganizationIntelligence{

  const engineeringCulture =
    Math.round(

      (
        engineeringScore +
        collaborationScore
      ) / 2

    );

  const deliveryMaturity =
    Math.round(

      (
        productionScore +
        enterpriseReadiness
      ) / 2

    );

  const innovationCulture =
    Math.round(

      (
        engineeringScore +
        leadershipReadiness
      ) / 2

    );

  const organizationalReadiness =
    Math.round(

      (
        engineeringCulture +
        deliveryMaturity +
        innovationCulture +
        securityScore
      ) / 4

    );

  const scalingReadiness =
    Math.round(

      (
        enterpriseReadiness +
        deliveryMaturity
      ) / 2

    );

  const engineeringGovernance =
    Math.round(

      (
        securityScore +
        enterpriseReadiness
      ) / 2

    );

  const technicalDebt =
    Math.max(

      5,

      100 - engineeringScore

    );

  return{

    engineeringCulture,

    deliveryMaturity,

    innovationCulture,

    technicalDebt,

    organizationalReadiness,

    scalingReadiness,

    engineeringGovernance,

    executiveSummary:

      `Organization demonstrates ${organizationalReadiness}% engineering readiness with ${deliveryMaturity}% delivery maturity.`

  };

}