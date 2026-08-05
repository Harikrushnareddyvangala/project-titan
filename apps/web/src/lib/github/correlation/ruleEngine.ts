import type {

  RepositoryComparison,

} from "@/types/github";

import type {

  CorrelatedInsight,

} from "@/types/correlation";

export interface CorrelationRule {

  readonly id: string;

  readonly name: string;

  evaluate(

    comparison: RepositoryComparison,

  ): CorrelatedInsight | null;

}

export function executeRules(

  comparison: RepositoryComparison,

  rules: readonly CorrelationRule[],

): CorrelatedInsight[] {

  return rules

    .map(

      (rule) =>

        rule.evaluate(

          comparison,

        ),

    )

    .filter(

      (

        insight,

      ): insight is CorrelatedInsight =>

        insight !== null,

    );

}