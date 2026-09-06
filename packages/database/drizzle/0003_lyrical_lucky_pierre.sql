CREATE TABLE "execution_resource_interactions" (
	"id" text PRIMARY KEY NOT NULL,
	"execution_id" text NOT NULL,
	"target_kind" text NOT NULL,
	"target_resource_id" text NOT NULL,
	"target_resource_type" text NOT NULL,
	"target_resource_namespace" text NOT NULL,
	"target_revision_version" text,
	"target_revision_created_at" timestamp with time zone,
	"operation_namespace" text NOT NULL,
	"operation_type" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "execution_resource_interactions_target_kind_check" CHECK ("execution_resource_interactions"."target_kind" IN ('resource', 'revision')),
	CONSTRAINT "execution_resource_interactions_target_revision_consistency_check" CHECK ((
        ("execution_resource_interactions"."target_kind" = 'resource'
          AND "execution_resource_interactions"."target_revision_version" IS NULL
          AND "execution_resource_interactions"."target_revision_created_at" IS NULL)
        OR
        ("execution_resource_interactions"."target_kind" = 'revision'
          AND "execution_resource_interactions"."target_revision_version" IS NOT NULL
          AND "execution_resource_interactions"."target_revision_created_at" IS NOT NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "execution_resource_interactions" ADD CONSTRAINT "execution_resource_interactions_execution_id_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."executions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "execution_resource_interactions_execution_id_idx" ON "execution_resource_interactions" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "execution_resource_interactions_target_resource_id_idx" ON "execution_resource_interactions" USING btree ("target_resource_id");--> statement-breakpoint
CREATE INDEX "execution_resource_interactions_operation_idx" ON "execution_resource_interactions" USING btree ("operation_namespace","operation_type");--> statement-breakpoint
CREATE INDEX "execution_resource_interactions_created_at_idx" ON "execution_resource_interactions" USING btree ("created_at");
