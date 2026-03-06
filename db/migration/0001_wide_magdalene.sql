ALTER TABLE "invitation" ALTER COLUMN "organization_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "member" ALTER COLUMN "organization_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text;