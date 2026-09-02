import {
  foreignKey,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";

export const researchArtifacts = pgTable(
  "research_artifacts",
  {
    id: text("id").primaryKey(),

    type: text("type").notNull(),

    name: text("name").notNull(),

    description: text("description"),

    uri: text("uri"),

    mimeType: text("mime_type"),

    checksum: text("checksum"),

    sizeBytes: bigint("size_bytes", {
      mode: "number",
    }),

    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    index("research_artifacts_type_idx").on(table.type),

    index("research_artifacts_checksum_idx").on(
      table.checksum,
    ),

    index("research_artifacts_created_at_idx").on(
      table.createdAt,
    ),

    index("research_artifacts_updated_at_idx").on(
      table.updatedAt,
    ),
  ],
);
