import {
  foreignKey,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { researchFindings } from "./findings.js";

export const researchFindingValidations = pgTable(
  "research_finding_validations",
  {
    id: text("id").primaryKey(),

    findingId: text("finding_id").notNull(),

    status: text("status").notNull(),

    decision: text("decision"),

    rationale: text("rationale"),

    validator: text("validator"),

    confidenceAtValidation: real(
      "confidence_at_validation",
    ),

    supportingEvidenceCount: integer(
      "supporting_evidence_count",
    ).notNull(),

    contradictingEvidenceCount: integer(
      "contradicting_evidence_count",
    ).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull(),

    validatedAt: timestamp("validated_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    foreignKey({
      columns: [table.findingId],
      foreignColumns: [researchFindings.id],
    }).onDelete("no action"),

    index(
      "research_finding_validations_finding_id_idx",
    ).on(table.findingId),

    index(
      "research_finding_validations_status_idx",
    ).on(table.status),

    index(
      "research_finding_validations_updated_at_idx",
    ).on(table.updatedAt),
  ],
);

export const researchFindingValidationHistory = pgTable(
  "research_finding_validation_history",
  {
    id: text("id").primaryKey(),

    validationId: text("validation_id").notNull(),

    fromStatus: text("from_status"),

    toStatus: text("to_status").notNull(),

    decision: text("decision"),

    reason: text("reason"),

    timestamp: timestamp("timestamp", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.validationId],
      foreignColumns: [researchFindingValidations.id],
    }).onDelete("no action"),

    index(
      "research_finding_validation_history_validation_id_idx",
    ).on(table.validationId),

    index(
      "research_finding_validation_history_timestamp_idx",
    ).on(table.timestamp),
  ],
);
