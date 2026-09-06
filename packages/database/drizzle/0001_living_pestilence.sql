CREATE TABLE "execution_lifecycle_transitions" (
	"id" text PRIMARY KEY NOT NULL,
	"execution_id" text NOT NULL,
	"from_state" text NOT NULL,
	"to_state" text NOT NULL,
	"reason" text,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "executions" (
	"id" text PRIMARY KEY NOT NULL,
	"lifecycle_state" text NOT NULL,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "execution_lifecycle_transitions" ADD CONSTRAINT "execution_lifecycle_transitions_execution_id_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."executions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "execution_lifecycle_transitions_execution_id_idx" ON "execution_lifecycle_transitions" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "execution_lifecycle_transitions_timestamp_idx" ON "execution_lifecycle_transitions" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "executions_lifecycle_state_idx" ON "executions" USING btree ("lifecycle_state");--> statement-breakpoint
CREATE INDEX "executions_started_at_idx" ON "executions" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "executions_ended_at_idx" ON "executions" USING btree ("ended_at");
