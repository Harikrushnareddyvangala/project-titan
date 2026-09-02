import {
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const researchInvestigations = pgTable(
  "research_investigations",
  {
    id: text("id").primaryKey(),

    title: text("title").notNull(),

    objective: text("objective").notNull(),

    question: text("question").notNull(),

    status: text("status").notNull(),

    description: text("description"),

    repository: text("repository"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    index("research_investigations_status_idx").on(table.status),
    index("research_investigations_updated_at_idx").on(
      table.updatedAt,
    ),
  ],
);
