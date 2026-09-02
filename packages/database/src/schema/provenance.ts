import {
  foreignKey,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { researchInvestigations } from "./investigations.js";

export const researchProvenanceEvents = pgTable(
  "research_provenance_events",
  {
    id: text("id").primaryKey(),

    investigationId: text("investigation_id").notNull(),

    entityType: text("entity_type").notNull(),

    entityId: text("entity_id").notNull(),

    eventType: text("event_type").notNull(),

    fromStatus: text("from_status"),

    toStatus: text("to_status"),

    reason: text("reason"),

    actor: text("actor"),

    timestamp: timestamp("timestamp", {
      withTimezone: true,
    }).notNull(),

    metadata: jsonb("metadata"),
  },
  (table) => [
    foreignKey({
      columns: [table.investigationId],
      foreignColumns: [researchInvestigations.id],
    }).onDelete("no action"),

    index(
      "research_provenance_events_investigation_id_idx",
    ).on(table.investigationId),

    index(
      "research_provenance_events_entity_idx",
    ).on(table.entityType, table.entityId),

    index(
      "research_provenance_events_event_type_idx",
    ).on(table.eventType),

    index(
      "research_provenance_events_timestamp_idx",
    ).on(table.timestamp),
  ],
);
