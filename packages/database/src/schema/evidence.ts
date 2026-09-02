import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const researchEvidence = pgTable(
  "research_evidence",
  {
    id: text("id").primaryKey(),

    type: text("type").notNull(),

    title: text("title").notNull(),

    description: text("description"),

    reference: text("reference"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    index("research_evidence_type_idx").on(table.type),

    index("research_evidence_created_at_idx").on(
      table.createdAt,
    ),
  ],
);
