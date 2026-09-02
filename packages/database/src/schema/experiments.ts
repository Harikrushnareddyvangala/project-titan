import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { researchInvestigations } from "./investigations.js";

export const researchExperiments = pgTable(
  "research_experiments",
  {
    id: text("id").primaryKey(),

    investigationId: text("investigation_id").notNull(),

    title: text("title").notNull(),

    objective: text("objective").notNull(),

    status: text("status").notNull(),

    description: text("description"),

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

    index("research_experiments_investigation_id_idx").on(
      table.investigationId,
    ),

    index("research_experiments_status_idx").on(table.status),

    index("research_experiments_updated_at_idx").on(
      table.updatedAt,
    ),
  ],
);

export const researchExperimentLifecycleEvents = pgTable(
  "research_experiment_lifecycle_events",
  {
    id: text("id").primaryKey(),

    experimentId: text("experiment_id").notNull(),

    fromStatus: text("from_status"),

    toStatus: text("to_status").notNull(),

    reason: text("reason"),

    timestamp: timestamp("timestamp", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.experimentId],
      foreignColumns: [researchExperiments.id],
    }).onDelete("no action"),

    index(
      "research_experiment_lifecycle_events_experiment_id_idx",
    ).on(table.experimentId),

    index(
      "research_experiment_lifecycle_events_timestamp_idx",
    ).on(table.timestamp),
  ],
);
