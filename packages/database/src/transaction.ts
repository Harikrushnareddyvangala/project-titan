import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "./client.js";
import * as schema from "./schema/index.js";

export type TitanDatabaseTransaction = Parameters<
  Parameters<NodePgDatabase<typeof schema>["transaction"]>[0]
>[0];

export async function withDatabaseTransaction<T>(
  operation: (tx: TitanDatabaseTransaction) => Promise<T>,
): Promise<T> {
  return db.transaction(operation);
}
