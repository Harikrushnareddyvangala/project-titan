import {
  check,
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { executions } from "./executions.js";

export const executionResourceInteractions = pgTable(
  "execution_resource_interactions",
  {
    id: text("id").primaryKey(),
    executionId: text("execution_id").notNull(),

    targetKind: text("target_kind").notNull(),
    targetResourceId: text("target_resource_id").notNull(),
    targetResourceType: text("target_resource_type").notNull(),
    targetResourceNamespace: text("target_resource_namespace").notNull(),
    targetRevisionVersion: text("target_revision_version"),
    targetRevisionCreatedAt: timestamp("target_revision_created_at", {
      withTimezone: true,
    }),

    operationNamespace: text("operation_namespace").notNull(),
    operationType: text("operation_type").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.executionId],
      foreignColumns: [executions.id],
    }).onDelete("cascade"),

    check(
      "execution_resource_interactions_target_kind_check",
      sql`${table.targetKind} IN ('resource', 'revision')`,
    ),

    check(
      "execution_resource_interactions_target_revision_consistency_check",
      sql`(
        (${table.targetKind} = 'resource'
          AND ${table.targetRevisionVersion} IS NULL
          AND ${table.targetRevisionCreatedAt} IS NULL)
        OR
        (${table.targetKind} = 'revision'
          AND ${table.targetRevisionVersion} IS NOT NULL
          AND ${table.targetRevisionCreatedAt} IS NOT NULL)
      )`,
    ),

    index(
      "execution_resource_interactions_execution_id_idx",
    ).on(table.executionId),

    index(
      "execution_resource_interactions_target_resource_id_idx",
    ).on(table.targetResourceId),

    index(
      "execution_resource_interactions_operation_idx",
    ).on(table.operationNamespace, table.operationType),

    index(
      "execution_resource_interactions_created_at_idx",
    ).on(table.createdAt),
  ],
);
