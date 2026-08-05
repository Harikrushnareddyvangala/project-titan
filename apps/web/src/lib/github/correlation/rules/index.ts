import type {

  CorrelationRule,

} from "../ruleEngine";

import { HighRepositoryRiskRule } from "./HighRepositoryRiskRule";
import { TechnicalDebtRule } from "./TechnicalDebtRule";
import { RegressionRule } from "./RegressionRule";
import { ReleaseReadinessRule } from "./ReleaseReadinessRule";

export const correlationRules: readonly CorrelationRule[] = [

  HighRepositoryRiskRule,

  TechnicalDebtRule,

  RegressionRule,

  ReleaseReadinessRule,

];