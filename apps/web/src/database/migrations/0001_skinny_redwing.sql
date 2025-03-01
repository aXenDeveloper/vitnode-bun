ALTER TABLE "core_users_sso" ADD COLUMN "provider_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "core_users_sso" DROP COLUMN "provider";