import {
  foreignKey,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { intelligenceSnapshots } from "./intelligenceSnapshots.js";

export const intelligenceArtifacts = pgTable(
  "intelligence_artifacts",
  {
    artifactId: text("artifact_id").primaryKey(),

    artifactType: text("artifact_type").notNull(),

    repository: text("repository").notNull(),

    sourceSnapshotId: text("source_snapshot_id")
      .notNull()
      .references(() => intelligenceSnapshots.id, {
        onDelete: "no action",
      }),

    author: text("author").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),

    generatedAt: timestamp("generated_at", {
      withTimezone: true,
    }).notNull(),

    version: text("version").notNull(),

    format: text("format").notNull(),

    source: text("source").notNull(),

    status: text("status").notNull(),

    previousArtifactId: text("previous_artifact_id"),

    metadata: jsonb("metadata").notNull(),

    integrity: jsonb("integrity"),

    signature: jsonb("signature"),
  },
  (table) => ({
    sourceArtifactVersionUnique: uniqueIndex(
      "intelligence_artifacts_source_type_version_idx",
    ).on(table.sourceSnapshotId, table.artifactType, table.version),

    previousArtifactIndex: index(
      "intelligence_artifacts_previous_artifact_idx",
    ).on(table.previousArtifactId),

    previousArtifactForeignKey: foreignKey({
      columns: [table.previousArtifactId],
      foreignColumns: [table.artifactId],
      name: "intelligence_artifacts_previous_artifact_fk",
    }).onDelete("no action"),
  }),
);
