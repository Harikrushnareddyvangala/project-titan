import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/index.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize the database client.");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, {
  schema,
});
