CREATE TABLE "ai_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"temperature" text NOT NULL,
	"top_p" text NOT NULL,
	"top_k" text NOT NULL,
	"erp_system" text NOT NULL,
	"short_desc_limit" integer NOT NULL,
	"long_desc_limit" integer NOT NULL,
	"learning_mode" text NOT NULL,
	"additional_context" text,
	"examples" jsonb,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "learning_examples" (
	"id" serial PRIMARY KEY NOT NULL,
	"input" text NOT NULL,
	"output" text NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"material_id" text,
	"material_name" text NOT NULL,
	"material_type" text NOT NULL,
	"basic_description" text NOT NULL,
	"technical_specs" text,
	"manufacturer" text,
	"model_number" text,
	"primary_group" text NOT NULL,
	"secondary_group" text,
	"tertiary_group" text,
	"short_description" text,
	"long_description" text,
	"specifications" jsonb,
	"processed_at" timestamp DEFAULT now(),
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "processing_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" text,
	"material_count" integer NOT NULL,
	"successful" integer NOT NULL,
	"failed" integer NOT NULL,
	"processed_at" timestamp DEFAULT now(),
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "processing_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"material_id" integer,
	"short_description" text NOT NULL,
	"long_description" text NOT NULL,
	"specifications" jsonb,
	"classification_groups" jsonb NOT NULL,
	"processed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "ai_settings" ADD CONSTRAINT "ai_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_examples" ADD CONSTRAINT "learning_examples_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processing_history" ADD CONSTRAINT "processing_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processing_results" ADD CONSTRAINT "processing_results_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE no action ON UPDATE no action;