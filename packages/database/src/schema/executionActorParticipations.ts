import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { executions } from "./executions.js";

export const executionActorParticipations = pgTable(
  "execution_actor_participations",
  {
    id: text("id").primaryKey(),

    executionId: text("execution_id").notNull(),

    actorId: text("actor_id").notNull(),

    roleNamespace: text("role_namespace").notNull(),

    roleType: text("role_type").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.executionId],
      foreignColumns: [executions.id],
    }).onDelete("cascade"),

    index(
      "execution_actor_participations_execution_id_idx",
    ).on(table.executionId),

    index(
      "execution_actor_participations_actor_id_idx",
    ).on(table.actorId),
  ],
);
