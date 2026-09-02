import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { researchInvestigations } from "./investigations.js";

export const researchInvestigationConclusions = pgTable(
  "research_investigation_conclusions",
  {
    id: text("id").primaryKey(),

    investigationId: text("investigation_id").notNull(),

    statement: text("statement").notNull(),

    status: text("status").notNull(),

    uncertainty: text("uncertainty"),

    nextAction: text("next_action"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.investigationId],
      foreignColumns: [researchInvestigations.id],
    }).onDelete("cascade"),

    index(
      "research_investigation_conclusions_investigation_id_idx",
    ).on(table.investigationId),

    index(
      "research_investigation_conclusions_status_idx",
    ).on(table.status),

    index(
      "research_investigation_conclusions_updated_at_idx",
    ).on(table.updatedAt),
  ],
);
