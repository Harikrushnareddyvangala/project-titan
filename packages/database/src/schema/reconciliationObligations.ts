import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { researchInvestigations } from "./investigations.js";

export const researchReconciliationObligations = pgTable(
  "research_reconciliation_obligations",
  {
    id: text("id").primaryKey(),

    investigationId: text("investigation_id").notNull(),

    issueCode: text("issue_code").notNull(),

    targetEntityType: text("target_entity_type").notNull(),

    targetEntityId: text("target_entity_id").notNull(),

    remediationAction: text("remediation_action").notNull(),

    remediationExecutionId: text("remediation_execution_id"),

    provenanceEventId: text("provenance_event_id"),

    status: text("status").notNull(),

    reason: text("reason").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull(),

    resolvedAt: timestamp("resolved_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    foreignKey({
      columns: [table.investigationId],
      foreignColumns: [researchInvestigations.id],
    }).onDelete("cascade"),

    index(
      "research_reconciliation_obligations_investigation_id_idx",
    ).on(table.investigationId),

    index(
      "research_reconciliation_obligations_status_idx",
    ).on(table.status),

    index(
      "research_reconciliation_obligations_target_entity_idx",
    ).on(table.targetEntityType, table.targetEntityId),

    index(
      "research_reconciliation_obligations_updated_at_idx",
    ).on(table.updatedAt),
  ],
);
