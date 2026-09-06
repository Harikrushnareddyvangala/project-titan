import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { executions } from "./executions.js";

export const executionLifecycleTransitions = pgTable(
  "execution_lifecycle_transitions",
  {
    id: text("id").primaryKey(),

    executionId: text("execution_id").notNull(),

    fromState: text("from_state").notNull(),

    toState: text("to_state").notNull(),

    reason: text("reason"),

    timestamp: timestamp("timestamp", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.executionId],
      foreignColumns: [executions.id],
    }).onDelete("no action"),

    index(
      "execution_lifecycle_transitions_execution_id_idx",
    ).on(table.executionId),

    index(
      "execution_lifecycle_transitions_timestamp_idx",
    ).on(table.timestamp),
  ],
);
