ALTER TABLE "core_sessions" ADD COLUMN "token" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "core_sessions" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "core_sessions" ADD CONSTRAINT "core_sessions_token_unique" UNIQUE("token");