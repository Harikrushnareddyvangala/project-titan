CREATE TABLE "intelligence_artifacts" (
	"artifact_id" text PRIMARY KEY NOT NULL,
	"artifact_type" text NOT NULL,
	"repository" text NOT NULL,
	"source_snapshot_id" text NOT NULL,
	"author" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"generated_at" timestamp with time zone NOT NULL,
	"version" text NOT NULL,
	"format" text NOT NULL,
	"source" text NOT NULL,
	"status" text NOT NULL,
	"previous_artifact_id" text,
	"metadata" jsonb NOT NULL,
	"integrity" jsonb,
	"signature" jsonb
);
--> statement-breakpoint
ALTER TABLE "intelligence_artifacts" ADD CONSTRAINT "intelligence_artifacts_source_snapshot_id_intelligence_snapshots_id_fk" FOREIGN KEY ("source_snapshot_id") REFERENCES "public"."intelligence_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intelligence_artifacts" ADD CONSTRAINT "intelligence_artifacts_previous_artifact_fk" FOREIGN KEY ("previous_artifact_id") REFERENCES "public"."intelligence_artifacts"("artifact_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "intelligence_artifacts_source_type_version_idx" ON "intelligence_artifacts" USING btree ("source_snapshot_id","artifact_type","version");--> statement-breakpoint
CREATE INDEX "intelligence_artifacts_previous_artifact_idx" ON "intelligence_artifacts" USING btree ("previous_artifact_id");