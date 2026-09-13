CREATE UNIQUE INDEX "research_reconciliation_obligations_active_identity_unique"
ON "research_reconciliation_obligations"
USING btree (
  "investigation_id",
  "issue_code",
  "target_entity_type",
  "target_entity_id"
)
WHERE "status" IN ('Open', 'In Progress');
