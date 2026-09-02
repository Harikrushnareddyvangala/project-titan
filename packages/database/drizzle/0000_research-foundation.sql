CREATE TABLE "research_artifacts" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"uri" text,
	"mime_type" text,
	"checksum" text,
	"size_bytes" bigint,
	"metadata" jsonb,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_conclusion_contradicting_findings" (
	"conclusion_id" text NOT NULL,
	"finding_id" text NOT NULL,
	CONSTRAINT "research_conclusion_contradicting_findings_conclusion_id_finding_id_pk" PRIMARY KEY("conclusion_id","finding_id")
);
--> statement-breakpoint
CREATE TABLE "research_conclusion_supporting_findings" (
	"conclusion_id" text NOT NULL,
	"finding_id" text NOT NULL,
	CONSTRAINT "research_conclusion_supporting_findings_conclusion_id_finding_id_pk" PRIMARY KEY("conclusion_id","finding_id")
);
--> statement-breakpoint
CREATE TABLE "research_evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"reference" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_evidence_assessments" (
	"id" text PRIMARY KEY NOT NULL,
	"finding_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	"type" text NOT NULL,
	"relevance" real NOT NULL,
	"support_strength" real NOT NULL,
	"reliability" real NOT NULL,
	"independence" real NOT NULL,
	"rationale" text,
	"assessed_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "research_evidence_assessments_finding_evidence_unique" UNIQUE("finding_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "research_experiment_evidence" (
	"experiment_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	CONSTRAINT "research_experiment_evidence_experiment_id_evidence_id_pk" PRIMARY KEY("experiment_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "research_experiment_findings" (
	"experiment_id" text NOT NULL,
	"finding_id" text NOT NULL,
	CONSTRAINT "research_experiment_findings_experiment_id_finding_id_pk" PRIMARY KEY("experiment_id","finding_id")
);
--> statement-breakpoint
CREATE TABLE "research_experiment_lifecycle_events" (
	"id" text PRIMARY KEY NOT NULL,
	"experiment_id" text NOT NULL,
	"from_status" text,
	"to_status" text NOT NULL,
	"reason" text,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_experiments" (
	"id" text PRIMARY KEY NOT NULL,
	"investigation_id" text NOT NULL,
	"title" text NOT NULL,
	"objective" text NOT NULL,
	"status" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_finding_validation_history" (
	"id" text PRIMARY KEY NOT NULL,
	"validation_id" text NOT NULL,
	"from_status" text,
	"to_status" text NOT NULL,
	"decision" text,
	"reason" text,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_finding_validations" (
	"id" text PRIMARY KEY NOT NULL,
	"finding_id" text NOT NULL,
	"status" text NOT NULL,
	"decision" text,
	"rationale" text,
	"validator" text,
	"confidence_at_validation" real,
	"supporting_evidence_count" integer NOT NULL,
	"contradicting_evidence_count" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"validated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "research_findings" (
	"id" text PRIMARY KEY NOT NULL,
	"statement" text NOT NULL,
	"confidence" real,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_investigation_artifacts" (
	"investigation_id" text NOT NULL,
	"artifact_id" text NOT NULL,
	CONSTRAINT "research_investigation_artifacts_investigation_id_artifact_id_pk" PRIMARY KEY("investigation_id","artifact_id")
);
--> statement-breakpoint
CREATE TABLE "research_investigation_conclusions" (
	"id" text PRIMARY KEY NOT NULL,
	"investigation_id" text NOT NULL,
	"statement" text NOT NULL,
	"status" text NOT NULL,
	"uncertainty" text,
	"next_action" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_investigation_evidence" (
	"investigation_id" text NOT NULL,
	"evidence_id" text NOT NULL,
	CONSTRAINT "research_investigation_evidence_investigation_id_evidence_id_pk" PRIMARY KEY("investigation_id","evidence_id")
);
--> statement-breakpoint
CREATE TABLE "research_investigation_findings" (
	"investigation_id" text NOT NULL,
	"finding_id" text NOT NULL,
	CONSTRAINT "research_investigation_findings_investigation_id_finding_id_pk" PRIMARY KEY("investigation_id","finding_id")
);
--> statement-breakpoint
CREATE TABLE "research_investigations" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"objective" text NOT NULL,
	"question" text NOT NULL,
	"status" text NOT NULL,
	"description" text,
	"repository" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_provenance_events" (
	"id" text PRIMARY KEY NOT NULL,
	"investigation_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"event_type" text NOT NULL,
	"from_status" text,
	"to_status" text,
	"reason" text,
	"actor" text,
	"timestamp" timestamp with time zone NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "research_conclusion_contradicting_findings" ADD CONSTRAINT "research_conclusion_contradicting_findings_conclusion_id_research_investigation_conclusions_id_fk" FOREIGN KEY ("conclusion_id") REFERENCES "public"."research_investigation_conclusions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_conclusion_contradicting_findings" ADD CONSTRAINT "research_conclusion_contradicting_findings_finding_id_research_findings_id_fk" FOREIGN KEY ("finding_id") REFERENCES "public"."research_findings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_conclusion_supporting_findings" ADD CONSTRAINT "research_conclusion_supporting_findings_conclusion_id_research_investigation_conclusions_id_fk" FOREIGN KEY ("conclusion_id") REFERENCES "public"."research_investigation_conclusions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_conclusion_supporting_findings" ADD CONSTRAINT "research_conclusion_supporting_findings_finding_id_research_findings_id_fk" FOREIGN KEY ("finding_id") REFERENCES "public"."research_findings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_evidence_assessments" ADD CONSTRAINT "research_evidence_assessments_finding_id_research_findings_id_fk" FOREIGN KEY ("finding_id") REFERENCES "public"."research_findings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_evidence_assessments" ADD CONSTRAINT "research_evidence_assessments_evidence_id_research_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."research_evidence"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_experiment_evidence" ADD CONSTRAINT "research_experiment_evidence_experiment_id_research_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."research_experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_experiment_evidence" ADD CONSTRAINT "research_experiment_evidence_evidence_id_research_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."research_evidence"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_experiment_findings" ADD CONSTRAINT "research_experiment_findings_experiment_id_research_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."research_experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_experiment_findings" ADD CONSTRAINT "research_experiment_findings_finding_id_research_findings_id_fk" FOREIGN KEY ("finding_id") REFERENCES "public"."research_findings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_experiment_lifecycle_events" ADD CONSTRAINT "research_experiment_lifecycle_events_experiment_id_research_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."research_experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_experiments" ADD CONSTRAINT "research_experiments_investigation_id_research_investigations_id_fk" FOREIGN KEY ("investigation_id") REFERENCES "public"."research_investigations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_finding_validation_history" ADD CONSTRAINT "research_finding_validation_history_validation_id_research_finding_validations_id_fk" FOREIGN KEY ("validation_id") REFERENCES "public"."research_finding_validations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_finding_validations" ADD CONSTRAINT "research_finding_validations_finding_id_research_findings_id_fk" FOREIGN KEY ("finding_id") REFERENCES "public"."research_findings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_investigation_artifacts" ADD CONSTRAINT "research_investigation_artifacts_investigation_id_research_investigations_id_fk" FOREIGN KEY ("investigation_id") REFERENCES "public"."research_investigations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_investigation_artifacts" ADD CONSTRAINT "research_investigation_artifacts_artifact_id_research_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."research_artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_investigation_conclusions" ADD CONSTRAINT "research_investigation_conclusions_investigation_id_research_investigations_id_fk" FOREIGN KEY ("investigation_id") REFERENCES "public"."research_investigations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_investigation_evidence" ADD CONSTRAINT "research_investigation_evidence_investigation_id_research_investigations_id_fk" FOREIGN KEY ("investigation_id") REFERENCES "public"."research_investigations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_investigation_evidence" ADD CONSTRAINT "research_investigation_evidence_evidence_id_research_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."research_evidence"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_investigation_findings" ADD CONSTRAINT "research_investigation_findings_investigation_id_research_investigations_id_fk" FOREIGN KEY ("investigation_id") REFERENCES "public"."research_investigations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_investigation_findings" ADD CONSTRAINT "research_investigation_findings_finding_id_research_findings_id_fk" FOREIGN KEY ("finding_id") REFERENCES "public"."research_findings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_provenance_events" ADD CONSTRAINT "research_provenance_events_investigation_id_research_investigations_id_fk" FOREIGN KEY ("investigation_id") REFERENCES "public"."research_investigations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "research_artifacts_type_idx" ON "research_artifacts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "research_artifacts_checksum_idx" ON "research_artifacts" USING btree ("checksum");--> statement-breakpoint
CREATE INDEX "research_artifacts_created_at_idx" ON "research_artifacts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "research_artifacts_updated_at_idx" ON "research_artifacts" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "research_conclusion_contradicting_findings_finding_id_idx" ON "research_conclusion_contradicting_findings" USING btree ("finding_id");--> statement-breakpoint
CREATE INDEX "research_conclusion_supporting_findings_finding_id_idx" ON "research_conclusion_supporting_findings" USING btree ("finding_id");--> statement-breakpoint
CREATE INDEX "research_evidence_type_idx" ON "research_evidence" USING btree ("type");--> statement-breakpoint
CREATE INDEX "research_evidence_created_at_idx" ON "research_evidence" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "research_evidence_assessments_finding_id_idx" ON "research_evidence_assessments" USING btree ("finding_id");--> statement-breakpoint
CREATE INDEX "research_evidence_assessments_evidence_id_idx" ON "research_evidence_assessments" USING btree ("evidence_id");--> statement-breakpoint
CREATE INDEX "research_evidence_assessments_type_idx" ON "research_evidence_assessments" USING btree ("type");--> statement-breakpoint
CREATE INDEX "research_evidence_assessments_assessed_at_idx" ON "research_evidence_assessments" USING btree ("assessed_at");--> statement-breakpoint
CREATE INDEX "research_experiment_evidence_evidence_id_idx" ON "research_experiment_evidence" USING btree ("evidence_id");--> statement-breakpoint
CREATE INDEX "research_experiment_findings_finding_id_idx" ON "research_experiment_findings" USING btree ("finding_id");--> statement-breakpoint
CREATE INDEX "research_experiment_lifecycle_events_experiment_id_idx" ON "research_experiment_lifecycle_events" USING btree ("experiment_id");--> statement-breakpoint
CREATE INDEX "research_experiment_lifecycle_events_timestamp_idx" ON "research_experiment_lifecycle_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "research_experiments_investigation_id_idx" ON "research_experiments" USING btree ("investigation_id");--> statement-breakpoint
CREATE INDEX "research_experiments_status_idx" ON "research_experiments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "research_experiments_updated_at_idx" ON "research_experiments" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "research_finding_validation_history_validation_id_idx" ON "research_finding_validation_history" USING btree ("validation_id");--> statement-breakpoint
CREATE INDEX "research_finding_validation_history_timestamp_idx" ON "research_finding_validation_history" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "research_finding_validations_finding_id_idx" ON "research_finding_validations" USING btree ("finding_id");--> statement-breakpoint
CREATE INDEX "research_finding_validations_status_idx" ON "research_finding_validations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "research_finding_validations_updated_at_idx" ON "research_finding_validations" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "research_findings_created_at_idx" ON "research_findings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "research_findings_updated_at_idx" ON "research_findings" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "research_investigation_artifacts_artifact_id_idx" ON "research_investigation_artifacts" USING btree ("artifact_id");--> statement-breakpoint
CREATE INDEX "research_investigation_conclusions_investigation_id_idx" ON "research_investigation_conclusions" USING btree ("investigation_id");--> statement-breakpoint
CREATE INDEX "research_investigation_conclusions_status_idx" ON "research_investigation_conclusions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "research_investigation_conclusions_updated_at_idx" ON "research_investigation_conclusions" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "research_investigation_evidence_evidence_id_idx" ON "research_investigation_evidence" USING btree ("evidence_id");--> statement-breakpoint
CREATE INDEX "research_investigation_findings_finding_id_idx" ON "research_investigation_findings" USING btree ("finding_id");--> statement-breakpoint
CREATE INDEX "research_investigations_status_idx" ON "research_investigations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "research_investigations_updated_at_idx" ON "research_investigations" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "research_provenance_events_investigation_id_idx" ON "research_provenance_events" USING btree ("investigation_id");--> statement-breakpoint
CREATE INDEX "research_provenance_events_entity_idx" ON "research_provenance_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "research_provenance_events_event_type_idx" ON "research_provenance_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "research_provenance_events_timestamp_idx" ON "research_provenance_events" USING btree ("timestamp");