import {
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const executions = pgTable(
  "executions",
  {
    id: text("id").primaryKey(),

    lifecycleState: text("lifecycle_state").notNull(),

    startedAt: timestamp("started_at", {
      withTimezone: true,
    }),

    endedAt: timestamp("ended_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    index("executions_lifecycle_state_idx").on(
      table.lifecycleState,
    ),

    index("executions_started_at_idx").on(
      table.startedAt,
    ),

    index("executions_ended_at_idx").on(
      table.endedAt,
    ),
  ],
);
