CREATE TABLE "execution_actor_participations" (
	"id" text PRIMARY KEY NOT NULL,
	"execution_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"role_namespace" text NOT NULL,
	"role_type" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "execution_actor_participations" ADD CONSTRAINT "execution_actor_participations_execution_id_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."executions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "execution_actor_participations_execution_id_idx" ON "execution_actor_participations" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "execution_actor_participations_actor_id_idx" ON "execution_actor_participations" USING btree ("actor_id");
