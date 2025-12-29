ALTER TABLE "users" ADD COLUMN "invitation_code" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "invited_by" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_invitation_code_unique" UNIQUE("invitation_code");