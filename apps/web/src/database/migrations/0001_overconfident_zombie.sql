ALTER TABLE "core_users_sso_tokens" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "core_users_sso_tokens" CASCADE;--> statement-breakpoint
ALTER TABLE "core_users_sso" DROP CONSTRAINT "core_users_sso_code_unique";--> statement-breakpoint
ALTER TABLE "core_config" ALTER COLUMN "admin_note_updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "core_groups" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "core_languages" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "core_users_sso" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "core_users_sso" ADD COLUMN "provider" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "core_users_sso" ADD COLUMN "provider_account_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "core_users_sso" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "core_users_sso" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "core_users_sso" ADD CONSTRAINT "core_users_sso_user_id_core_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "core_users_sso_user_id_idx" ON "core_users_sso" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "core_users_sso" DROP COLUMN "code";--> statement-breakpoint
ALTER TABLE "core_users_sso" DROP COLUMN "client_id";--> statement-breakpoint
ALTER TABLE "core_users_sso" DROP COLUMN "client_secret";--> statement-breakpoint
ALTER TABLE "core_users_sso" DROP COLUMN "enabled";