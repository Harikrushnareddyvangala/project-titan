import {
  foreignKey,
  index,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const researchFindings = pgTable(
  "research_findings",
  {
    id: text("id").primaryKey(),

    statement: text("statement").notNull(),

    confidence: real("confidence"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    index("research_findings_created_at_idx").on(
      table.createdAt,
    ),

    index("research_findings_updated_at_idx").on(
      table.updatedAt,
    ),
  ],
);
