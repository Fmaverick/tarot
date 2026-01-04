CREATE TABLE "sephiroth_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"data" text NOT NULL,
	"descriptions" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sephiroth_data_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
ALTER TABLE "sephiroth_data" ADD CONSTRAINT "sephiroth_data_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;