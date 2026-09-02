import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

import { researchEvidence } from "./evidence.js";
import { researchExperiments } from "./experiments.js";

export const researchExperimentEvidence = pgTable(
  "research_experiment_evidence",
  {
    experimentId: text("experiment_id").notNull(),

    evidenceId: text("evidence_id").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.experimentId, table.evidenceId],
    }),

    foreignKey({
      columns: [table.experimentId],
      foreignColumns: [researchExperiments.id],
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.evidenceId],
      foreignColumns: [researchEvidence.id],
    }).onDelete("cascade"),

    index("research_experiment_evidence_evidence_id_idx").on(
      table.evidenceId,
    ),
  ],
);
