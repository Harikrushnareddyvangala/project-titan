export interface EngineeringMentor {

  maturityLevel:
    | "Junior"
    | "Intermediate"
    | "Advanced"
    | "Senior"
    | "Principal";

  learningPriority: string;

  recommendedSkills: string[];

  roadmap: string[];

  mentorSummary: string;

}

export interface MentorInput {

  engineeringScore: number;

  architectureScore: number;

  innovationScore: number;

  enterpriseReadiness: number;

  codeQuality: number;

}

export function buildEngineeringMentor({

  engineeringScore,

  architectureScore,

  innovationScore,

  enterpriseReadiness,

  codeQuality,

}: MentorInput): EngineeringMentor {

  let maturityLevel:
    EngineeringMentor["maturityLevel"];

  if (engineeringScore >= 95)

    maturityLevel = "Principal";

  else if (engineeringScore >= 90)

    maturityLevel = "Senior";

  else if (engineeringScore >= 80)

    maturityLevel = "Advanced";

  else if (engineeringScore >= 65)

    maturityLevel = "Intermediate";

  else

    maturityLevel = "Junior";

  let learningPriority = "";

  if (enterpriseReadiness < 85)

    learningPriority = "Enterprise Architecture";

  else if (architectureScore < 85)

    learningPriority = "System Design";

  else if (innovationScore < 85)

    learningPriority = "AI Engineering";

  else

    learningPriority = "Technical Leadership";

  const recommendedSkills: string[] = [];

  if (architectureScore < 90)
    recommendedSkills.push("System Design");

  if (innovationScore < 90)
    recommendedSkills.push("Artificial Intelligence");

  if (enterpriseReadiness < 90)
    recommendedSkills.push("Cloud Architecture");

  if (codeQuality < 90)
    recommendedSkills.push("Clean Architecture");

  recommendedSkills.push("Distributed Systems");

  const roadmap = [

    "Strengthen architecture fundamentals",

    "Master cloud-native engineering",

    "Contribute to enterprise-scale projects",

    "Mentor junior engineers",

    "Lead technical initiatives",

  ];

  return {

    maturityLevel,

    learningPriority,

    recommendedSkills,

    roadmap,

    mentorSummary:
      `AI Mentor recommends focusing on ${learningPriority} to accelerate engineering growth.`,

  };

}