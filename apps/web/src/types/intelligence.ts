/* -------------------------------------------------------------------------- */
/*                                Trend Types                                 */
/* -------------------------------------------------------------------------- */

export type TrendDirection =
  | "Rapid Growth"
  | "Growing"
  | "Stable"
  | "Declining"
  | "Critical";

/* -------------------------------------------------------------------------- */
/*                              Forecast Types                                */
/* -------------------------------------------------------------------------- */

export type ForecastDirection =
  | "Strong Growth"
  | "Growing"
  | "Stable"
  | "Declining"
  | "High Risk";

/* -------------------------------------------------------------------------- */
/*                                Risk Types                                  */
/* -------------------------------------------------------------------------- */

export type RiskLevel =
  | "Very Low"
  | "Low"
  | "Moderate"
  | "Elevated"
  | "High";

/* -------------------------------------------------------------------------- */
/*                               Grade Types                                  */
/* -------------------------------------------------------------------------- */

export type RepositoryGrade =
  | "A+"
  | "A"
  | "B+"
  | "B"
  | "C+"
  | "C"
  | "D"
  | "F";

/* -------------------------------------------------------------------------- */
/*                             Portfolio Status                               */
/* -------------------------------------------------------------------------- */

export type PortfolioHealth =
  | "Excellent"
  | "Healthy"
  | "Good"
  | "Needs Improvement"
  | "Critical";

/* -------------------------------------------------------------------------- */
/*                           Engineering Maturity                             */
/* -------------------------------------------------------------------------- */

export type EngineeringLevel =
  | "Elite"
  | "Advanced"
  | "Intermediate"
  | "Basic"
  | "Early";

/* -------------------------------------------------------------------------- */
/*                             Executive Status                               */
/* -------------------------------------------------------------------------- */

export type ExecutiveSeverity =
  | "Info"
  | "Success"
  | "Warning"
  | "Critical";

  /* -------------------------------------------------------------------------- */
/*                           Evolution Types                                  */
/* -------------------------------------------------------------------------- */

export type EvolutionDirection =
  | "Rapidly Improving"
  | "Improving"
  | "Stable"
  | "Declining"
  | "Critical";

export type RepositoryLifecycle =
  | "Existing"
  | "New"
  | "Removed";