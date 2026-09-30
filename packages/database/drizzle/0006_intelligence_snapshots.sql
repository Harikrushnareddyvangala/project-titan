CREATE TABLE "intelligence_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"repository" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"analytics" jsonb NOT NULL
);
