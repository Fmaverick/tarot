ALTER TABLE "sessions" ADD COLUMN "mode" text DEFAULT 'fixed' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "custom_spread_config" text;