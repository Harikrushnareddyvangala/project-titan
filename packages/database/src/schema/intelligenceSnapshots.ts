import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const intelligenceSnapshots = pgTable("intelligence_snapshots", {
  id: text("id").primaryKey(),

  repository: text("repository").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull(),

  analytics: jsonb("analytics").notNull(),
});
