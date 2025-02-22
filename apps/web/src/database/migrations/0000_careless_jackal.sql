CREATE TYPE "public"."vitnode_core_app_type" AS ENUM('website', 'article', 'book', 'music.album', 'music.playlist', 'music.radio_station', 'music.song', 'profile', 'video.episode', 'video.movie', 'video.tv_show');--> statement-breakpoint
CREATE TABLE "core_config" (
	"app_type" "vitnode_core_app_type" DEFAULT 'website' NOT NULL,
	"restart_server" boolean DEFAULT false NOT NULL,
	"editor_sticky" boolean DEFAULT true NOT NULL,
	"site_name" varchar(150) DEFAULT 'VitNode' NOT NULL,
	"site_short_name" varchar(75) DEFAULT 'VitNode' NOT NULL,
	"contact_email" varchar DEFAULT '' NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"auth_force_login" boolean DEFAULT false NOT NULL,
	"auth_lock_register" boolean DEFAULT false NOT NULL,
	"auth_require_confirm_email" boolean DEFAULT false NOT NULL,
	"admin_note" text DEFAULT 'Enter your note here. :)' NOT NULL,
	"admin_note_updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_groups" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"protected" boolean DEFAULT false NOT NULL,
	"default" boolean DEFAULT false NOT NULL,
	"root" boolean DEFAULT false NOT NULL,
	"guest" boolean DEFAULT false NOT NULL,
	"color" varchar(19),
	"files_allow_upload" boolean DEFAULT true NOT NULL,
	"files_total_max_storage" integer DEFAULT 500000 NOT NULL,
	"files_max_storage_for_submit" integer DEFAULT 5000 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(255) NOT NULL,
	"timezone" varchar(255) DEFAULT 'UTC' NOT NULL,
	"protected" boolean DEFAULT false NOT NULL,
	"default" boolean DEFAULT false NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"time_24" boolean DEFAULT false NOT NULL,
	"allow_in_input" boolean DEFAULT true NOT NULL,
	CONSTRAINT "core_languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "core_languages_words" (
	"id" uuid PRIMARY KEY NOT NULL,
	"language_code" varchar NOT NULL,
	"plugin_code" varchar(50) NOT NULL,
	"item_id" integer NOT NULL,
	"value" text NOT NULL,
	"table_name" varchar(255) NOT NULL,
	"variable" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_files_avatars" (
	"id" uuid PRIMARY KEY NOT NULL,
	"dir_folder" varchar(255) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"file_size" integer NOT NULL,
	"mimetype" varchar(255) NOT NULL,
	"extension" varchar(32) NOT NULL,
	"user_id" uuid,
	CONSTRAINT "core_files_avatars_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "core_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name_seo" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"newsletter" boolean DEFAULT false NOT NULL,
	"avatar_color" varchar(6) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"group_id" uuid NOT NULL,
	"birthday" timestamp,
	"ip_address" varchar(40) NOT NULL,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	CONSTRAINT "core_users_name_seo_unique" UNIQUE("name_seo"),
	CONSTRAINT "core_users_name_unique" UNIQUE("name"),
	CONSTRAINT "core_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "core_users_confirm_emails" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "core_users_confirm_emails_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "core_users_forgot_password" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(100) NOT NULL,
	"ip_address" varchar(40) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "core_users_forgot_password_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "core_users_forgot_password_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "core_users_sso" (
	"code" varchar(100) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"client_secret" varchar(255) NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	CONSTRAINT "core_users_sso_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "core_users_sso_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" varchar(100) NOT NULL,
	"provider_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "core_languages_words" ADD CONSTRAINT "core_languages_words_language_code_core_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."core_languages"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_files_avatars" ADD CONSTRAINT "core_files_avatars_user_id_core_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_users" ADD CONSTRAINT "core_users_group_id_core_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."core_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_users" ADD CONSTRAINT "core_users_language_core_languages_code_fk" FOREIGN KEY ("language") REFERENCES "public"."core_languages"("code") ON DELETE set default ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_users_confirm_emails" ADD CONSTRAINT "core_users_confirm_emails_user_id_core_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_users_forgot_password" ADD CONSTRAINT "core_users_forgot_password_user_id_core_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_users_sso_tokens" ADD CONSTRAINT "core_users_sso_tokens_user_id_core_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_users_sso_tokens" ADD CONSTRAINT "core_users_sso_tokens_provider_core_users_sso_code_fk" FOREIGN KEY ("provider") REFERENCES "public"."core_users_sso"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "core_languages_code_idx" ON "core_languages" USING btree ("code");--> statement-breakpoint
CREATE INDEX "core_languages_name_idx" ON "core_languages" USING btree ("name");--> statement-breakpoint
CREATE INDEX "core_languages_words_lang_code_idx" ON "core_languages_words" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "core_users_name_seo_idx" ON "core_users" USING btree ("name_seo");--> statement-breakpoint
CREATE INDEX "core_users_name_idx" ON "core_users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "core_users_email_idx" ON "core_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "core_users_sso_tokens_user_id_idx" ON "core_users_sso_tokens" USING btree ("user_id");