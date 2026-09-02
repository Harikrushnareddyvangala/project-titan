import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

import { researchFindings } from "./findings.js";
import { researchInvestigations } from "./investigations.js";

export const researchInvestigationFindings = pgTable(
  "research_investigation_findings",
  {
    investigationId: text("investigation_id").notNull(),

    findingId: text("finding_id").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.investigationId, table.findingId],
    }),

    foreignKey({
      columns: [table.investigationId],
      foreignColumns: [researchInvestigations.id],
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.findingId],
      foreignColumns: [researchFindings.id],
    }).onDelete("cascade"),

    index(
      "research_investigation_findings_finding_id_idx",
    ).on(table.findingId),
  ],
);
