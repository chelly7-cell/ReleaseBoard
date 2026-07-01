ALTER TABLE "updates" RENAME COLUMN "content" TO "description";--> statement-breakpoint
ALTER TABLE "updates" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "updates" ALTER COLUMN "version" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "updates" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "updates" ALTER COLUMN "status" SET DEFAULT 'published';--> statement-breakpoint
ALTER TABLE "updates" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "views" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "updates_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "updates" ADD COLUMN "type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "updates" ADD COLUMN "publish_date" timestamp DEFAULT now();