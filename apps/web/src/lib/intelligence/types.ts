export type IntelligenceSectionId =
  | "executive"
  | "engineering"
  | "technology"
  | "development"
  | "enterprise"
  | "recruiter"
  | "recommendations";

export interface IntelligenceSection {
  id: IntelligenceSectionId;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
}