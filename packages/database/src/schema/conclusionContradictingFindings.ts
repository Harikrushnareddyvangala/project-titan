import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

import { researchInvestigationConclusions } from "./conclusions.js";
import { researchFindings } from "./findings.js";

export const researchConclusionContradictingFindings = pgTable(
  "research_conclusion_contradicting_findings",
  {
    conclusionId: text("conclusion_id").notNull(),

    findingId: text("finding_id").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.conclusionId, table.findingId],
    }),

    foreignKey({
      columns: [table.conclusionId],
      foreignColumns: [researchInvestigationConclusions.id],
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.findingId],
      foreignColumns: [researchFindings.id],
    }).onDelete("cascade"),

    index(
      "research_conclusion_contradicting_findings_finding_id_idx",
    ).on(table.findingId),
  ],
);
