CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"user_id" text NOT NULL,
	"logo" text,
	"views" integer DEFAULT 0 NOT NULL,
	"updates_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"version" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"application_id" integer NOT NULL,
	"description" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"publish_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "updates" ADD CONSTRAINT "updates_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "applications_user_id_idx" ON "applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "applications_name_idx" ON "applications" USING btree ("name");--> statement-breakpoint
CREATE INDEX "updates_application_id_idx" ON "updates" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "updates_status_idx" ON "updates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "updates_publish_date_idx" ON "updates" USING btree ("publish_date");