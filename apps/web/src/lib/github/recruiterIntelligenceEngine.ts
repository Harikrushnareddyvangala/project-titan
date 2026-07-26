import type { Recommendation } from "@/types/github";

export interface RecruiterIntelligence {

  hiringScore: number;

  engineeringLevel:
    | "Junior"
    | "Mid-Level"
    | "Senior"
    | "Staff"
    | "Principal";

  recruiterVerdict: string;

  salaryRange: string;

  hiringConfidence: number;

  recommendedRoles: string[];

  

}

export interface RecruiterInput {

  engineeringScore: number;

  productionScore: number;

  securityScore: number;

  enterpriseReadiness: number;

  repositoryGrade: string;

  contributorCount: number;

  collaborationIndex: number;

  recommendations: Recommendation[];

}

export function buildRecruiterIntelligence({

  engineeringScore,

  productionScore,

  securityScore,

  enterpriseReadiness,

  repositoryGrade,

  contributorCount,

  collaborationIndex,

}: RecruiterInput): RecruiterIntelligence {

  //------------------------------------

  const hiringScore = Math.round(

    engineeringScore * 0.40 +

    productionScore * 0.20 +

    securityScore * 0.15 +

    enterpriseReadiness * 0.15 +

    collaborationIndex * 0.10

  );

  //------------------------------------

  let engineeringLevel:

    RecruiterIntelligence["engineeringLevel"];

  if (hiringScore >= 96)

    engineeringLevel = "Principal";

  else if (hiringScore >= 90)

    engineeringLevel = "Staff";

  else if (hiringScore >= 82)

    engineeringLevel = "Senior";

  else if (hiringScore >= 70)

    engineeringLevel = "Mid-Level";

  else

    engineeringLevel = "Junior";

  //------------------------------------

  let recruiterVerdict = "";

  switch (engineeringLevel) {

    case "Principal":

      recruiterVerdict =
        "Exceptional engineering capability suitable for technical leadership.";

      break;

    case "Staff":

      recruiterVerdict =
        "Excellent senior engineering portfolio.";

      break;

    case "Senior":

      recruiterVerdict =
        "Strong production engineering skills.";

      break;

    case "Mid-Level":

      recruiterVerdict =
        "Solid engineering fundamentals.";

      break;

    default:

      recruiterVerdict =
        "Growing engineering profile.";

  }

  //------------------------------------

  let salaryRange = "";

  switch (engineeringLevel) {

    case "Principal":

      salaryRange = "$220k+";

      break;

    case "Staff":

      salaryRange = "$180k–220k";

      break;

    case "Senior":

      salaryRange = "$130k–180k";

      break;

    case "Mid-Level":

      salaryRange = "$80k–130k";

      break;

    default:

      salaryRange = "$50k–80k";

  }

  //------------------------------------

  const hiringConfidence =

    Math.min(

      100,

      hiringScore + 3,

    );

  //------------------------------------

  const recommendedRoles: string[] = [];

  if (repositoryGrade === "A+")

    recommendedRoles.push(

      "Senior Software Engineer",

      "AI Engineer",

      "Platform Engineer"

    );

  if (enterpriseReadiness >= 90)

    recommendedRoles.push(

      "Solutions Architect"

    );

  if (securityScore >= 90)

    recommendedRoles.push(

      "Cloud Engineer"

    );

  if (recommendedRoles.length === 0)

    recommendedRoles.push(

      "Software Engineer"

    );

  //------------------------------------

  return {

    hiringScore,

    engineeringLevel,

    recruiterVerdict,

    salaryRange,

    hiringConfidence,

    recommendedRoles,

    

  };

}