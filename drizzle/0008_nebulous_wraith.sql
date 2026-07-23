DROP INDEX "applications_user_id_idx";--> statement-breakpoint
DROP INDEX "applications_name_idx";--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "github_owner" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "github_repo" text;--> statement-breakpoint
CREATE INDEX "subscribers_application_id_idx" ON "subscribers" USING btree ("application_id");