import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";

import * as schema from "./schema/index.js";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let poolInstance: Pool | undefined;
let dbInstance: Database | undefined;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize the database client.");
  }

  return databaseUrl;
}

function getPool(): Pool {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  return poolInstance;
}

function getDb(): Database {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), {
      schema,
    });
  }

  return dbInstance;
}

export const pool = new Proxy({} as Pool, {
  get(_target, property, receiver) {
    return Reflect.get(getPool(), property, receiver);
  },
});

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});
