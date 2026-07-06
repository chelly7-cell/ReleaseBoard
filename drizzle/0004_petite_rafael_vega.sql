ALTER TABLE "updates" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "updates" ADD COLUMN "content" jsonb;