import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

import { researchExperiments } from "./experiments.js";
import { researchFindings } from "./findings.js";

export const researchExperimentFindings = pgTable(
  "research_experiment_findings",
  {
    experimentId: text("experiment_id").notNull(),

    findingId: text("finding_id").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.experimentId, table.findingId],
    }),

    foreignKey({
      columns: [table.experimentId],
      foreignColumns: [researchExperiments.id],
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.findingId],
      foreignColumns: [researchFindings.id],
    }).onDelete("cascade"),

    index(
      "research_experiment_findings_finding_id_idx",
    ).on(table.findingId),
  ],
);
