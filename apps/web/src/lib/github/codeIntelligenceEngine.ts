export interface CodeIntelligenceInput {

  stars: number;

  forks: number;

  issues: number;

  languageCount: number;

  contributorCount: number;

  recentCommits: number;

  repositoryAge: number;

  hasWiki: boolean;

  hasLicense: boolean;

}

export interface CodeIntelligence {

  codeQuality: number;

  documentationQuality: number;

  maintainability: number;

  enterpriseReadiness: number;

  repositoryGrade: string;

}

export function buildCodeIntelligence({

  stars,

  forks,

  issues,

  languageCount,

  contributorCount,

  recentCommits,

  repositoryAge,

  hasWiki,

  hasLicense,

}: CodeIntelligenceInput): CodeIntelligence {

  //------------------------------------------------
  // Code Quality
  //------------------------------------------------

  let codeQuality = 60;

  codeQuality += Math.min(stars, 15);

  codeQuality += Math.min(forks, 10);

  codeQuality += Math.min(languageCount * 3, 12);

  codeQuality -= Math.min(issues, 12);

  codeQuality = Math.max(

    0,

    Math.min(

      100,

      Math.round(codeQuality),

    ),

  );

  //------------------------------------------------
  // Documentation
  //------------------------------------------------

  let documentationQuality = 55;

  if (hasWiki) {

    documentationQuality += 20;

  }

  if (hasLicense) {

    documentationQuality += 15;

  }

  documentationQuality += Math.min(stars, 10);

  documentationQuality = Math.min(

    100,

    documentationQuality,

  );

  //------------------------------------------------
  // Maintainability
  //------------------------------------------------

  let maintainability = 60;

  maintainability += Math.min(

    contributorCount * 4,

    20,

  );

  maintainability += Math.min(

    recentCommits,

    10,

  );

  maintainability += Math.min(

    Math.floor(repositoryAge / 365),

    10,

  );

  maintainability -= Math.min(

    issues,

    15,

  );

  maintainability = Math.max(

    0,

    Math.min(

      100,

      Math.round(maintainability),

    ),

  );

  //------------------------------------------------
  // Enterprise Readiness
  //------------------------------------------------

  const enterpriseReadiness = Math.round(

    codeQuality * 0.35 +

    documentationQuality * 0.25 +

    maintainability * 0.40,

  );

  //------------------------------------------------
  // Grade
  //------------------------------------------------

  let repositoryGrade = "C";

  if (enterpriseReadiness >= 95)

    repositoryGrade = "A+";

  else if (enterpriseReadiness >= 90)

    repositoryGrade = "A";

  else if (enterpriseReadiness >= 80)

    repositoryGrade = "B+";

  else if (enterpriseReadiness >= 70)

    repositoryGrade = "B";

  else if (enterpriseReadiness >= 60)

    repositoryGrade = "C+";

  return {

    codeQuality,

    documentationQuality,

    maintainability,

    enterpriseReadiness,

    repositoryGrade,

  };

}