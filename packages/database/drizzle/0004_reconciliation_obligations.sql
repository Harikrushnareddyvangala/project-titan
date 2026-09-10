CREATE TABLE "research_reconciliation_obligations" (
	"id" text PRIMARY KEY NOT NULL,
	"investigation_id" text NOT NULL,
	"issue_code" text NOT NULL,
	"target_entity_type" text NOT NULL,
	"target_entity_id" text NOT NULL,
	"remediation_action" text NOT NULL,
	"remediation_execution_id" text,
	"provenance_event_id" text,
	"status" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "research_reconciliation_obligations"
	ADD CONSTRAINT "research_reconciliation_obligations_investigation_id_research_investigations_id_fk"
	FOREIGN KEY ("investigation_id")
	REFERENCES "public"."research_investigations"("id")
	ON DELETE cascade
	ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "research_reconciliation_obligations_investigation_id_idx"
	ON "research_reconciliation_obligations"
	USING btree ("investigation_id");
--> statement-breakpoint
CREATE INDEX "research_reconciliation_obligations_status_idx"
	ON "research_reconciliation_obligations"
	USING btree ("status");
--> statement-breakpoint
CREATE INDEX "research_reconciliation_obligations_target_entity_idx"
	ON "research_reconciliation_obligations"
	USING btree ("target_entity_type", "target_entity_id");
--> statement-breakpoint
CREATE INDEX "research_reconciliation_obligations_updated_at_idx"
	ON "research_reconciliation_obligations"
	USING btree ("updated_at");
