import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

import { researchArtifacts } from "./artifacts.js";
import { researchInvestigations } from "./investigations.js";

export const researchInvestigationArtifacts = pgTable(
  "research_investigation_artifacts",
  {
    investigationId: text("investigation_id").notNull(),

    artifactId: text("artifact_id").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.investigationId, table.artifactId],
    }),

    foreignKey({
      columns: [table.investigationId],
      foreignColumns: [researchInvestigations.id],
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.artifactId],
      foreignColumns: [researchArtifacts.id],
    }).onDelete("cascade"),

    index(
      "research_investigation_artifacts_artifact_id_idx",
    ).on(table.artifactId),
  ],
);
