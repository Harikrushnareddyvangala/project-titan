import {
  foreignKey,
  index,
  pgTable,
  real,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { researchEvidence } from "./evidence.js";
import { researchFindings } from "./findings.js";

export const researchEvidenceAssessments = pgTable(
  "research_evidence_assessments",
  {
    id: text("id").primaryKey(),

    findingId: text("finding_id").notNull(),

    evidenceId: text("evidence_id").notNull(),

    type: text("type").notNull(),

    relevance: real("relevance").notNull(),

    supportStrength: real("support_strength").notNull(),

    reliability: real("reliability").notNull(),

    independence: real("independence").notNull(),

    rationale: text("rationale"),

    assessedAt: timestamp("assessed_at", {
      withTimezone: true,
    }).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.findingId],
      foreignColumns: [researchFindings.id],
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.evidenceId],
      foreignColumns: [researchEvidence.id],
    }).onDelete("cascade"),

    unique(
      "research_evidence_assessments_finding_evidence_unique",
    ).on(table.findingId, table.evidenceId),

    index(
      "research_evidence_assessments_finding_id_idx",
    ).on(table.findingId),

    index(
      "research_evidence_assessments_evidence_id_idx",
    ).on(table.evidenceId),

    index(
      "research_evidence_assessments_type_idx",
    ).on(table.type),

    index(
      "research_evidence_assessments_assessed_at_idx",
    ).on(table.assessedAt),
  ],
);
