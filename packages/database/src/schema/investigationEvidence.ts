import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

import { researchEvidence } from "./evidence.js";
import { researchInvestigations } from "./investigations.js";

export const researchInvestigationEvidence = pgTable(
  "research_investigation_evidence",
  {
    investigationId: text("investigation_id").notNull(),

    evidenceId: text("evidence_id").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.investigationId, table.evidenceId],
    }),

    foreignKey({
      columns: [table.investigationId],
      foreignColumns: [researchInvestigations.id],
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.evidenceId],
      foreignColumns: [researchEvidence.id],
    }).onDelete("cascade"),

    index("research_investigation_evidence_evidence_id_idx").on(
      table.evidenceId,
    ),
  ],
);
