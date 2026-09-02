import {
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const idColumn = (name = "id") =>
  text(name).primaryKey();

export const createdAtColumn = () =>
  timestamp("created_at", {
    withTimezone: true,
  }).notNull();

export const updatedAtColumn = () =>
  timestamp("updated_at", {
    withTimezone: true,
  }).notNull();
